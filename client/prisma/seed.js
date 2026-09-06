const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Languages
  await prisma.language.upsert({
    where: { code: 'hi' },
    update: {},
    create: { code: 'hi', name: 'Hindi', status: 'active' },
  })
  
  await prisma.language.upsert({
    where: { code: 'sat' },
    update: {},
    create: { code: 'sat', name: 'Santhali', status: 'prototype' },
  })
  
  await prisma.language.upsert({
    where: { code: 'un' },
    update: {},
    create: { code: 'un', name: 'Mundari', status: 'coming_soon' },
  })
  
  await prisma.language.upsert({
    where: { code: 'ho' },
    update: {},
    create: { code: 'ho', name: 'Ho', status: 'coming_soon' },
  })

  await prisma.worksheet.deleteMany({})
  await prisma.curriculumLesson.deleteMany({})

  // Seed Lessons
  const lessons = [
    {
      grade: 1,
      subject: 'Foundational Numeracy',
      topic: 'Numbers 1–10',
      title: 'Learning Numbers 1 to 10',
      learningObjective: 'Students will identify and count numbers from 1 to 10.',
      nipunCode: 'M-101',
      content: JSON.stringify({
        teacherScript: 'Today we will learn how to count from one to ten.',
        activity: 'Ask students to count ten objects in the classroom.',
        assessment: 'Show five objects and ask the child to count them.'
      }),
      language: 'hi'
    },
    {
      grade: 1,
      subject: 'Foundational Numeracy',
      topic: 'Counting Objects',
      title: 'Counting Apples and Oranges',
      learningObjective: 'Students will count physical objects accurately.',
      nipunCode: 'M-102',
      content: JSON.stringify({
        teacherScript: 'Let us count these apples. One, two, three.',
        activity: 'Give each student a handful of blocks to count.',
        assessment: 'How many blocks do you have?'
      }),
      language: 'hi'
    },
    {
      grade: 1,
      subject: 'Language',
      topic: 'Basic Shapes',
      title: 'Recognizing Shapes',
      learningObjective: 'Students will identify circles, squares, and triangles.',
      nipunCode: 'L-101',
      content: JSON.stringify({
        teacherScript: 'This is a circle. It is round like the sun.',
        activity: 'Draw a circle in the air with your finger.',
        assessment: 'Point to the shape that is a square.'
      }),
      language: 'hi'
    },
    {
      grade: 1,
      subject: 'Language',
      topic: 'Alphabet Recognition',
      title: 'Letters A to E',
      learningObjective: 'Students will recognize the first five letters of the alphabet.',
      nipunCode: 'L-102',
      content: JSON.stringify({
        teacherScript: 'Let us say the letters: A, B, C, D, E.',
        activity: 'Sing the alphabet song.',
        assessment: 'Which letter comes after B?'
      }),
      language: 'hi'
    },
    {
      grade: 1,
      subject: 'Language',
      topic: 'Simple Words',
      title: 'Reading 3-Letter Words',
      learningObjective: 'Students will read simple CVC words.',
      nipunCode: 'L-103',
      content: JSON.stringify({
        teacherScript: 'C-A-T makes Cat. D-O-G makes Dog.',
        activity: 'Match the word to the picture.',
        assessment: 'Read this word: B-A-T.'
      }),
      language: 'hi'
    }
  ]

  for (const lesson of lessons) {
    const created = await prisma.curriculumLesson.create({
      data: lesson
    })
    console.log(`Created lesson: ${created.title}`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
