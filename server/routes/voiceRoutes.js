import express from "express";
import multer from "multer";

import {voiceTranslate} from "../controllers/voiceController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});

router.post(
  "/",
  upload.single("file"),
  voiceTranslate
);

export default router;