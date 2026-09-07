const SUBJECTS = [
  "Hindi",
  "Mathematics",
  "English",
  "Environmental Studies",
  "General Awareness",
];

const SOURCE_BOOKS = [
  {
    suffix: "textbook",
    label: "NCERT Textbook",
    type: "Textbook",
    description: "Primary curriculum reference material.",
    source: "NCERT",
    sourceUrl: "https://ncert.nic.in/textbook.php",
  },
  {
    suffix: "fln",
    label: "FLN Activity Book",
    type: "Activity Book",
    description: "Foundational Literacy and Numeracy focused activities.",
    source: "NIPUN Bharat / FLN",
    sourceUrl: "https://nipunbharat.education.gov.in/",
  },
  {
    suffix: "teacher",
    label: "Teacher Handbook",
    type: "Teacher Resource",
    description: "Teaching and classroom activity reference.",
    source: "NCERT / FLN",
    sourceUrl: "https://www.ncert.nic.in/",
  },
];

const CHAPTERS = {
  1: {
    Hindi: [
      "अक्षर पहचान",
      "स्वर और व्यंजन",
      "सरल शब्द",
      "सरल वाक्य",
      "चित्र देखकर बोलना",
    ],
    Mathematics: [
      "संख्या 1 से 10",
      "संख्या 11 से 20",
      "वस्तुओं की गिनती",
      "आकार और आकृतियाँ",
      "तुलना और माप",
    ],
    English: [
      "Alphabet Recognition",
      "Capital and Small Letters",
      "Simple Words",
      "Three-Letter Words",
      "Simple Sentences",
    ],
    "Environmental Studies": [
      "मेरा परिवार",
      "मेरा विद्यालय",
      "पौधे",
      "पशु",
      "स्वच्छता",
    ],
    "General Awareness": [
      "मेरा शरीर",
      "रंग और आकार",
      "फल और सब्जियाँ",
      "यातायात के साधन",
      "सुरक्षा के नियम",
    ],
  },

  2: {
    Hindi: [
      "मात्राओं की पहचान",
      "शब्द निर्माण",
      "वाक्य पढ़ना",
      "कहानी समझना",
      "चित्र वर्णन",
    ],
    Mathematics: [
      "दो अंकों की संख्याएँ",
      "स्थान-मूल्य",
      "जोड़",
      "घटाव",
      "समय और पैसा",
    ],
    English: [
      "Common Words",
      "Nouns",
      "Simple Sentences",
      "Reading Practice",
      "Question Words",
    ],
    "Environmental Studies": [
      "मेरा घर",
      "हमारे भोजन",
      "पौधों की देखभाल",
      "जानवर और उनके घर",
      "जल",
    ],
    "General Awareness": [
      "स्वास्थ्य और स्वच्छता",
      "त्योहार",
      "परिवार और समुदाय",
      "यातायात नियम",
      "मौसम",
    ],
  },

  3: {
    Hindi: [
      "संज्ञा की पहचान",
      "वचन",
      "वाक्य निर्माण",
      "कहानी लेखन",
      "अनुच्छेद",
    ],
    Mathematics: [
      "तीन अंकों की संख्याएँ",
      "जोड़ और घटाव",
      "गुणा",
      "भाग",
      "भिन्न और माप",
    ],
    English: [
      "Parts of Speech",
      "Simple Grammar",
      "Paragraph Reading",
      "Question and Answer",
      "Creative Writing",
    ],
    "Environmental Studies": [
      "पौधों का जीवन",
      "जानवरों की विविधता",
      "जल के स्रोत",
      "मेरा समुदाय",
      "पर्यावरण संरक्षण",
    ],
    "General Awareness": [
      "भारत के राज्य",
      "राष्ट्रीय प्रतीक",
      "स्वतंत्रता दिवस",
      "महत्वपूर्ण स्थान",
      "स्वास्थ्य आदतें",
    ],
  },

  4: {
    Hindi: [
      "सर्वनाम",
      "विशेषण",
      "काल",
      "कहानी का सार",
      "पत्र लेखन",
    ],
    Mathematics: [
      "बड़ी संख्याएँ",
      "गुणा और भाग",
      "भिन्न",
      "दशमलव की शुरुआत",
      "परिमाप और क्षेत्रफल",
    ],
    English: [
      "Tenses",
      "Pronouns",
      "Adjectives",
      "Reading Comprehension",
      "Paragraph Writing",
    ],
    "Environmental Studies": [
      "हमारा पर्यावरण",
      "जल संरक्षण",
      "वन और वन्यजीव",
      "परिवहन",
      "कार्य और जीवन",
    ],
    "General Awareness": [
      "भारत का परिचय",
      "महान व्यक्तित्व",
      "विज्ञान के दैनिक उपयोग",
      "सार्वजनिक सेवाएँ",
      "आपदा सुरक्षा",
    ],
  },

  5: {
    Hindi: [
      "क्रिया",
      "काल और वाक्य",
      "पाठ समझ",
      "निबंध लेखन",
      "रचनात्मक लेखन",
    ],
    Mathematics: [
      "संख्याएँ और स्थान-मूल्य",
      "चार संक्रियाएँ",
      "भिन्न और दशमलव",
      "ज्यामिति",
      "डेटा और ग्राफ",
    ],
    English: [
      "Advanced Grammar",
      "Tenses",
      "Comprehension",
      "Letter Writing",
      "Creative Writing",
    ],
    "Environmental Studies": [
      "प्राकृतिक संसाधन",
      "जल और उसका संरक्षण",
      "पौधे और कृषि",
      "मानव शरीर",
      "प्रदूषण और संरक्षण",
    ],
    "General Awareness": [
      "भारत का संविधान",
      "भारतीय संस्कृति",
      "विज्ञान और तकनीक",
      "पर्यावरण जागरूकता",
      "स्वास्थ्य और सुरक्षा",
    ],
  },
};

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getChapterType(subject) {
  if (subject === "Mathematics") return "math";
  if (subject === "Hindi") return "hindi";
  if (subject === "English") return "english";
  if (subject === "Environmental Studies") return "evs";
  return "awareness";
}

function getLearningOutcomes(
  grade,
  subject,
  chapterTitle,
  chapterType
) {
  const outcomes = {
    math: [
      `विद्यार्थी कक्षा ${grade} स्तर पर ${chapterTitle} की मूल अवधारणाओं को समझ सकेंगे।`,
      `${chapterTitle} से संबंधित सरल समस्याओं को हल कर सकेंगे।`,
      `दैनिक जीवन में ${chapterTitle} का उपयोग पहचान सकेंगे।`,
    ],

    hindi: [
      `विद्यार्थी ${chapterTitle} से संबंधित शब्दों और वाक्यों को पहचान सकेंगे।`,
      `${chapterTitle} का सही प्रयोग बोलने और लिखने में कर सकेंगे।`,
      `${chapterTitle} से संबंधित सरल पाठ को समझ सकेंगे।`,
    ],

    english: [
      `Students will identify the basic concepts of ${chapterTitle}.`,
      `Students will use ${chapterTitle} in simple communication.`,
      `Students will understand and respond to simple examples related to ${chapterTitle}.`,
    ],

    evs: [
      `विद्यार्थी ${chapterTitle} से संबंधित मुख्य अवधारणाओं को पहचान सकेंगे।`,
      `${chapterTitle} को अपने दैनिक जीवन से जोड़ सकेंगे।`,
      `${chapterTitle} से संबंधित सरल प्रश्नों का उत्तर दे सकेंगे।`,
    ],

    awareness: [
      `विद्यार्थी ${chapterTitle} के बारे में बुनियादी जानकारी प्राप्त कर सकेंगे।`,
      `${chapterTitle} से संबंधित महत्वपूर्ण तथ्यों को पहचान सकेंगे।`,
      `${chapterTitle} का दैनिक जीवन में महत्व समझ सकेंगे।`,
    ],
  };

  return outcomes[chapterType] || outcomes.awareness;
}

export const curriculumBooks = [];

for (let grade = 1; grade <= 5; grade++) {
  for (const subject of SUBJECTS) {
    const chapterNames = CHAPTERS[grade][subject];

    SOURCE_BOOKS.forEach((bookSource) => {
      const bookId = `class-${grade}-${slug(subject)}-${bookSource.suffix}`;

      curriculumBooks.push({
        id: bookId,
        grade,
        subject,
        title: `${bookSource.label} - ${subject} - Class ${grade}`,
        type: bookSource.type,
        source: bookSource.source,
        description: bookSource.description,
        sourceUrl: bookSource.sourceUrl,

        chapters: chapterNames.map((title, index) => {
        const chapterType = getChapterType(subject);

        return {
          id: `${bookId}-chapter-${index + 1}`,

          chapterNumber: index + 1,

          title,

          type: chapterType,

          learningObjective:
            `विद्यार्थी ${title} से संबंधित बुनियादी अवधारणाओं को समझ सकेंगे।`,

          learningOutcomes: getLearningOutcomes(
            grade,
            subject,
            title,
            chapterType
          ),
        
          keywords: [
            title,
            subject,
            `कक्षा ${grade}`,
          ],
        };
      })
      });
    });
  }
}

export function getBooksByGradeAndSubject(grade, subject) {
  return curriculumBooks.filter(
    (book) =>
      book.grade === Number(grade) &&
      book.subject === subject
  );
}

export function getBookById(id) {
  return curriculumBooks.find(
    (book) => book.id === id
  );
}

export { SUBJECTS };