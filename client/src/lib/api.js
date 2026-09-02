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

export async function postTranslate({
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

export async function postVoiceTranslate({
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


export async function testBackend() {
  const response = await API.get("/ai/health");
  return response.data;
}