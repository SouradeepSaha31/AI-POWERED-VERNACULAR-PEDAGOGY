from faster_whisper import WhisperModel

MODEL_SIZE = "base"

# Load WhisperModel with int8 quantization on CPU
model = WhisperModel(
    MODEL_SIZE,
    device="cpu",
    compute_type="int8"
)


def speech_to_text(audio_path, language="hi"):
    """
    Transcribes audio rapidly on CPU using beam_size=1 (greedy search)
    and vad_filter=True to strip leading/trailing silence.
    """
    # segments, info = model.transcribe(
    #     audio_path,
    #     language=language,
    #     beam_size=1,
    #     vad_filter=True
    # )

    segments, info = model.transcribe(
        audio_path,
        language="hi",
        task="transcribe",
        beam_size=5,
        initial_prompt="हिंदी भाषा में देवनागरी लिपि में स्पष्ट रूप से लिखें।",
        condition_on_previous_text=False
    )

    text = ""
    for segment in segments:
        text += segment.text + " "

    return {
        "text": text.strip(),
        "language": info.language
    }