from translation.translator import translate_text


def generate_flashcards(
    items,
    topic,
    target_language="sat",
    count=6
):
    if not items:
        raise ValueError("No flashcard items provided.")

    count = min(count, len(items))

    # selected_items = items[:count]

    cards = []

    for item in items:

        hindi_text = item["hindi"]

        translated_result = translate_text(
            hindi_text,
            "hi",
            target_language
        )

        # Support either:
        # translate_text() -> string
        # or
        # translate_text() -> (text, confidence)

        if isinstance(translated_result, tuple):
            santali_text = translated_result[0]
            confidence = translated_result[1]

        else:
            santali_text = translated_result
            confidence = 0.85

        cards.append({
            "id": item["id"],
            "emoji": item["emoji"],
            "hindi": hindi_text,
            "target": santali_text,
            "confidence": confidence,
        })

    return {
        "topic": topic,
        "target_language": target_language,
        "count": len(cards),
        "cards": cards,
    }