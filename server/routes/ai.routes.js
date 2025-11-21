// server/routes/ai.routes.js
import express from "express";
import { generateIdeas, getTrendingTopics } from "../controllers/ai.controller.js";

const router = express.Router();

router.get("/trending", getTrendingTopics);
router.post("/generate", generateIdeas);

export default router;
