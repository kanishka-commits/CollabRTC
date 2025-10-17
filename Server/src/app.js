import express from "express";
import {createServer} from "node:http";
import { connectToSocket } from "./controllers/socketManager.js";


import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/users.routes.js";


const app=express();
const server=createServer(app);
const io=connectToSocket(server);
const port=3000;

 
app.set("port", (process.env.port || 3000)); // kind of local storage


app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb", extended:true}));

const connectionDb= await mongoose.connect("mongodb+srv://<username>:<password>@clusterrtc.488cknu.mongodb.net/");

console.log(connectionDb.connection.host);
server.listen(app.get("port"),()=>{
    console.log(`I'm listening to port ${port}`);
})

app.use("/api/v1/users", userRoutes);