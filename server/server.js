import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import aiRoutes from "./routes/aiRoutes.js";
import translationRoutes from "./routes/translationRoutes.js";
import voiceRoutes from "./routes/voiceRoutes.js";
import curriculumRoutes from "./routes/curriculumRoutes.js";
import worksheetRoutes from "./routes/worksheetRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoutes);
app.use("/api/translate", translationRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/curriculum", curriculumRoutes);
app.use("/api/worksheet", worksheetRoutes);
app.use("/api/flashcards", flashcardRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "Vernacular Classroom Backend is running"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});