import axios from "axios";
import FormData from "form-data";

export async function voiceTranslate(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Audio file is required",
      });
    }

    const sourceLanguage = req.body.sourceLanguage || "hi";
    const targetLanguage = req.body.targetLanguage || "sat";

    const formData = new FormData();

    formData.append("file", req.file.buffer, {
      filename: req.file.originalname || "recording.webm",
      contentType: req.file.mimetype || "audio/webm",
    });

    formData.append("source_language", sourceLanguage);
    formData.append("target_language", targetLanguage);

    const response = await axios.post(
      "http://localhost:8000/voice-to-voice",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error("Voice translation error:", error.message);

    res.status(500).json({
      success: false,
      error: "Voice translation service unavailable",
    });
  }
}

export async function speechToText(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Audio file is required"
      });
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname || "recording.webm",
      contentType: req.file.mimetype || "audio/webm"
    });

    const response = await axios.post(
      "http://localhost:8000/speech-to-text",
      formData,
      {
        headers: {
          ...formData.getHeaders()
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Speech-to-Text error:", error.message);
    res.status(500).json({
      success: false,
      error: "Speech-to-Text service unavailable"
    });
  }
}

export async function textToSpeech(req, res) {
  try {
    const { text, language = "hi" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: "Text is required for TTS"
      });
    }

    const response = await axios.post(
      "http://localhost:8000/text-to-speech",
      { text, language },
      {
        responseType: "arraybuffer",
        validateStatus: () => true
      }
    );

    if (response.status !== 200) {
      let errorMsg = "TTS synthesis failed";
      try {
        const errorJson = JSON.parse(Buffer.from(response.data).toString("utf-8"));
        errorMsg = errorJson.error || errorMsg;
      } catch (_) { }

      return res.status(response.status).json({
        success: false,
        error: errorMsg
      });
    }

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": response.data.length
    });

    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error("Text-to-Speech error:", error.message);
    res.status(500).json({
      success: false,
      error: "Text-to-Speech service unavailable"
    });
  }
}