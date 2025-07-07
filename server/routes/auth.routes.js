import express from "express"
const router=express.Router();
import {signup,signin,googleAuth } from "../controllers/auth.controller.js";

//create a user
router.post("/signup", signup)
//signin 
router.post("/signin", signin)
//google auth
router.post("/google", googleAuth)

export default router