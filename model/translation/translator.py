from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch


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
    text,
    source_language="hi",
    target_language="sat"
):

    source_code = LANGUAGE_CODES[source_language]
    target_code = LANGUAGE_CODES[target_language]

    # Set source language
    tokenizer.src_lang = source_code

    # Tokenize input
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=256
    )

    # Generate translation
    with torch.no_grad():

        translated_tokens = model.generate(
            **inputs,
            forced_bos_token_id=tokenizer.convert_tokens_to_ids(
                target_code
            ),
            max_length=256,
            num_beams=4
        )

    # Decode
    translation = tokenizer.batch_decode(
        translated_tokens,
        skip_special_tokens=True
    )[0]

    return translation