// Client-side stub AI service.
//
// The original Next.js app called Google's Gemini API from a server route
// (app/api/*/route.ts -> lib/ai-service.ts). That call requires a secret
// API key, so it cannot run in a pure client-side React app — shipping the
// key to the browser would expose it publicly. This stub reproduces the
// same "demo mode" fallback the original service used when no
// GEMINI_API_KEY was configured, so the UI behaves identically.
//
// To wire this up to a real backend later, replace the bodies of these
// functions with `fetch("https://your-api.example.com/...")` calls.

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const aiService = {
  async translateLesson(_lessonContent, _sourceLang, targetLang) {
    await delay(1200);
    return {
      language: targetLang,
      lesson_title: "[Demo] 1 ᱠᱷᱚᱱ 10 ᱫᱷᱟᱹᱵᱤᱡ ᱮᱞᱠᱷᱟ ᱪᱮᱫᱚᱜ",
      learning_objective:
        "[Demo] ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ 1 ᱠᱷᱚᱱ 10 ᱫᱷᱟᱹᱵᱤᱡ ᱮᱞᱠᱷᱟ ᱠᱚ ᱩᱨᱩᱢ ᱟᱨ ᱠᱚ ᱞᱮᱠᱷᱟ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾",
      teacher_script: "[Demo] ᱛᱮᱦᱮᱧ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ ᱢᱤᱫ ᱠᱷᱚᱱ ᱜᱮᱞ ᱫᱷᱟᱹᱵᱤᱡ ᱪᱮᱠᱟ ᱠᱚ ᱞᱮᱠᱷᱟᱭᱟ᱾",
      activities: ["[Demo] ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱠᱞᱟᱥᱨᱩᱢ ᱨᱮᱱᱟᱜ ᱜᱮᱞ ᱜᱚᱴᱟᱝ ᱡᱤᱱᱤᱥ ᱞᱮᱠᱷᱟ ᱦᱚᱪᱚ ᱠᱚᱢ᱾"],
      assessment: ["[Demo] ᱢᱚᱬᱮ ᱜᱚᱴᱟᱝ ᱡᱤᱱᱤᱥ ᱩᱫᱩᱜ ᱠᱟᱛᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱞᱮᱠᱷᱟ ᱦᱚᱪᱚᱭᱮᱢ᱾"],
    };
  },

  async generateWorksheet(_curriculum, _language, _difficulty, numQuestions) {
    await delay(1500);
    return {
      title: "[Demo] Numbers 1-10",
      instructions: { hi: "वस्तुओं की गिनती करें।", target: "[Demo] ᱡᱤᱱᱤᱥ ᱠᱚ ᱞᱮᱠᱷᱟᱭ ᱢᱮ᱾" },
      questions: Array.from({ length: numQuestions }).map((_, i) => ({
        q_hi: `कितने सेब हैं? (${i + 1})`,
        q_target: `[Demo] ᱛᱤᱱᱟᱹᱜ ᱥᱮᱣ ᱢᱮᱱᱟᱜᱼᱟ? (${i + 1})`,
        type: "fill_in_the_blank",
      })),
    };
  },

  async generateFlashcards(_topic, _language, count) {
    await delay(1000);
    return Array.from({ length: count }).map((_, i) => ({
      concept: `Animal ${i + 1}`,
      hi: `हाथी ${i + 1}`,
      target: `[Demo] ᱦᱟᱹᱛᱤ ${i + 1}`,
      explanation: "A large animal.",
      emoji: "🐘",
    }));
  },

  async translateConversation(text, _source, target) {
    await delay(500);
    return `[Demo Translated to ${target}]: ${text}`;
  },
};
