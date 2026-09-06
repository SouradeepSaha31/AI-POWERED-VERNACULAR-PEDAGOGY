import axios from "axios";

export async function generateFlashcards(req, res) {
  try {

    const {
      topic,
      targetLanguage = "sat",
      count = 6,
    } = req.body;

    const response = await axios.post(
      "http://localhost:8000/generate-flashcards",
      {
        topic,
        target_language: targetLanguage,
        count,
      }
    );

    res.json(response.data);

  } catch (error) {

    console.error(
      "Flashcard error:",
      error.message
    );

    res.status(500).json({
      success: false,
      error:
        "Flashcard generation service unavailable",
    });
  }
}