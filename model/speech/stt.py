from faster_whisper import WhisperModel


MODEL_SIZE = "base"

model = WhisperModel(
    MODEL_SIZE,
    device="cpu",
    compute_type="int8"
)


def speech_to_text(audio_path, language="hi"):

    segments, info = model.transcribe(
        audio_path,
        language=language,
        beam_size=5
    )

    text = ""

    for segment in segments:
        text += segment.text + " "

    return {
        "text": text.strip(),
        "language": info.language
    }