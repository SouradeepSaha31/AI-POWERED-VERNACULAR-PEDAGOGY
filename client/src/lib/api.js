import axios from "axios";
import { saveCache, getCache } from "./offline";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getCurriculumOptions() {
  try {
    const response = await API.get("/curriculum/options");

    return response.data;
  } catch (error) {
    console.error("Curriculum Options Error:", error);

    return {
      success: false,
      error: "Unable to load curriculum options",
    };
  }
}

export async function getCurriculumBooks({ grade, subject }) {
  const cacheKey = `curriculum-books-${grade}-${subject}`;

  try {
    const response = await API.get("/curriculum/books", {
      params: {
        grade,
        subject,
      },
    });

    saveCache(cacheKey, response.data);

    return response.data;
  } catch (error) {
    console.error("Curriculum Books Error:", error);

    const cached = getCache(cacheKey);

    if (cached) {
      return cached;
    }

    return {
      success: false,
      error: "Unable to load books. No offline copy is available.",
    };
  }
}

export async function getBook(bookId) {
  const cacheKey = `book-${bookId}`;

  try {
    const response = await API.get(`/curriculum/books/${bookId}`);

    saveCache(cacheKey, response.data);

    return response.data;
  } catch (error) {
    console.error("Book Details Error:", error);

    const cached = getCache(cacheKey);

    if (cached) {
      return cached;
    }

    return {
      success: false,
      error: "Unable to load book. No offline copy is available.",
    };
  }
}

export async function postWorksheet({
  bookId,
  chapterId,
  targetLanguage = "sat",
  difficulty = "Easy",
  numQuestions = 5,
}) {
  try {
    const response = await API.post("/worksheet", {
      bookId,
      chapterId,
      targetLanguage,
      difficulty,
      numQuestions,
    });

    return response.data;
  } catch (error) {
    console.error("Worksheet API Error:", error);

    return {
      success: false,
      error: error.response?.data?.error || "Worksheet server unavailable",
    };
  }
}

export async function getFlashcardTopics() {
  try {
    const response = await API.get("/flashcards/topics");
    // console.log(response.data)

    return response.data;
  } catch (error) {
    console.error("Flashcard Topics Error:", error);

    return {
      success: false,
      error: error.response?.data?.error || "Unable to load flashcard topics.",
    };
  }
}

export async function postFlashcards({
  topic,
  targetLanguage = "sat",
  count = 6,
}) {
  try {
    console.log(topic, targetLanguage, count);

    const response = await API.post("/flashcards", {
      topic,
      targetLanguage,
      count,
    });
    // console.log(response.data)

    return response.data;
  } catch (error) {
    console.error("Flashcard API Error:", error.response?.data || error);

    return {
      success: false,
      error: error.response?.data?.error || "Flashcard generation failed.",
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
  targetLanguage = "sat",
}) {
  try {
    const response = await API.post("/translate", {
      text,
      sourceLanguage,
      targetLanguage,
    });

    return response.data;
  } catch (error) {
    console.error("Translation Error:", error);

    return {
      success: false,
      error: error.response?.data?.error || "Translation server unavailable",
    };
  }
}

export async function voiceTranslate(
  audioFile,
  sourceLanguage = "hi",
  targetLanguage = "sat",
) {
  try {
    const formData = new FormData();

    formData.append("file", audioFile, "recording.webm");
    formData.append("sourceLanguage", sourceLanguage);
    formData.append("targetLanguage", targetLanguage);

    const response = await API.post("/voice", formData);

    return response.data;
  } catch (error) {
    console.error("Voice Translation Error:", error);

    return {
      success: false,
      error:
        error.response?.data?.error || "Voice translation server unavailable",
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
      { responseType: "blob" },
    );

    const audioUrl = URL.createObjectURL(response.data);
    return {
      success: true,
      audioUrl,
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
