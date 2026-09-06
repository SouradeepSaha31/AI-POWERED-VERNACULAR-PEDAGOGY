import math
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

MODEL_NAME = "facebook/nllb-200-distilled-600M"

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME,
    src_lang="hin_Deva"
)

model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

LANGUAGE_CODES = {
    "hi": "hin_Deva",
    "sat": "sat_Beng",
}


def translate_text(
    text: str,
    source_language: str = "hi",
    target_language: str = "sat"
):
    """
    Translates text bidirectionally (Hindi <-> Santali) and calculates
    a dynamic sequence confidence score based on token transition probabilities.
    """
    if not text or not text.strip():
        return "", 1.0

    source_code = LANGUAGE_CODES.get(source_language, "hin_Deva")
    target_code = LANGUAGE_CODES.get(target_language, "sat_Beng")

    # Set source language in tokenizer
    tokenizer.src_lang = source_code

    # Tokenize input
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=128
    )

    forced_bos_token_id = tokenizer.convert_tokens_to_ids(target_code)

    # Generate translation with output scores enabled for confidence estimation
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            forced_bos_token_id=forced_bos_token_id,
            max_new_tokens=64,
            num_beams=1,
            return_dict_in_generate=True,
            output_scores=True
        )

    # Decode translated tokens
    translation = tokenizer.batch_decode(
        outputs.sequences,
        skip_special_tokens=True
    )[0]

    # Compute sequence confidence score from transition scores
    try:
        transition_scores = model.compute_transition_scores(
            outputs.sequences,
            outputs.scores,
            normalize_logits=True
        )
        if transition_scores[0].numel() > 0:
            avg_log_prob = transition_scores[0].mean().item()
            confidence = round(float(math.exp(avg_log_prob)), 2)
            confidence = max(0.1, min(1.0, confidence))
        else:
            confidence = 0.85
    except Exception as error:
        print("Confidence calculation warning:", error)
        confidence = 0.85

    return translation, confidence