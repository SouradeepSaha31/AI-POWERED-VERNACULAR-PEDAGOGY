import axios from "axios";
import { curriculumLessons } from "../data/curriculum.js";

export async function generateWorksheet(req, res) {
  try {

    const {
      lessonId,
      targetLanguage = "sat",
      difficulty = "Easy",
      numQuestions = 5,
    } = req.body;

    const lesson = curriculumLessons.find(
      (item) => item.id === lessonId
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: "Lesson not found",
      });
    }

    const response = await axios.post(
      "http://localhost:8000/generate-worksheet",
      {
        lesson,
        target_language: targetLanguage,
        difficulty,
        num_questions: numQuestions,
      }
    );

    res.json(response.data);

  } catch (error) {

    console.error(
      "Worksheet error:",
      error.message
    );

    res.status(500).json({
      success: false,
      error: "Worksheet generation service unavailable",
    });
  }
}