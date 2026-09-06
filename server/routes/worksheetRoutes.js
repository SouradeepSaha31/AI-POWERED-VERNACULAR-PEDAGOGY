import express from "express";
import {
  generateWorksheet,
} from "../controllers/worksheetController.js";

const router = express.Router();

router.post("/", generateWorksheet);

export default router;