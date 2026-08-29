import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const lesson = await prisma.curriculumLesson.findUnique({
        where: { id }
      });
      if (!lesson) {
        return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: lesson });
    }

    const lessons = await prisma.curriculumLesson.findMany({
      orderBy: { grade: 'asc' }
    });
    
    return NextResponse.json({ success: true, data: lessons });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
