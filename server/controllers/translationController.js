import axios from "axios";

export async function translateText(req, res) {
  try {
    const {
      text,
      sourceLanguage = "hi",
      targetLanguage = "sat"
    } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: "Text to translate is required"
      });
    }

    const response = await axios.post(
      "http://localhost:8000/translate",
      {
        text: text.trim(),
        source_language: sourceLanguage,
        target_language: targetLanguage
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Translation gateway error:", error.message);
    res.status(500).json({
      success: false,
      error: "Translation service unavailable"
    });
  }
}