import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json();

    const startTime = Date.now();
    
    const result = await aiService.translateConversation(
      text, 
      sourceLanguage,
      targetLanguage
    );
    
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({ 
      success: true, 
      data: {
        sourceLanguage,
        targetLanguage,
        sourceText: text,
        translatedText: result.text,
        confidence_score: result.confidence
      },
      metadata: { latencyMs, mode: process.env.GEMINI_API_KEY ? "live" : "demo" }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
