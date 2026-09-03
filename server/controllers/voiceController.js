import axios from "axios";
import FormData from "form-data";

export async function voiceTranslate(req, res) {

  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Audio file is required"
      });
    }

    const formData = new FormData();

    formData.append(
      "file",
      req.file.buffer,
      {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      }
    );

    const response = await axios.post(
      "http://localhost:8000/voice-to-voice",
      formData,
      {
        headers: {
          ...formData.getHeaders()
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    console.error(
      "Voice translation error:",
      error.message
    );

    res.status(500).json({
      success: false,
      error: "Voice translation service unavailable"
    });
  }
}