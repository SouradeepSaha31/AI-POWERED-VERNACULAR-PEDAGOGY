import express from "express";
import multer from "multer";
import {
  voiceTranslate,
  speechToText,
  textToSpeech
} from "../controllers/voiceController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB audio limit
  }
});

// Full voice-to-voice pipeline (Hindi audio -> Hindi text -> Santali text)
router.post("/", upload.single("file"), voiceTranslate );

// Standalone Speech-to-Text (Audio -> Transcribed text)
router.post("/stt", upload.single("file"), speechToText);

// Standalone Text-to-Speech (Text -> Synthesized MP3 audio stream)
router.post("/tts", textToSpeech);

export default router;