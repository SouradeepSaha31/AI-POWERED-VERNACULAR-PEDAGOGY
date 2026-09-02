import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/health", async (req, res) => {
    try {
        const response = await axios.get(
            "http://localhost:8000/health"
        );

        res.json(response.data);

    } catch (error) {
        res.status(500).json({
            error: "Python model is not running"
        });
    }
});

export default router;  