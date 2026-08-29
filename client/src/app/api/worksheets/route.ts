import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { lessonId, targetLanguage, difficulty, numQuestions } = await request.json();

    const lesson = await prisma.curriculumLesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 });
    }

    const curriculumData = {
      title: lesson.title,
      topic: lesson.topic,
      learningObjective: lesson.learningObjective,
      content: lesson.content,
      grade: lesson.grade,
      subject: lesson.subject,
    };

    const startTime = Date.now();
    
    const worksheet = await aiService.generateWorksheet(
      curriculumData, 
      targetLanguage,
      difficulty,
      numQuestions
    );
    
    const latencyMs = Date.now() - startTime;

    // Save generated worksheet to database
    await prisma.worksheet.create({
      data: {
        lessonId: lesson.id,
        language: targetLanguage,
        content: JSON.stringify(worksheet)
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: worksheet,
      metadata: { latencyMs }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
