import express from "express";
import { createServer } from "node:http";
import { connectToSocket } from "./controllers/socketManager.js";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

// MongoDB Compass URI (replace <username>, <password>, <dbname>)
const MONGO_URI =
    "mongodb+srv:// <username>:<password>@clusterrtc.488cknu.mongodb.net/";


// Start server and connect to MongoDB
const startServer = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true, // ensure TLS is enabled
      tlsAllowInvalidCertificates: false, // set to true only for debugging
    });

    console.log(
      `✅ MongoDB connected at host: ${connection.connection.host}`
    );

    server.listen(PORT, () =>
      console.log(`🚀 Server listening on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

startServer();
