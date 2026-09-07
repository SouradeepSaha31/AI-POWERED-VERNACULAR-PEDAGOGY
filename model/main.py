from fastapi import Form
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import os
import uuid

from translation.translator import translate_text
from speech.stt import speech_to_text
from speech.tts import text_to_speech
from utils.transliteration import roman_hindi_to_devanagari
from curriculum.curriculum_service import translate_curriculum
from worksheet.worksheet_generator import generate_worksheet
from flashcards.flashcard_generator import generate_flashcards

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
    translated_text, confidence = translate_text(
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
        "confidence": confidence
    }


@app.post("/speech-to-text")
async def speech_to_text_api(
    file: UploadFile = File(...),
    language: str = Form("hi")
):
    os.makedirs("speech/uploads", exist_ok=True)
    temp_filename = f"{uuid.uuid4()}_{file.filename}"
    audio_path = os.path.join("speech/uploads", temp_filename)

    with open(audio_path, "wb") as buffer:
        buffer.write(await file.read())

    try:
        result = speech_to_text(
            audio_path,
            language=language
        )
        return {
            "success": True,
            "text": result["text"],
            "language": result["language"]
        }
    except Exception as error:
        print("STT Error:", error)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(error)}
        )
    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)


class TTSRequest(BaseModel):
    text: str
    language: str = "hi"


@app.post("/text-to-speech")
async def text_to_speech_api(
    request: TTSRequest,
    background_tasks: BackgroundTasks
):
    try:
        audio_path = await text_to_speech(request.text, request.language)

        def remove_file(path: str):
            if os.path.exists(path):
                os.remove(path)

        background_tasks.add_task(remove_file, audio_path)

        return FileResponse(
            audio_path,
            media_type="audio/mpeg",
            filename="speech.mp3"
        )
    except ValueError as val_err:
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": str(val_err)}
        )
    except Exception as error:
        print("TTS Error:", error)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(error)}
        )


@app.post("/voice-to-voice")
async def voice_to_voice(
    file: UploadFile = File(...),
    source_language: str = Form("hi"),
    target_language: str = Form("sat")
):
    os.makedirs("speech/uploads", exist_ok=True)

    filename = f"{uuid.uuid4()}_{file.filename}"
    input_path = os.path.join("speech/uploads", filename)

    with open(input_path, "wb") as buffer:
        buffer.write(await file.read())

    try:

        # -------------------------
        # Speech → Text
        # -------------------------

        stt_language = source_language

        # Current Whisper setup supports Hindi reliably.
        # Santali speech recognition is not guaranteed by Whisper.
        if source_language == "sat":
            stt_language = None

        stt_result = speech_to_text(
            input_path,
            language=stt_language
        )

        raw_text = stt_result["text"]

        # -------------------------
        # Hindi Roman text cleanup
        # -------------------------

        if source_language == "hi":
            source_text = roman_hindi_to_devanagari(raw_text)
        else:
            source_text = raw_text

        # -------------------------
        # Text Translation
        # -------------------------

        translated_text, confidence = translate_text(
            source_text,
            source_language=source_language,
            target_language=target_language
        )

        return {
            "success": True,
            "input_text": source_text,
            "translated_text": translated_text,
            "source_language": source_language,
            "target_language": target_language,
            "confidence": confidence,

            "voice_output_available": (
                target_language == "hi"
            ),

            "message": (
                "Hindi voice output available."
                if target_language == "hi"
                else "Santali voice output is not implemented yet."
            )
        }

    except Exception as error:

        print("Voice translation error:", error)

        return {
            "success": False,
            "error": str(error)
        }

    finally:

        if os.path.exists(input_path):
            os.remove(input_path)


class CurriculumRequest(BaseModel):
    lesson: dict
    source_language: str = "hi"
    target_language: str = "sat"


@app.post("/translate-curriculum")
def translate_curriculum_api(
    request: CurriculumRequest
):
    translated = translate_curriculum(
        request.lesson,
        request.source_language,
        request.target_language
    )

    return {
        "success": True,
        "data": translated
    }



class WorksheetRequest(BaseModel):
    book: dict
    chapter: dict
    difficulty: str = "Easy"
    num_questions: int = 5
    target_language: str = "sat"


@app.post("/generate-worksheet")
def generate_worksheet_api(
    request: WorksheetRequest
):
    if request.difficulty not in [
        "Easy",
        "Medium",
        "Hard"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Invalid difficulty."
        )

    if not 1 <= request.num_questions <= 15:
        raise HTTPException(
            status_code=400,
            detail="Number of questions must be between 1 and 15."
        )

    worksheet = generate_worksheet(
        book=request.book,
        chapter=request.chapter,
        difficulty=request.difficulty,
        num_questions=request.num_questions,
        target_language=request.target_language,
    )

    return {
        "success": True,
        "data": worksheet
    }


class FlashcardRequest(BaseModel):
    items: list
    topic: str
    target_language: str = "sat"
    count: int = 6


@app.post("/generate-flashcards")
def generate_flashcards_api(
    request: FlashcardRequest
):
    if not request.items:
        raise HTTPException(
            status_code=400,
            detail="Flashcard items are required."
        )

    if request.count < 1 or request.count > 12:
        raise HTTPException(
            status_code=400,
            detail="Count must be between 1 and 12."
        )
    print(request, flush = True)
    result = generate_flashcards(
        items=request.items,
        topic=request.topic,
        target_language=request.target_language,
        count=request.count,
    )

    return {
        "success": True,
        "data": result,
    }

