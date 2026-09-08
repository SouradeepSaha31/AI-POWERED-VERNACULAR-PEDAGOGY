import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { voiceTranslate, postTextToSpeech } from "@/lib/api";

export default function VoiceTranslatorPage() {
  const [sourceLanguage, setSourceLanguage] = useState("hi");
  const [targetLanguage, setTargetLanguage] = useState("sat");

  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const [latency, setLatency] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const languageNames = {
    hi: "Hindi (हिंदी)",
    sat: "Santali (ᱥᱟᱱᱛᱟᱲᱤ)",
  };

  const handleSwap = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);

    setInputText(translatedText || "");
    setTranslatedText(inputText || "");

    setErrorMsg("");
  };

  const startListening = async () => {
    try {
      setErrorMsg("");
      setInputText("");
      setTranslatedText("");
      setRecordingSeconds(0);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        clearInterval(timerRef.current);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());

          streamRef.current = null;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType,
        });

        if (audioBlob.size === 0) {
          setErrorMsg("No audio recorded.");
          return;
        }

        await handleVoiceTranslation(audioBlob);
      };

      recorder.start(250);

      setIsListening(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((seconds) => seconds + 1);
      }, 1000);
    } catch (error) {
      console.error(error);

      setErrorMsg("Unable to access microphone.");
    }
  };

  const stopListening = () => {
    clearInterval(timerRef.current);

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsListening(false);
  };

  const handleVoiceTranslation = async (audioBlob) => {
    setLoading(true);
    setErrorMsg("");

    const startTime = performance.now();

    try {
      const result = await voiceTranslate(
        audioBlob,
        sourceLanguage,
        targetLanguage,
      );

      const endTime = performance.now();

      setLatency(Math.round(endTime - startTime));

      if (!result.success) {
        setErrorMsg(result.error || "Voice translation failed.");

        return;
      }

      setInputText(result.input_text || "");

      setTranslatedText(result.translated_text || "");

      /*
       * Hindi output can use the current
       * Hindi TTS implementation.
       */

      if (targetLanguage === "hi" && result.translated_text) {
        await playAudio(result.translated_text, "hi");
      }
    } catch (error) {
      console.error("Voice translation error:", error);

      setErrorMsg("Voice translation service unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (text, language) => {
    if (!text || isPlayingAudio) return;

    setIsPlayingAudio(true);

    try {
      const result = await postTextToSpeech({
        text,
        language,
      });

      if (result.success && result.audioUrl) {
        const audio = new Audio(result.audioUrl);

        audio.onended = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(result.audioUrl);
        };

        audio.onerror = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(result.audioUrl);
        };

        await audio.play();
      } else {
        setIsPlayingAudio(false);
      }
    } catch (error) {
      console.error("Audio playback error:", error);

      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Classroom Voice Translator
        </h1>

        <p className="text-slate-500 mt-1">
          Speech, translation and classroom communication
        </p>
      </div>

      <Card className="bg-slate-900 border-slate-800 shadow-2xl">
        <CardContent className="p-8 space-y-8">
          {/* Language controls */}

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-slate-400 uppercase">Source</p>

              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full mt-1 p-3 rounded-lg"
              >
                <option value="hi">{languageNames.hi}</option>

                <option value="sat">{languageNames.sat}</option>
              </select>
            </div>

            <Button onClick={handleSwap} className="rounded-full mt-5">
              ⇄
            </Button>

            <div className="flex-1">
              <p className="text-xs text-slate-400 uppercase">Target</p>

              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full mt-1 p-3 rounded-lg"
              >
                <option value="sat">{languageNames.sat}</option>

                <option value="hi">{languageNames.hi}</option>
              </select>
            </div>
          </div>

          {/* Input */}

          <div>
            <p className="text-xs text-slate-400 uppercase mb-2">
              Speech Input
            </p>

            <div className="min-h-[70px] text-xl text-white">
              {inputText || "Speak after pressing the microphone..."}
            </div>
          </div>

          {/* Output */}

          <div>
            <p className="text-xs text-emerald-400 uppercase mb-2">
              Translation
            </p>

            <div className="min-h-[80px] text-3xl font-bold text-emerald-400">
              {loading ? "Transcribing & translating..." : translatedText}
            </div>
          </div>

          {/* Warning */}

          {translatedText && targetLanguage === "sat" && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-yellow-300 text-sm">
                ⚠️ Santali voice output is not implemented yet. Santali text
                translation is available.
              </p>
            </div>
          )}

          {/* Hindi audio status */}

          {translatedText && targetLanguage === "hi" && (
            <Button
              onClick={() => playAudio(translatedText, "hi")}
              disabled={isPlayingAudio}
            >
              {isPlayingAudio ? "🔊 Playing..." : "🔊 Play Hindi Voice"}
            </Button>
          )}

          {/* Error */}

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
              <p className="text-red-400 text-sm">{errorMsg}</p>
            </div>
          )}

          {/* Microphone */}

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`w-28 h-28 rounded-full text-white ${
                isListening ? "bg-red-500" : "bg-emerald-500"
              }`}
            >
              <div className="text-3xl">{isListening ? "⏹️" : "🎤"}</div>

              <div className="text-xs font-bold mt-1">
                {isListening ? `STOP ${recordingSeconds}s` : "SPEAK"}
              </div>
            </button>

            {latency > 0 && (
              <p className="text-xs text-slate-400 mt-3">
                ⚡ Processing: {(latency / 1000).toFixed(1)}s
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
