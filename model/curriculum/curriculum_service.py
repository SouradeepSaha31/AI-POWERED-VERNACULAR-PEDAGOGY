from translation.translator import translate_text


def translate_curriculum(
    lesson,
    source_language="hi",
    target_language="sat"
):
    translated = {
        "id": lesson["id"],
        "grade": lesson["grade"],
        "subject": lesson["subject"],
        "topic": translate_text(
            lesson["topic"],
            source_language,
            target_language
        )[0],
        "title": translate_text(
            lesson["title"],
            source_language,
            target_language
        )[0],
        "learningObjective": translate_text(
            lesson["learningObjective"],
            source_language,
            target_language
        )[0],
        "teacherScript": translate_text(
            lesson["teacherScript"],
            source_language,
            target_language
        )[0],
        "activity": translate_text(
            lesson["activity"],
            source_language,
            target_language
        )[0],
        "assessment": translate_text(
            lesson["assessment"],
            source_language,
            target_language
        )[0],
    }

    return translated