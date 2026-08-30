// Drop-in replacements for the Next.js `/api/*` route handlers.
// Each function returns the same `{ success, data, metadata }` shape the
// original fetch() calls received, so page components didn't need to change
// their response-handling logic.
import { curriculumLessons } from "./curriculum-data";
import { aiService } from "./ai-service";

export async function getCurriculum(id) {
  if (id) {
    const lesson = curriculumLessons.find((l) => l.id === id);
    if (!lesson) return { success: false, error: "Not found" };
    return { success: true, data: lesson };
  }
  const sorted = [...curriculumLessons].sort((a, b) => a.grade - b.grade);
  return { success: true, data: sorted };
}

export async function postTranslate({ lessonId, sourceLanguage, targetLanguage }) {
  const lesson = curriculumLessons.find((l) => l.id === lessonId);
  if (!lesson) return { success: false, error: "Lesson not found" };

  const startTime = Date.now();

  let parsedContent = {};
  try {
    parsedContent = JSON.parse(lesson.content);
  } catch (e) {
    // ignore malformed content, same as original route
  }

  const contentToTranslate = {
    title: lesson.title,
    learningObjective: lesson.learningObjective,
    ...parsedContent,
  };

  const translation = await aiService.translateLesson(contentToTranslate, sourceLanguage, targetLanguage);
  const latencyMs = Date.now() - startTime;

  return { success: true, data: translation, metadata: { latencyMs } };
}

export async function postWorksheet({ lessonId, targetLanguage, difficulty, numQuestions }) {
  const lesson = curriculumLessons.find((l) => l.id === lessonId);
  if (!lesson) return { success: false, error: "Lesson not found" };

  const curriculumContext = {
    title: lesson.title,
    topic: lesson.topic,
    learningObjective: lesson.learningObjective,
    content: lesson.content,
    grade: lesson.grade,
    subject: lesson.subject,
  };

  const startTime = Date.now();
  const worksheet = await aiService.generateWorksheet(curriculumContext, targetLanguage, difficulty, numQuestions);
  const latencyMs = Date.now() - startTime;

  return { success: true, data: worksheet, metadata: { latencyMs } };
}

export async function postFlashcards({ topic, targetLanguage, count }) {
  const startTime = Date.now();
  const flashcards = await aiService.generateFlashcards(topic, targetLanguage, count);
  const latencyMs = Date.now() - startTime;

  return { success: true, data: flashcards, metadata: { latencyMs } };
}

export async function postVoiceTranslate({ text, sourceLanguage, targetLanguage }) {
  const startTime = Date.now();
  const translatedText = await aiService.translateConversation(text, sourceLanguage, targetLanguage);
  const latencyMs = Date.now() - startTime;

  return {
    success: true,
    data: { sourceLanguage, targetLanguage, sourceText: text, translatedText },
    metadata: { latencyMs, mode: "demo" },
  };
}
