from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import os
import uuid


from translation.translator import translate_text
from speech.stt import speech_to_text
from speech.tts import text_to_speech
from utils.transliteration import roman_hindi_to_devanagari

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "AI Model is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": "nllb-200"
    }


class TranslationRequest(BaseModel):
    text: str
    source_language: str = "hi"
    target_language: str = "sat"

@app.post("/translate")
def translate(request: TranslationRequest):

    translated_text = translate_text(
        request.text,
        request.source_language,
        request.target_language
    )

    return {
        "success": True,
        "source_text": request.text,
        "translated_text": translated_text,
        "source_language": request.source_language,
        "target_language": request.target_language,
        "confidence": 0.85
    }


@app.post("/speech-to-text")
async def speech_to_text_api(
    file: UploadFile = File(...)
):

    audio_path = f"speech/{file.filename}"

    with open(audio_path, "wb") as buffer:
        buffer.write(await file.read())

    result = speech_to_text(audio_path)

    return {
        "success": True,
        "text": result["text"],
        "language": result["language"]
    }


class TTSRequest(BaseModel):
    text: str
    language: str = "hi"


@app.post("/voice-to-voice")
async def voice_to_voice(file: UploadFile = File(...)):

    # -----------------------------
    # 1. Save uploaded Hindi audio
    # -----------------------------
    os.makedirs("speech/uploads", exist_ok=True)

    filename = f"{uuid.uuid4()}_{file.filename}"
    input_path = os.path.join("speech/uploads", filename)

    with open(input_path, "wb") as buffer:
        buffer.write(await file.read())

    try:

        # -----------------------------
        # 2. Speech → Hindi Text
        # -----------------------------
        stt_result = speech_to_text(
            input_path,
            language="hi"
        )

        raw_hindi_text = stt_result["text"]

        hindi_text = roman_hindi_to_devanagari(
        raw_hindi_text
        )

        # -----------------------------
        # 3. Hindi → Santali
        # -----------------------------
        santali_text = translate_text(
            hindi_text,
            source_language="hi",
            target_language="sat"
        )

        # -----------------------------
        # 4. Return text only
        # -----------------------------
        return {
            "success": True,
            "input_text": hindi_text,
            "translated_text": santali_text,
            "source_language": "hi",
            "target_language": "sat",
            "voice_output_available": False,
            "message": "Santali voice output is not implemented yet."
        }

    except Exception as error:

        print("Voice translation error:", error)

        return {
            "success": False,
            "error": str(error)
        }

    finally:

        # Delete temporary audio
        if os.path.exists(input_path):
            os.remove(input_path)