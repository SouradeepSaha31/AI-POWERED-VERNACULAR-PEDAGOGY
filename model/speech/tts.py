import edge_tts
import uuid
import os


VOICE_MAP = {
    "hi": "hi-IN-MadhurNeural",
    "en": "en-US-GuyNeural",
}


async def text_to_speech(text, language="hi"):

    if language not in VOICE_MAP:
        raise ValueError(
            f"No native TTS voice configured for language: {language}"
        )

    voice = VOICE_MAP[language]

    filename = f"{uuid.uuid4()}.mp3"

    output_dir = "speech/output"

    os.makedirs(output_dir, exist_ok=True)

    output_path = os.path.join(
        output_dir,
        filename
    )

    communicate = edge_tts.Communicate(
        text,
        voice
    )

    await communicate.save(output_path)

    return output_path