import axios from "axios";
import {
  SUBJECTS,
  getBooksByGradeAndSubject,
  getBookById,
} from "../data/curriculum.js";

export function getCurriculumOptions(req, res) {
  res.json({
    success: true,
    data: {
      grades: [1, 2, 3, 4, 5],
      subjects: SUBJECTS,
    },
  });
}

export function getCurriculumBooks(req, res) {
  const { grade, subject } = req.query;

  if (!grade || !subject) {
    return res.status(400).json({
      success: false,
      error: "Grade and subject are required.",
    });
  }

  const books = getBooksByGradeAndSubject(
    grade,
    subject
  );

  res.json({
    success: true,
    data: books.map((book) => ({
      id: book.id,
      grade: book.grade,
      subject: book.subject,
      title: book.title,
      type: book.type,
      source: book.source,
      description: book.description,
      sourceUrl: book.sourceUrl,
      chapterCount: book.chapters.length,
    })),
  });
}

export function getBookDetails(req, res) {
  const book = getBookById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      error: "Book not found.",
    });
  }

  res.json({
    success: true,
    data: book,
  });
}