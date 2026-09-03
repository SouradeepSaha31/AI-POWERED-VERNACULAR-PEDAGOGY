// import { useState, useRef } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { postVoiceTranslate } from "@/lib/api";

// export default function VoiceTranslatorPage() {
//   const [isListening, setIsListening] = useState(false);
//   const [teacherText, setTeacherText] = useState("");
//   const [translatedText, setTranslatedText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [latency, setLatency] = useState(0);
//   const [mode, setMode] = useState("live");
//   const [errorMsg, setErrorMsg] = useState("");

//   const recognitionRef = useRef(null);

//   const startListening = () => {
//     setTeacherText("");
//     setTranslatedText("");
//     setLatency(0);
//     setErrorMsg("");

//     if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
//       alert("Speech recognition is not supported in this browser.");
//       return;
//     }

//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     recognitionRef.current = new SpeechRecognition();
//     recognitionRef.current.lang = "hi-IN";
//     recognitionRef.current.continuous = false;
//     recognitionRef.current.interimResults = true;

//     recognitionRef.current.onstart = () => {
//       setIsListening(true);
//     };

//     recognitionRef.current.onresult = (event) => {
//       const transcript = Array.from(event.results)
//         .map((result) => result[0])
//         .map((result) => result.transcript)
//         .join("");
//       setTeacherText(transcript);
//     };

//     recognitionRef.current.onerror = (event) => {
//       console.error("Speech recognition error:", event.error);
//       setIsListening(false);
//       if (event.error === "network") {
//         setErrorMsg("Network error: Speech recognition requires an active internet connection or HTTPS.");
//       } else if (event.error === "not-allowed") {
//         setErrorMsg("Permission denied: Please allow microphone access.");
//       } else {
//         setErrorMsg(`Speech recognition failed: ${event.error}`);
//       }
//     };

//     recognitionRef.current.onend = () => {
//       setIsListening(false);
//       if (teacherText) {
//         translateSpeech(teacherText);
//       }
//     };

//     recognitionRef.current.start();
//   };

//   const stopListening = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//     }
//   };

//   const translateSpeech = async (text) => {
//     setLoading(true);
//     try {
//       const data = await postVoiceTranslate({
//         text,
//         sourceLanguage: "hi",
//         targetLanguage: "sat", // Santhali
//       });
//       if (data.success) {
//         setTranslatedText(data.data.translatedText);
//         setLatency(data.metadata.latencyMs);
//         setMode(data.metadata.mode);
//         playAudio(data.data.translatedText);
//       }
//     } catch (e) {
//       console.error(e);
//     }
//     setLoading(false);
//   };

//   const playAudio = (text) => {
//     if ("speechSynthesis" in window) {
//       const utterance = new SpeechSynthesisUtterance(text);
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const simulateSpeech = () => {
//     const text = "नमस्ते, आज हम संख्या सीखेंगे।";
//     setTeacherText(text);
//     setErrorMsg("");
//     translateSpeech(text);
//   };

//   return (
//     <div className="p-8 max-w-4xl mx-auto space-y-8 h-[calc(100vh-4rem)] flex flex-col">
//       <div>
//         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Classroom Voice Translator</h1>
//         <p className="text-slate-500 mt-1">Real-time bilingual communication with your students</p>
//       </div>

//       <Card className="flex-1 bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
//         {/* Decorative elements */}
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

//         <CardContent className="p-8 flex-1 flex flex-col justify-between relative z-10">
//           <div className="flex justify-between items-center bg-slate-800/50 rounded-full px-6 py-3 border border-slate-700 backdrop-blur-sm">
//             <div className="text-center">
//               <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Teacher Language</p>
//               <p className="text-lg font-bold text-white">Hindi</p>
//             </div>
//             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
//               ↔
//             </div>
//             <div className="text-center">
//               <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Student Language</p>
//               <p className="text-lg font-bold text-emerald-400">Santhali</p>
//             </div>
//           </div>

//           <div className="flex-1 flex flex-col justify-center space-y-8 my-8">
//             {errorMsg && (
//               <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex flex-col gap-3 max-w-lg mx-auto w-full">
//                 <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
//                 <Button onClick={simulateSpeech} variant="outline" className="w-fit bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white">
//                   Simulate Speech Demo
//                 </Button>
//               </div>
//             )}

//             <div className="space-y-2 transition-all">
//               <p className="text-sm font-medium text-slate-400">Teacher said:</p>
//               <div className={`min-h-[4rem] text-2xl md:text-3xl font-medium text-white transition-opacity ${!teacherText ? "opacity-30" : "opacity-100"}`}>
//                 {teacherText || "Waiting for speech..."}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <p className="text-sm font-medium text-emerald-400">Santhali translation:</p>
//               <div className="min-h-[4rem]">
//                 {loading ? (
//                   <div className="flex items-center gap-3 text-emerald-500/70">
//                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
//                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-75"></div>
//                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-150"></div>
//                   </div>
//                 ) : (
//                   <div className="text-2xl md:text-4xl font-bold text-emerald-400 leading-tight">
//                     {translatedText}
//                   </div>
//                 )}
//               </div>

//               {translatedText && (
//                 <div className="flex items-center gap-4 mt-6">
//                   <Button onClick={() => playAudio(translatedText)} variant="secondary" className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 gap-2 rounded-full px-6">
//                     🔊 Play Translation
//                   </Button>
//                   <span className="text-xs text-slate-500 font-medium">
//                     Latency: {(latency / 1000).toFixed(1)}s {mode === "demo" && "(Demo Mode)"}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex justify-center pb-4">
//             <button
//               onMouseDown={startListening}
//               onMouseUp={stopListening}
//               onTouchStart={startListening}
//               onTouchEnd={stopListening}
//               className={`
//                 relative group flex flex-col items-center justify-center w-32 h-32 rounded-full transition-all duration-300
//                 ${isListening
//                   ? "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-110"
//                   : "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 hover:bg-emerald-400"
//                 }
//               `}
//             >
//               {isListening && (
//                 <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-75"></div>
//               )}
//               <span className="text-4xl mb-1 relative z-10">🎤</span>
//               <span className="text-xs font-bold text-white uppercase tracking-wider relative z-10">
//                 {isListening ? "Listening..." : "Hold to Speak"}
//               </span>
//             </button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }








import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { postVoiceTranslate, voiceTranslate } from "@/lib/api";

export default function VoiceTranslatorPage() {
  const [isListening, setIsListening] = useState(false);
  const [teacherText, setTeacherText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState(0);
  const [mode, setMode] = useState("live");
  const [errorMsg, setErrorMsg] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const startTimeRef = useRef(null);

  // Start recording
  const startListening = async () => {
    try {
      setTeacherText("");
      setTranslatedText("");
      setLatency(0);
      setErrorMsg("");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMsg(
          "Microphone recording is not supported in this browser."
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        // Stop microphone tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        if (audioBlob.size === 0) {
          setErrorMsg("No audio was recorded. Please try again.");
          return;
        }

        await translateSpeech(audioBlob);
      };

      mediaRecorder.start();

      startTimeRef.current = performance.now();

      setIsListening(true);
    } catch (error) {
      console.error("Microphone error:", error);

      setIsListening(false);

      if (error.name === "NotAllowedError") {
        setErrorMsg(
          "Microphone permission denied. Please allow microphone access."
        );
      } else if (error.name === "NotFoundError") {
        setErrorMsg(
          "No microphone was found. Please connect a microphone and try again."
        );
      } else {
        setErrorMsg("Unable to access the microphone.");
      }
    }
  };

  // Stop recording
  const stopListening = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsListening(false);
  };

  // Send recorded audio to backend
  const translateSpeech = async (audioBlob) => {
    setLoading(true);
    setErrorMsg("");

    try {
      // const data = await postVoiceTranslate(audioBlob);
      const data = await voiceTranslate(audioBlob);

      const endTime = performance.now();

      setLatency(
        data?.metadata?.latencyMs ||
          Math.round(endTime - (startTimeRef.current || endTime))
      );

      if (data.success) {
        /*
         * Expected backend response:
         *
         * {
         *   success: true,
         *   input_text: "...",
         *   translated_text: "...",
         *   source_language: "hi",
         *   target_language: "sat",
         *   voice_output_available: false,
         *   message: "Santali voice output is not implemented yet."
         * }
         */

        const hindiText =
          data.input_text ||
          data.data?.inputText ||
          data.data?.input_text ||
          "";

        const santaliText =
          data.translated_text ||
          data.data?.translatedText ||
          data.data?.translated_text ||
          "";

        setTeacherText(hindiText);
        setTranslatedText(santaliText);

        setMode(data.mode || data.metadata?.mode || "live");

        if (!santaliText) {
          setErrorMsg("No Santali translation was returned.");
        }
      } else {
        setErrorMsg(
          data.error || "Translation failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Voice translation error:", error);

      setErrorMsg(
        "Voice translation service is unavailable. Please make sure the Node.js and Python servers are running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Demo function
  const simulateSpeech = async () => {
    const text = "नमस्ते, आज हम संख्या सीखेंगे।";

    setTeacherText(text);
    setTranslatedText("");
    setErrorMsg("");
    setLoading(true);

    try {
      const data = await postVoiceTranslate(
        new Blob([], { type: "audio/webm" })
      );

      if (data.success) {
        setTranslatedText(
          data.translated_text ||
            data.data?.translatedText ||
            ""
        );
      }
    } catch (error) {
      console.error("Demo translation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 h-[calc(100vh-4rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Classroom Voice Translator
        </h1>

        <p className="text-slate-500 mt-1">
          Real-time bilingual communication with your students
        </p>
      </div>

      <Card className="flex-1 bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <CardContent className="p-8 flex-1 flex flex-col justify-between relative z-10">
          <div className="flex justify-between items-center bg-slate-800/50 rounded-full px-6 py-3 border border-slate-700 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Teacher Language
              </p>

              <p className="text-lg font-bold text-white">
                Hindi
              </p>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
              ↔
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Student Language
              </p>

              <p className="text-lg font-bold text-emerald-400">
                Santhali
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-8 my-8">
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex flex-col gap-3 max-w-lg mx-auto w-full">
                <p className="text-red-400 text-sm font-medium">
                  {errorMsg}
                </p>

                <Button
                  onClick={simulateSpeech}
                  variant="outline"
                  className="w-fit bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
                >
                  Simulate Speech Demo
                </Button>
              </div>
            )}

            <div className="space-y-2 transition-all">
              <p className="text-sm font-medium text-slate-400">
                Teacher said:
              </p>

              <div
                className={`min-h-[4rem] text-2xl md:text-3xl font-medium text-white transition-opacity ${
                  !teacherText
                    ? "opacity-30"
                    : "opacity-100"
                }`}
              >
                {teacherText || "Waiting for speech..."}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-emerald-400">
                Santhali translation:
              </p>

              <div className="min-h-[4rem]">
                {loading ? (
                  <div className="flex items-center gap-3 text-emerald-500/70">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>

                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-75"></div>

                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-150"></div>
                  </div>
                ) : (
                  <div className="text-2xl md:text-4xl font-bold text-emerald-400 leading-tight">
                    {translatedText}
                  </div>
                )}
              </div>

              {translatedText && (
                <div className="flex items-center gap-4 mt-6">
                  <span className="text-sm text-slate-400">
                    🔊 Santali voice output is not implemented yet.
                  </span>

                  <span className="text-xs text-slate-500 font-medium">
                    Latency: {(latency / 1000).toFixed(1)}s{" "}
                    {mode === "demo" && "(Demo Mode)"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center pb-4">
            <button
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onMouseLeave={stopListening}
              onTouchStart={startListening}
              onTouchEnd={stopListening}
              className={`
                relative group flex flex-col items-center justify-center w-32 h-32 rounded-full transition-all duration-300
                ${
                  isListening
                    ? "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-110"
                    : "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 hover:bg-emerald-400"
                }
              `}
            >
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-75"></div>
              )}

              <span className="text-4xl mb-1 relative z-10">
                🎤
              </span>

              <span className="text-xs font-bold text-white uppercase tracking-wider relative z-10">
                {isListening
                  ? "Listening..."
                  : "Hold to Speak"}
              </span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}