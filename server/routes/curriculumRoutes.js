import express from "express";

import {
  getCurriculum,
  getCurriculumLesson,
  translateCurriculum,
} from "../controllers/curriculumController.js";

const router = express.Router();

router.get("/", getCurriculum);

router.get("/:id", getCurriculumLesson);

router.post("/:id/translate", translateCurriculum);

export default router;