from translation.translator import translate_text


FLASHCARD_DATA = {
    "Animals": [
        {"hi": "गाय", "emoji": "🐄"},
        {"hi": "कुत्ता", "emoji": "🐕"},
        {"hi": "बिल्ली", "emoji": "🐈"},
        {"hi": "घोड़ा", "emoji": "🐎"},
        {"hi": "बकरी", "emoji": "🐐"},
        {"hi": "हाथी", "emoji": "🐘"},
    ],

    "Fruits": [
        {"hi": "सेब", "emoji": "🍎"},
        {"hi": "केला", "emoji": "🍌"},
        {"hi": "आम", "emoji": "🥭"},
        {"hi": "संतरा", "emoji": "🍊"},
        {"hi": "अंगूर", "emoji": "🍇"},
    ],

    "Shapes": [
        {"hi": "वृत्त", "emoji": "⚪"},
        {"hi": "वर्ग", "emoji": "⬜"},
        {"hi": "त्रिभुज", "emoji": "🔺"},
        {"hi": "तारा", "emoji": "⭐"},
    ],
}


def generate_flashcards(
    topic,
    target_language="sat",
    count=6
):

    items = FLASHCARD_DATA.get(
        topic,
        FLASHCARD_DATA["Animals"]
    )

    items = items[:count]

    cards = []

    for item in items:

        translated, confidence = translate_text(
            item["hi"],
            "hi",
            target_language
        )

        cards.append({
            "emoji": item["emoji"],
            "concept": translated,
            "explanation": f"{item['hi']} का स्थानीय शब्द",
            "hi": item["hi"],
            "target": translated,
            "confidence": confidence
        })

    return cards