import axios from "axios";
import { curriculumLessons } from "../data/curriculum.js";

export async function getCurriculum(req, res) {
  res.json({
    success: true,
    data: curriculumLessons,
  });
}

export async function getCurriculumLesson(req, res) {
  const lesson = curriculumLessons.find(
    (item) => item.id === req.params.id
  );

  if (!lesson) {
    return res.status(404).json({
      success: false,
      error: "Lesson not found",
    });
  }

  res.json({
    success: true,
    data: lesson,
  });
}

export async function translateCurriculum(req, res) {
  try {
    const lesson = curriculumLessons.find(
      (item) => item.id === req.params.id
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: "Lesson not found",
      });
    }

    const response = await axios.post(
      "http://localhost:8000/translate-curriculum",
      {
        lesson,
        source_language: "hi",
        target_language: "sat",
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(
      "Curriculum translation error:",
      error.message
    );

    res.status(500).json({
      success: false,
      error: "Curriculum translation service unavailable",
    });
  }
}