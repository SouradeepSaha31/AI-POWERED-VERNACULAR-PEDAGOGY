import axios from "axios";

import {
  getBookById,
} from "../data/curriculum.js";

export async function generateWorksheet(req, res) {
  try {
    const {
      bookId,
      chapterId,
      difficulty = "Easy",
      numQuestions = 5,
      targetLanguage = "sat",
    } = req.body;

    if (!bookId || !chapterId) {
      return res.status(400).json({
        success: false,
        error: "Book and chapter are required.",
      });
    }

    const book = getBookById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found.",
      });
    }

    const chapter = book.chapters.find(
      (item) => item.id === chapterId
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: "Chapter not found in this book.",
      });
    }

    const response = await axios.post(
      "http://localhost:8000/generate-worksheet",
      {
        book,
        chapter,
        difficulty,
        num_questions: Number(numQuestions),
        target_language: targetLanguage,
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(
      "Worksheet gateway error:",
      error.message
    );

    res.status(500).json({
      success: false,
      error: "Worksheet generation service unavailable.",
    });
  }
}