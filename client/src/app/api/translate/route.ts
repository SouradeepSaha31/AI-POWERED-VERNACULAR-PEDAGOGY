import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { lessonId, sourceLanguage, targetLanguage } = await request.json();

    const lesson = await prisma.curriculumLesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 });
    }

    const startTime = Date.now();
    
    // Check cache first in translations table
    // For prototype, we'll just parse the lesson content
    let parsedContent = {};
    try {
      parsedContent = JSON.parse(lesson.content);
    } catch(e) {}
    
    const contentToTranslate = {
      title: lesson.title,
      learningObjective: lesson.learningObjective,
      ...parsedContent
    };

    const translation = await aiService.translateLesson(contentToTranslate, sourceLanguage, targetLanguage);
    
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({ 
      success: true, 
      data: translation,
      metadata: { latencyMs }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
