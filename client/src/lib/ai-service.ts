import { GoogleGenAI } from '@google/genai';

export interface CurriculumData {
  title: string;
  topic: string;
  learningObjective: string;
  content: string; // JSON string
  grade: number;
  subject: string;
}

export interface TranslationResult {
  language: string;
  lesson_title: string;
  learning_objective: string;
  teacher_script: string;
  activities: string[];
  assessment: string[];
}

export interface Worksheet {
  title: string;
  instructions: { hi: string; target: string };
  questions: Array<{
    q_hi: string;
    q_target: string;
    type: string;
    options?: string[];
  }>;
}

export interface Flashcard {
  concept: string;
  hi: string;
  target: string;
  explanation: string;
  emoji: string;
}

export interface AIService {
  translateLesson(
    lessonContent: any,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<TranslationResult>;

  generateWorksheet(
    curriculum: CurriculumData,
    language: string,
    difficulty: string,
    numQuestions: number
  ): Promise<Worksheet>;

  generateFlashcards(
    topic: string,
    language: string,
    count: number
  ): Promise<Flashcard[]>;

  translateConversation(
    text: string,
    source: string,
    target: string
  ): Promise<string>;
}

export class CloudAIService implements AIService {
  private ai: GoogleGenAI | null = null;
  private isDemoMode = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("No GEMINI_API_KEY found, falling back to Demo Mode.");
      this.isDemoMode = true;
    } else {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  async translateLesson(lessonContent: any, sourceLang: string, targetLang: string): Promise<TranslationResult> {
    if (this.isDemoMode || !this.ai) {
      // Return predefined demo translation for Santhali
      await new Promise((r) => setTimeout(r, 1200)); // Simulate latency
      return {
        language: targetLang,
        lesson_title: "[Demo] 1 ᱠᱷᱚᱱ 10 ᱫᱷᱟᱹᱵᱤᱡ ᱮᱞᱠᱷᱟ ᱪᱮᱫᱚᱜ",
        learning_objective: "[Demo] ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ 1 ᱠᱷᱚᱱ 10 ᱫᱷᱟᱹᱵᱤᱡ ᱮᱞᱠᱷᱟ ᱠᱚ ᱩᱨᱩᱢ ᱟᱨ ᱠᱚ ᱞᱮᱠᱷᱟ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾",
        teacher_script: "[Demo] ᱛᱮᱦᱮᱧ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ ᱢᱤᱫ ᱠᱷᱚᱱ ᱜᱮᱞ ᱫᱷᱟᱹᱵᱤᱡ ᱪᱮᱠᱟ ᱠᱚ ᱞᱮᱠᱷᱟᱭᱟ᱾",
        activities: [
          "[Demo] ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱠᱞᱟᱥᱨᱩᱢ ᱨᱮᱱᱟᱜ ᱜᱮᱞ ᱜᱚᱴᱟᱝ ᱡᱤᱱᱤᱥ ᱞᱮᱠᱷᱟ ᱦᱚᱪᱚ ᱠᱚᱢ᱾"
        ],
        assessment: [
          "[Demo] ᱢᱚᱬᱮ ᱜᱚᱴᱟᱝ ᱡᱤᱱᱤᱥ ᱩᱫᱩᱜ ᱠᱟᱛᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱞᱮᱠᱷᱟ ᱦᱚᱪᱚᱭᱮᱢ᱾"
        ]
      };
    }

    try {
      const prompt = `
You are an educational translation engine specializing in Indian mother-tongue primary education.
Translate the supplied Hindi FLN content into the requested target language (${targetLang}).
Preserve educational meaning, instructions, questions, numbers, learning objectives and assessment intent.
Use natural, child-friendly language appropriate for primary-school students.
Do not invent information.

Return structured JSON exactly matching this schema:
{
  "language": "Target Language Name",
  "lesson_title": "...",
  "learning_objective": "...",
  "teacher_script": "...",
  "activities": ["..."],
  "assessment": ["..."]
}

Source Content (${sourceLang}):
${JSON.stringify(lessonContent, null, 2)}
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const text = response.text;
      return JSON.parse(text || "{}");
    } catch (e) {
      console.error("AI Translation Error:", e);
      throw new Error("Translation failed.");
    }
  }

  async generateWorksheet(curriculum: CurriculumData, language: string, difficulty: string, numQuestions: number): Promise<Worksheet> {
    if (this.isDemoMode || !this.ai) {
      await new Promise((r) => setTimeout(r, 1500));
      return {
        title: "[Demo] Numbers 1-10",
        instructions: { hi: "वस्तुओं की गिनती करें।", target: "[Demo] ᱡᱤᱱᱤᱥ ᱠᱚ ᱞᱮᱠᱷᱟᱭ ᱢᱮ᱾" },
        questions: Array.from({ length: numQuestions }).map((_, i) => ({
          q_hi: `कितने सेब हैं? (${i+1})`,
          q_target: `[Demo] ᱛᱤᱱᱟᱹᱜ ᱥᱮᱣ ᱢᱮᱱᱟᱜᱼᱟ? (${i+1})`,
          type: "fill_in_the_blank"
        }))
      };
    }

    const prompt = `
You are an AI primary-school worksheet designer.
Create a bilingual worksheet (Hindi and ${language}) based strictly on the supplied grade, subject, topic and learning outcome.
Difficulty: ${difficulty}. Number of questions: ${numQuestions}.
Questions must be age appropriate. Use simple language.

Return structured JSON exactly matching this schema:
{
  "title": "Worksheet Title",
  "instructions": { "hi": "...", "target": "..." },
  "questions": [
    {
      "q_hi": "...",
      "q_target": "...",
      "type": "fill_in_the_blank | multiple_choice",
      "options": ["optional options"]
    }
  ]
}

Curriculum Context:
Grade: ${curriculum.grade}
Subject: ${curriculum.subject}
Topic: ${curriculum.topic}
Learning Objective: ${curriculum.learningObjective}
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    return JSON.parse(response.text || "{}");
  }

  async generateFlashcards(topic: string, language: string, count: number): Promise<Flashcard[]> {
    if (this.isDemoMode || !this.ai) {
      await new Promise((r) => setTimeout(r, 1000));
      return Array.from({ length: count }).map((_, i) => ({
        concept: `Animal ${i+1}`,
        hi: `हाथी ${i+1}`,
        target: `[Demo] ᱦᱟᱹᱛᱤ ${i+1}`,
        explanation: "A large animal.",
        emoji: "🐘"
      }));
    }

    const prompt = `
Create ${count} simple educational flashcards for primary-school children about the topic: "${topic}".
Language target: ${language}.
Each card must contain: concept, Hindi term, target-language term, short child-friendly explanation in Hindi, and a relevant emoji.

Return structured JSON exactly matching this schema:
[
  {
    "concept": "...",
    "hi": "...",
    "target": "...",
    "explanation": "...",
    "emoji": "..."
  }
]
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    return JSON.parse(response.text || "[]");
  }

  async translateConversation(text: string, source: string, target: string): Promise<string> {
    if (this.isDemoMode || !this.ai) {
      await new Promise((r) => setTimeout(r, 500));
      return `[Demo Translated to ${target}]: ${text}`;
    }

    const prompt = `Translate the following ${source} text to ${target}. Return ONLY the translated text, nothing else.\n\nText: ${text}`;
    
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text?.trim() || "";
  }
}

// Singleton export
export const aiService = new CloudAIService();
