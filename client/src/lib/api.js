import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

async function getCurriculum(id) {
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

async function postTranslate({
  lessonId,
  sourceLanguage,
  targetLanguage,
}) {
  try {
    const response = await API.post("/translate", {
      lessonId,
      sourceLanguage,
      targetLanguage,
    });

    return response.data;
  } catch (error) {
    console.error("Translation API Error:", error);

    return {
      success: false,
      error: "Translation server unavailable",
    };
  }
}

async function postWorksheet({
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

async function postFlashcards({
  topic,
  targetLanguage,
  count,
}) {
  try {
    const response = await API.post("/flashcards", {
      topic,
      targetLanguage,
      count,
    });

    return response.data;
  } catch (error) {
    console.error("Flashcard API Error:", error);

    return {
      success: false,
      error: "Flashcard server unavailable",
    };
  }
}

async function postVoiceTranslate({
  text,
  sourceLanguage,
  targetLanguage,
}) {
  try {
    const response = await API.post("/voice/translate", {
      text,
      sourceLanguage,
      targetLanguage,
    });

    return response.data;
  } catch (error) {
    console.error("Voice Translation API Error:", error);

    return {
      success: false,
      error: "Voice translation server unavailable",
    };
  }
}


async function translateText({
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
            error: "Translation server unavailable"
        };
    }
}

async function testBackend() {
  const response = await API.get("/ai/health");
  return response.data;
}

export {
  getCurriculum,
  postTranslate,
  postWorksheet,
  postFlashcards,
  postVoiceTranslate,
  translateText,
  testBackend,
}