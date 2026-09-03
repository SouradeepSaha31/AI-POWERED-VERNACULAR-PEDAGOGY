import axios from "axios";

export async function translateText(req, res) {

    try {

        const {
            text,
            sourceLanguage = "hi",
            targetLanguage = "sat"
        } = req.body;

        const response = await axios.post(
            "http://localhost:8000/translate",
            {
                text,
                source_language: sourceLanguage,
                target_language: targetLanguage
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            success: false,
            error: "Translation service unavailable"
        });
    }
}