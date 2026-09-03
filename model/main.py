from fastapi import FastAPI
from pydantic import BaseModel
from translation.translator import translate_text

app = FastAPI()


class TranslationRequest(BaseModel):
    text: str
    source_language: str = "hi"
    target_language: str = "sat"

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
