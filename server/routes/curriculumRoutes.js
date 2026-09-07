import express from "express";

import {
  getCurriculumOptions,
  getCurriculumBooks,
  getBookDetails,
} from "../controllers/curriculumController.js";

const router = express.Router();

router.get("/options", getCurriculumOptions);

router.get("/books", getCurriculumBooks);

router.get("/books/:id", getBookDetails);

export default router;