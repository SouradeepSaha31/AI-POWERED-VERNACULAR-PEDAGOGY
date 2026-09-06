import edge_tts
import uuid
import os

VOICE_MAP = {
    "hi": "hi-IN-MadhurNeural",
    "en": "en-US-GuyNeural",
    "sat": "hi-IN-MadhurNeural",
}

# Phonetic mapping for Santali Ol Chiki script (U+1C50 - U+1C7F)
OL_CHIKI_TO_DEVANAGARI = {
    '\u1c5a': 'अ', '\u1c5b': 'त्', '\u1c5c': 'ग्', '\u1c5d': 'ङ्', '\u1c5e': 'ल्',
    '\u1c5f': 'आ', '\u1c60': 'क्', '\u1c61': 'ज्', '\u1c62': 'म्', '\u1c63': 'व्',
    '\u1c64': 'इ', '\u1c65': 'स्', '\u1c66': 'ह्', '\u1c67': 'ञ्', '\u1c68': 'र्',
    '\u1c69': 'उ', '\u1c6a': 'च्', '\u1c6b': 'द्', '\u1c6c': 'ण्', '\u1c6d': 'य्',
    '\u1c6e': 'ए', '\u1c6f': 'प्', '\u1c70': 'ड्', '\u1c71': 'न्', '\u1c72': 'ड़्',
    '\u1c73': 'ओ', '\u1c74': 'ट्', '\u1c75': 'ब्', '\u1c76': 'व्', '\u1c77': 'ह',
    '\u1c78': 'ं', '\u1c79': '', '\u1c7a': '', '\u1c7b': '', '\u1c7c': '',
    '\u1c7d': '', '\u1c7e': '', '\u1c7f': ''
}


def phonetic_santali_to_speech_text(text: str) -> str:
    """
    Converts Ol Chiki characters to phonetic Devanagari representation
    so standard Indian neural voices can pronounce the words cleanly.
    """
    if any('\u1c50' <= c <= '\u1c7f' for c in text):
        return ''.join(OL_CHIKI_TO_DEVANAGARI.get(c, c) for c in text)
    return text


async def text_to_speech(text: str, language: str = "hi") -> str:
    if not text or not text.strip():
        raise ValueError("Text is required for TTS synthesis")

    voice = VOICE_MAP.get(language, "hi-IN-MadhurNeural")

    # If text contains Santali Ol Chiki script, phonetically map it for neural voice
    synthesize_text = phonetic_santali_to_speech_text(text)

    filename = f"{uuid.uuid4()}.mp3"
    output_dir = os.path.join(os.path.dirname(__file__), "output")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, filename)

    communicate = edge_tts.Communicate(synthesize_text, voice)
    await communicate.save(output_path)

    return output_path