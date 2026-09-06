import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getCurriculum(id) {
  try {
    const response = await API.get(
      id ? `/curriculum/${id}` : "/curriculum"
    );

    return response.data;
  } catch (error) {
    console.error("Curriculum API Error:", error);

    return {
      success: false,
      error: "Unable to connect to server",
    };
  }
}

export async function postWorksheet({
  lessonId,
  targetLanguage,
  difficulty,
  numQuestions,
}) {
  try {
    const response = await API.post("/worksheet", {
      lessonId,
      targetLanguage,
      difficulty,
      numQuestions,
    });

    return response.data;
  } catch (error) {
    console.error("Worksheet API Error:", error);

    return {
      success: false,
      error: "Worksheet server unavailable",
    };
  }
}

export async function postFlashcards({
  topic,
  targetLanguage,
  count,
}) {
  try {
    const response = await API.post(
      "/flashcards",
      {
        topic,
        targetLanguage,
        count,
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "Flashcard API Error:",
      error
    );

    return {
      success: false,
      error:
        error.response?.data?.error ||
        "Flashcard server unavailable",
    };
  }
}

// export async function postVoiceTranslate({
//   text,
//   sourceLanguage,
//   targetLanguage,
// }) {
//   try {
//     const response = await API.post("/voice/translate", {
//       text,
//       sourceLanguage,
//       targetLanguage,
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Voice Translation API Error:", error);

//     return {
//       success: false,
//       error: "Voice translation server unavailable",
//     };
//   }
// }

export async function translateText({
  text,
  sourceLanguage = "hi",
  targetLanguage = "sat"
}) {
  try {
    const response = await API.post("/translate", {
      text,
      sourceLanguage,
      targetLanguage
    });

    return response.data;
  } catch (error) {
    console.error("Translation Error:", error);

    return {
      success: false,
      error: error.response?.data?.error || "Translation server unavailable"
    };
  }
}

export async function voiceTranslate(
  audioFile,
  sourceLanguage = "hi",
  targetLanguage = "sat"
) {
  try {
    const formData = new FormData();

    formData.append("file", audioFile, "recording.webm");
    formData.append("sourceLanguage", sourceLanguage);
    formData.append("targetLanguage", targetLanguage);

    const response = await API.post(
      "/voice",
      formData
    );

    return response.data;

  } catch (error) {
    console.error("Voice Translation Error:", error);

    return {
      success: false,
      error:
        error.response?.data?.error ||
        "Voice translation server unavailable",
    };
  }
}

/**
 * Converts speech audio recording to text via /api/voice/stt
 */
export async function postSpeechToText(audioBlob) {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "speech.webm");

    const response = await API.post("/voice/stt", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Speech-to-Text Error:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Speech-to-Text server unavailable",
    };
  }
}

/**
 * Converts text into audio speech via /api/voice/tts
 * Returns a playable object URL for HTML5 Audio
 */
export async function postTextToSpeech({ text, language = "hi" }) {
  try {
    const response = await API.post(
      "/voice/tts",
      { text, language },
      { responseType: "blob" }
    );

    const audioUrl = URL.createObjectURL(response.data);
    return {
      success: true,
      audioUrl
    };
  } catch (error) {
    console.error("Text-to-Speech Error:", error);
    return {
      success: false,
      error: "Text-to-Speech synthesis unavailable",
    };
  }
}

export async function testBackend() {
  const response = await API.get("/ai/health");
  return response.data;
}
