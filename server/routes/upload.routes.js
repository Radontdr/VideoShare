import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { handleFileUpload } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/file", upload.single("file"), handleFileUpload);

export default router;
