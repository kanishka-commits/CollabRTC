import httpStatus from "http-status";
import {User} from "../models/user.model.js"
import bcrypt,{hash} from "bcrypt"
import crypto from "crypto"
import { Meeting } from "../models/meeting.model.js";

const login=async(req,res)=>{
    const {username, password}=req.body;
    if(!username || !password) {
        return res.status(400).json({message:"Please Provide" })
    }
    try{
        const user=await User.findOne({username});
        if(!user){
            return res.send(httpStatus.NOT_FOUND).json({message:"User Not Found!"});
        }
        // Add 'await' before bcrypt.compare
        if (await bcrypt.compare(password, user.password)) {
            let token = crypto.randomBytes(20).toString("hex");
            
            // Minor fix: user is an object, not an array
            console.log("user is", user); 
            
            user.token = token;
            await user.save();

            return res.status(httpStatus.OK).json({ token: token })
        } else {
            // You should also add an 'else' block for wrong passwords
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid username or password" });
        }
    }catch(e){ 
        return res.status(500).json({message:`Something went wrong ${e} `})
    }
}
const register = async(req,res)=>{  
    const {name, username,password} =req.body;

    try{
        const existingUser=await User.findOne({username});
        if(existingUser) {
            return res.status(httpStatus.FOUND).json({message:"User ALready Exists"});
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new User({
            name:name,
            username:username,
            password:hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({message:"User Registered"})
    }catch(e){
        res.json({message:`Something went wrong ${e}`})
    }
}

const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        const meetings = await Meeting.find({ user_id: user.username })
        res.json(meetings)
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

export {login, register, getUserHistory, addToHistory};