import express from "express";

import {
  generateFlashcards,
} from "../controllers/flashcardController.js";

const router = express.Router();

router.post("/", generateFlashcards);

export default router;