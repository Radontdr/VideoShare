import express from "express"
const router=express.Router();
import {signup,signin,googleAuth,refreshaccesstoken } from "../controllers/auth.controller.js";

//create a user
router.post("/signup", signup)
//signin 
router.post("/signin", signin)
//google auth
router.post("/google", googleAuth)

//refresh access token
router.post("/refresh-token", refreshaccesstoken)

export default router