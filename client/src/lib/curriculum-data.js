// Static in-memory stand-in for the Prisma-backed curriculum table.
// (The original Next.js API routes read this data from SQLite via Prisma.)
export const curriculumLessons = [
  {
    id: "lesson-1",
    grade: 1,
    subject: "Foundational Numeracy",
    topic: "Numbers 1–10",
    title: "Learning Numbers 1 to 10",
    learningObjective: "Students will identify and count numbers from 1 to 10.",
    content: JSON.stringify({
      teacherScript: "Today we will learn how to count from one to ten.",
      activity: "Ask students to count ten objects in the classroom.",
      assessment: "Show five objects and ask the child to count them.",
    }),
    language: "hi",
  },
  {
    id: "lesson-2",
    grade: 1,
    subject: "Foundational Numeracy",
    topic: "Counting Objects",
    title: "Counting Apples and Oranges",
    learningObjective: "Students will count physical objects accurately.",
    content: JSON.stringify({
      teacherScript: "Let us count these apples. One, two, three.",
      activity: "Give each student a handful of blocks to count.",
      assessment: "How many blocks do you have?",
    }),
    language: "hi",
  },
  {
    id: "lesson-3",
    grade: 1,
    subject: "Language",
    topic: "Basic Shapes",
    title: "Recognizing Shapes",
    learningObjective: "Students will identify circles, squares, and triangles.",
    content: JSON.stringify({
      teacherScript: "This is a circle. It is round like the sun.",
      activity: "Draw a circle in the air with your finger.",
      assessment: "Point to the shape that is a square.",
    }),
    language: "hi",
  },
  {
    id: "lesson-4",
    grade: 1,
    subject: "Language",
    topic: "Alphabet Recognition",
    title: "Letters A to E",
    learningObjective: "Students will recognize the first five letters of the alphabet.",
    content: JSON.stringify({
      teacherScript: "Let us say the letters: A, B, C, D, E.",
      activity: "Sing the alphabet song.",
      assessment: "Which letter comes after B?",
    }),
    language: "hi",
  },
  {
    id: "lesson-5",
    grade: 1,
    subject: "Language",
    topic: "Simple Words",
    title: "Reading 3-Letter Words",
    learningObjective: "Students will read simple CVC words.",
    content: JSON.stringify({
      teacherScript: "C-A-T makes Cat. D-O-G makes Dog.",
      activity: "Match the word to the picture.",
      assessment: "Read this word: B-A-T.",
    }),
    language: "hi",
  },
];
