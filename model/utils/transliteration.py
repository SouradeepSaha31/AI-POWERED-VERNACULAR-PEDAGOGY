from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate


def roman_hindi_to_devanagari(text):

    if not text:
        return ""

    try:
        result = transliterate(
            text,
            sanscript.ITRANS,
            sanscript.DEVANAGARI
        )

        return result

    except Exception as error:

        print("Transliteration error:", error)

        return text