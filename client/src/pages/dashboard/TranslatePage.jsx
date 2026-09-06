import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { translateText, postTextToSpeech } from "@/lib/api";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import AudioMicButton from "@/components/AudioMicButton";

export default function TranslatePage() {
  const [inputText, setInputText] = useState("बच्चों को गिनती सिखाएं");
  const [sourceLang, setSourceLang] = useState("hi");
  const [targetLang, setTargetLang] = useState("sat");
  const [translatedText, setTranslatedText] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [error, setError] = useState("");

  const languageNames = {
    hi: "Hindi (हिंदी)",
    sat: "Santhali (ᱥᱟᱱᱛᱟᱲᱤ)",
  };

  // Swap languages bidirectionally (Hindi <-> Santali)
  const handleSwapLanguages = () => {
    const prevSource = sourceLang;
    const prevTarget = targetLang;
    const prevInput = inputText;
    const prevTranslated = translatedText;

    setSourceLang(prevTarget);
    setTargetLang(prevSource);

    if (prevTranslated) {
      setInputText(prevTranslated);
      setTranslatedText(prevInput);
      setConfidence(null);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError("");
    setTranslatedText("");
    setConfidence(null);

    try {
      const result = await translateText({
        text: inputText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });

      if (result.success) {
        setTranslatedText(result.translated_text);
        setConfidence(result.confidence);
      } else {
        setError(result.error || "Translation failed");
      }
    } catch (err) {
      setError("An unexpected error occurred during translation");
    } finally {
      setLoading(false);
    }
  };

  // Play audio speech synthesis via TTS API
  const handlePlayAudio = async (text, lang) => {
    if (!text || isPlayingAudio) return;

    setIsPlayingAudio(true);
    try {
      const result = await postTextToSpeech({ text, language: lang });
      if (result.success && result.audioUrl) {
        const audio = new Audio(result.audioUrl);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        await audio.play();
      } else {
        setIsPlayingAudio(false);
        alert(result.error || "Audio synthesis is currently available for Hindi.");
      }
    } catch (err) {
      console.error("Audio playback error:", err);
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="p-8 max-w-8xl mx-auto space-y-6">

      <div className="">
        <h1 className="text-3xl font-bold text-slate-900">Vernacular Translator</h1>
        <p className="text-slate-500 mt-1">
          Bidirectional translation between Hindi pedagogy and indigenous Santali (Ol Chiki)
        </p>
      </div>

      <Card className="bg-white shadow-sm border-slate-200">
        <CardContent className="p-6 space-y-4">
          {/* Language Selector Bar with Swap Button */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
                Source Language
              </Label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
              >
                <option value="hi">{languageNames.hi}</option>
                <option value="sat">{languageNames.sat}</option>
              </select>
            </div>

            {/* Language Swap Button */}
            <div className="pt-5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSwapLanguages}
                className="h-10 w-10 rounded-full border-slate-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400 transition-all"
                title="Swap Languages (Hindi ⇄ Santali)"
              >
                ⇄
              </Button>
            </div>

            <div className="flex-1">
              <Label className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
                Target Language
              </Label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                <option value="sat">{languageNames.sat}</option>
                <option value="hi">{languageNames.hi}</option>
              </select>
            </div>
          </div>

          {/* Input Text Area with Speech-to-Text Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-slate-700 font-medium">Input Text</Label>
              <div className="flex items-center gap-2">
                {/* Voice Input Button */}
                <AudioMicButton
                  onTranscribe={(transcript) => {
                    setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
                  }}
                  disabled={loading}
                />

                {/* Listen to input if Hindi */}
                {inputText.trim() && sourceLang === "hi" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePlayAudio(inputText, "hi")}
                    disabled={isPlayingAudio}
                    className="h-8 text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 gap-1"
                  >
                    {isPlayingAudio ? "🔊 Playing..." : "🔊 Listen"}
                  </Button>
                )}
              </div>
            </div>

            <textarea
              className="w-full min-h-[110px] p-3.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans leading-relaxed"
              placeholder={`Enter or speak ${sourceLang === "hi" ? "Hindi" : "Santali"} text to translate...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 shadow-sm transition-all"
            onClick={handleTranslate}
            disabled={loading || !inputText.trim()}
          >
            {loading ? "Translating with NLLB-200..." : "Translate Text"}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Translation Result Card with Confidence Score and TTS */}
      {translatedText && !loading && (
        <Card className="border-emerald-200 shadow-md bg-white">
          <CardHeader className="bg-emerald-50/80 border-b border-emerald-100 rounded-t-xl flex flex-row items-center justify-between py-3.5 px-6">
            <div className="flex items-center gap-3">
              <CardTitle className="text-emerald-900 text-lg font-semibold">
                Translation Result ({targetLang === "sat" ? "Santali" : "Hindi"})
              </CardTitle>
              {/* Dynamic Confidence Score Meter */}
              <ConfidenceBadge score={confidence} />
            </div>

            {/* Text-to-Speech Playback Button (Available for Hindi output) */}
            {targetLang === "hi" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePlayAudio(translatedText, "hi")}
                disabled={isPlayingAudio}
                className="gap-1.5 border-emerald-300 text-emerald-800 hover:bg-emerald-100 bg-white text-xs font-medium"
              >
                {isPlayingAudio ? "🔊 Playing..." : "🔊 Listen"}
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-2xl font-medium text-slate-900 leading-relaxed font-sans">
              {translatedText}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}