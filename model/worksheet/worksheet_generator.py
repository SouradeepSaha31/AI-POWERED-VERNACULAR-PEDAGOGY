from translation.translator import translate_text


def generate_worksheet(
    lesson,
    target_language="sat",
    difficulty="Easy",
    num_questions=5
):

    questions = []

    base_questions = [
        lesson["assessment"],
        lesson["activity"],
        f"{lesson['title']} के बारे में बताइए।",
        f"{lesson['topic']} से जुड़ी एक वस्तु का नाम बताइए।",
        "सही उत्तर चुनिए।",
    ]

    selected_questions = base_questions[:num_questions]

    for question in selected_questions:

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

    instructions_hi = (
        f"इस गतिविधि को पूरा करें: {lesson['title']}"
    )

    instructions_target, _ = translate_text(
        instructions_hi,
        "hi",
        target_language
    )

    return {
        "title": lesson["title"],
        "difficulty": difficulty,
        "instructions": {
            "hi": instructions_hi,
            "target": instructions_target
        },
        "questions": questions
    }