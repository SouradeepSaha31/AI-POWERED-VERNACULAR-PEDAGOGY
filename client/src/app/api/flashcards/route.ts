import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const { topic, targetLanguage, count } = await request.json();

    const startTime = Date.now();
    
    const flashcards = await aiService.generateFlashcards(
      topic, 
      targetLanguage,
      count
    );
    
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({ 
      success: true, 
      data: flashcards,
      metadata: { latencyMs }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
