import random

from translation.translator import translate_text


def generate_hindi_questions(
    chapter,
    difficulty,
    num_questions
):
    title = chapter["title"]
    subject = chapter["type"]

    questions = []

    if subject == "math":
        templates = {
            "Easy": [
                f"गिनती के बारे में एक सही उदाहरण लिखिए।",
                f"{title} में उपयोग होने वाली दो संख्याएँ लिखिए।",
                f"{title} से संबंधित एक सरल प्रश्न हल कीजिए।",
                f"{title} से जुड़ी एक वस्तु का उदाहरण दीजिए।",
                f"{title} का एक महत्वपूर्ण नियम लिखिए।",
            ],

            "Medium": [
                f"{title} से संबंधित निम्न समस्या को हल कीजिए।",
                f"{title} का उपयोग करते हुए दैनिक जीवन का उदाहरण दीजिए।",
                f"{title} से संबंधित दो चरणों वाला प्रश्न हल कीजिए।",
                f"{title} में कौन-सी विधि अधिक उपयुक्त होगी और क्यों?",
                f"{title} पर आधारित एक उदाहरण बनाकर हल कीजिए।",
            ],

            "Hard": [
                f"{title} पर आधारित एक चुनौतीपूर्ण समस्या हल कीजिए।",
                f"{title} का उपयोग करके दैनिक जीवन की समस्या समझाइए।",
                f"{title} से संबंधित दो अलग-अलग तरीकों से उत्तर निकालिए।",
                f"{title} के आधार पर अपना प्रश्न बनाइए और हल कीजिए।",
                f"{title} से संबंधित उत्तर का कारण समझाइए।",
            ],
        }

    elif subject in ("hindi", "english"):
        templates = {
            "Easy": [
                f"{title} की एक मुख्य बात लिखिए।",
                f"{title} से संबंधित दो शब्द लिखिए।",
                f"{title} का एक उदाहरण दीजिए।",
                f"{title} से संबंधित सही उत्तर चुनिए।",
                f"{title} के बारे में एक सरल वाक्य लिखिए।",
            ],

            "Medium": [
                f"{title} का अर्थ अपने शब्दों में समझाइए।",
                f"{title} से संबंधित दो उदाहरण दीजिए।",
                f"{title} का प्रयोग करते हुए एक वाक्य लिखिए।",
                f"{title} में अंतर स्पष्ट कीजिए।",
                f"{title} पर आधारित छोटा उत्तर लिखिए।",
            ],

            "Hard": [
                f"{title} पर आधारित पाँच वाक्यों का उत्तर लिखिए।",
                f"{title} का उपयोग करते हुए एक छोटा अनुच्छेद लिखिए।",
                f"{title} की तुलना किसी संबंधित अवधारणा से कीजिए।",
                f"{title} से संबंधित उदाहरण बनाकर समझाइए।",
                f"{title} के आधार पर अपना प्रश्न बनाइए और उत्तर दीजिए।",
            ],
        }

    else:
        templates = {
            "Easy": [
                f"{title} क्या है?",
                f"{title} से संबंधित दो उदाहरण लिखिए।",
                f"{title} की एक मुख्य विशेषता लिखिए।",
                f"{title} से संबंधित सही उत्तर चुनिए।",
                f"{title} का दैनिक जीवन से एक उदाहरण दीजिए।",
            ],

            "Medium": [
                f"{title} हमारे जीवन के लिए क्यों महत्वपूर्ण है?",
                f"{title} से संबंधित दो कारण लिखिए।",
                f"{title} का दैनिक जीवन में उपयोग समझाइए।",
                f"{title} के दो लाभ बताइए।",
                f"{title} पर आधारित छोटा उत्तर दीजिए।",
            ],

            "Hard": [
                f"{title} से संबंधित समस्या और उसका समाधान समझाइए।",
                f"{title} का पर्यावरण/समाज पर प्रभाव बताइए।",
                f"{title} के बारे में विस्तार से समझाइए।",
                f"{title} से संबंधित कारण और परिणाम लिखिए।",
                f"{title} पर आधारित उदाहरण देकर समझाइए।",
            ],
        }

    selected = []

    while len(selected) < num_questions:
        selected.extend(templates.get(
            difficulty,
            templates["Easy"]
        ))

    return selected[:num_questions]


def generate_worksheet(
    book,
    chapter,
    difficulty="Easy",
    num_questions=5,
    target_language="sat"
):
    hindi_questions = generate_hindi_questions(
        chapter,
        difficulty,
        num_questions
    )

    questions = []

    for question in hindi_questions:

        translated, confidence = translate_text(
            question,
            "hi",
            target_language
        )

        questions.append({
            "q_hi": question,
            "q_target": translated,
            "confidence": confidence
        })

    instruction_hi = (
        f"कक्षा {book['grade']} के "
        f"{book['subject']} विषय में "
        f"अध्याय '{chapter['title']}' पर आधारित "
        f"प्रश्नों को हल करें।"
    )

    instruction_target, instruction_confidence = translate_text(
        instruction_hi,
        "hi",
        target_language
    )

    return {
        "book": {
            "id": book["id"],
            "title": book["title"],
            "grade": book["grade"],
            "subject": book["subject"],
        },

        "chapter": {
            "id": chapter["id"],
            "number": chapter["chapterNumber"],
            "title": chapter["title"],
        },

        "difficulty": difficulty,

        "instructions": {
            "hi": instruction_hi,
            "target": instruction_target,
        },

        "questions": questions,

        "confidence": instruction_confidence,
    }