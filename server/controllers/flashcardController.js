import axios from "axios";

import {
  getFlashcardData,
  getAvailableTopics,
} from "../data/flashcardData.js";


export async function getFlashcardTopics(req, res) {
  try {
    const topics = getAvailableTopics();

    res.json({
      success: true,
      data: topics,
    });

  } catch (error) {
    console.error(
      "Flashcard topics error:",
      error.message
    );

    res.status(500).json({
      success: false,
      error: "Unable to load flashcard topics.",
    });
  }
}


export async function generateFlashcards(req, res) {
  try {

    const {
      topic,
      targetLanguage = "sat",
      count = 6,
    } = req.body;


    if (!topic) {
      return res.status(400).json({
        success: false,
        error: "Topic is required.",
      });
    }


    const items = getFlashcardData(topic, count);
    // console.log(items)


    if (!items.length) {
      return res.status(404).json({
        success: false,
        error: "Selected topic not found.",
      });
    }


    const safeCount = Math.min(
      Math.max(Number(count) || 6, 1),
      items.length
    );

    console.log(items, topic, targetLanguage, count)
    const response = await axios.post(
      "http://localhost:8000/generate-flashcards",
      {
        items,
        topic,
        target_language: targetLanguage,
        count: safeCount,
      }
    );
    console.log(response.data)


    res.json(response.data);

  } catch (error) {

    console.error(
      "Flashcard gateway error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      error:
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Flashcard generation service unavailable.",
    });
  }
}