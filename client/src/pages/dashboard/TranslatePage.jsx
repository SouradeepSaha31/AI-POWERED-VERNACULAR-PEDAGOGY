import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { translateText } from "@/lib/api";

export default function TranslatePage() {
  const [inputText, setInputText] = useState("बच्चों को गिनती सिखाएं");
  const [sourceLang, setSourceLang] = useState("hi");
  const [targetLang, setTargetLang] = useState("sat");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const playAudio = (text, lang = "hi") => {
  //   if (!text) return;
  //   if ("speechSynthesis" in window) {
  //     // Stop any active speech before playing new audio
  //     window.speechSynthesis.cancel();
  //     const utterance = new SpeechSynthesisUtterance(text);
  //     if (lang === "hi") {
  //       utterance.lang = "hi-IN";
  //     } else if (lang === "sat") {
  //       utterance.lang = "sat";
  //     }
  //     window.speechSynthesis.speak(utterance);
  //   } else {
  //     alert("Text-to-speech is not supported in this browser.");
  //   }
  // };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError("");
    setTranslatedText("");

    try {
      const result = await translateText({
        text: inputText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });

      if (result.success) {
        setTranslatedText(result.translated_text);
      } else {
        setError(result.error || "Translation failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Vernacular Translator</h1>
        <p className="text-slate-500 mt-1">Translate Hindi pedagogy content into Santali</p>
      </div>

      <Card className="bg-white">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Source Language</Label>
              <select
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm mt-1"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
              >
                <option value="hi">Hindi (हिंदी)</option>
              </select>
            </div>

            <div>
              <Label>Target Language</Label>
              <select
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm mt-1"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                <option value="sat">Santhali (ᱥᱟᱱᱛᱟᱲᱤ)</option>
                <option value="un" disabled>Mundari (Coming Soon)</option>
                <option value="ho" disabled>Ho (Coming Soon)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label>Input Text</Label>
              {/* {inputText.trim() && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => playAudio(inputText, sourceLang)}
                  className="h-7 text-xs text-slate-500 hover:text-slate-800 gap-1"
                >
                  🔊 Listen Hindi
                </Button>
              )} */}
            </div>
            <textarea
              className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleTranslate}
            disabled={loading || !inputText.trim()}
          >
            {loading ? "Translating..." : "Translate Text"}
          </Button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {translatedText && !loading && (
        <Card className="border-emerald-200 shadow-md">
          <CardHeader className="bg-emerald-50 border-b border-emerald-100 rounded-t-xl flex flex-row items-center justify-between py-3 px-6">
            <CardTitle className="text-emerald-800 text-lg">Translation Result</CardTitle>
            {/* <Button
              size="sm"
              variant="outline"
              onClick={() => playAudio(translatedText, targetLang)}
              className="gap-2 border-emerald-300 text-emerald-800 hover:bg-emerald-100 bg-white"
            >
              🔊 Listen
            </Button> */}
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-xl font-medium text-slate-800 leading-relaxed">
              {translatedText}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}