import express from "express";

import {
  getFlashcardTopics,
  generateFlashcards,
} from "../controllers/flashcardController.js";

const router = express.Router();

router.get( "/topics", getFlashcardTopics );

router.post( "/", generateFlashcards);

export default router;