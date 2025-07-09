import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./database/dbconnect.js";
import userRoute from "./routes/user.routes.js";
import videoRoute from "./routes/video.routes.js";
import commentRoute from "./routes/comment.routes.js";
import authRoute from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app=express();

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));
app.use(cookieParser())
app.use(express.json())
app.use("/api/users",userRoute)
app.use("/api/videos",videoRoute)
app.use("/api/comments",commentRoute)
app.use("/api/auth",authRoute)

const Port=process.env.PORT || 4000;
app.listen(Port,()=>{
    ConnectDB()
    console.log("connected")
})