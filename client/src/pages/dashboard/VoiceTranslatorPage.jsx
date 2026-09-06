// import { useState, useRef } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { voiceTranslate, postTextToSpeech } from "@/lib/api";

// export default function VoiceTranslatorPage() {
//   const [isListening, setIsListening] = useState(false);
//   const [teacherText, setTeacherText] = useState("");
//   const [translatedText, setTranslatedText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isPlayingAudio, setIsPlayingAudio] = useState(false);
//   const [latency, setLatency] = useState(0);
//   const [recordingSeconds, setRecordingSeconds] = useState(0);
//   const [errorMsg, setErrorMsg] = useState("");

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const streamRef = useRef(null);
//   const startTimeRef = useRef(null);
//   const timerRef = useRef(null);

//   // Start recording with continuous timeslice buffering
//   const startListening = async () => {
//     try {
//       setTeacherText("");
//       setTranslatedText("");
//       setLatency(0);
//       setErrorMsg("");
//       setRecordingSeconds(0);

//       if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//         setErrorMsg("Microphone recording is not supported in this browser.");
//         return;
//       }

//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true,
//         },
//       });

//       streamRef.current = stream;
//       audioChunksRef.current = [];

//       const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
//         ? "audio/webm;codecs=opus"
//         : MediaRecorder.isTypeSupported("audio/webm")
//         ? "audio/webm"
//         : "";

//       const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
//       mediaRecorderRef.current = mediaRecorder;

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data && event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorder.onstop = async () => {
//         clearInterval(timerRef.current);

//         // Stop all mic tracks
//         if (streamRef.current) {
//           streamRef.current.getTracks().forEach((track) => track.stop());
//           streamRef.current = null;
//         }

//         const elapsed = Date.now() - (startTimeRef.current || Date.now());
//         if (elapsed < 400 || audioChunksRef.current.length === 0) {
//           setErrorMsg("Recording was too short. Please speak and click stop.");
//           return;
//         }

//         const audioBlob = new Blob(audioChunksRef.current, {
//           type: mediaRecorder.mimeType || "audio/webm",
//         });

//         if (audioBlob.size > 0) {
//           await translateSpeech(audioBlob);
//         }
//       };

//       // Start recording with 250ms timeslice
//       mediaRecorder.start(250);
//       startTimeRef.current = Date.now();
//       setIsListening(true);

//       timerRef.current = setInterval(() => {
//         setRecordingSeconds((s) => s + 1);
//       }, 1000);
//     } catch (error) {
//       console.error("Microphone error:", error);
//       setIsListening(false);
//       clearInterval(timerRef.current);

//       if (error.name === "NotAllowedError") {
//         setErrorMsg("Microphone permission denied. Please allow microphone access.");
//       } else if (error.name === "NotFoundError") {
//         setErrorMsg("No microphone was found. Please connect a microphone and try again.");
//       } else {
//         setErrorMsg("Unable to access microphone. Please check browser permissions.");
//       }
//     }
//   };

//   // Stop recording
//   const stopListening = () => {
//     clearInterval(timerRef.current);
//     if (
//       mediaRecorderRef.current &&
//       mediaRecorderRef.current.state !== "inactive"
//     ) {
//       mediaRecorderRef.current.stop();
//     }
//     setIsListening(false);
//   };

//   // Toggle recording on click
//   const handleToggleListening = () => {
//     if (isListening) {
//       stopListening();
//     } else {
//       startListening();
//     }
//   };

//   // Send recorded audio to backend
//   const translateSpeech = async (audioBlob) => {
//     setLoading(true);
//     setErrorMsg("");

//     const reqStart = performance.now();

//     try {
//       const data = await voiceTranslate(audioBlob);
//       const reqEnd = performance.now();

//       setLatency(Math.round(reqEnd - reqStart));

//       if (data && data.success) {
//         const hindiText = data.input_text || "";
//         const santaliText = data.translated_text || "";

//         setTeacherText(hindiText);
//         setTranslatedText(santaliText);

//         if (!santaliText) {
//           setErrorMsg("No speech detected or translation returned. Please try speaking clearly.");
//         } else {
//           // Automatically play the translated Santali audio
//           handlePlayAudio(santaliText, "sat");
//         }
//       } else {
//         setErrorMsg(data?.error || "Voice translation failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Voice translation error:", error);
//       setErrorMsg("Voice translation service is unavailable. Please make sure servers are running.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Play audio via TTS backend
//   const handlePlayAudio = async (text, lang = "sat") => {
//     if (!text || isPlayingAudio) return;

//     setIsPlayingAudio(true);
//     try {
//       const res = await postTextToSpeech({ text, language: lang });
//       if (res && res.success && res.audioUrl) {
//         const audio = new Audio(res.audioUrl);
//         audio.onended = () => setIsPlayingAudio(false);
//         audio.onerror = () => setIsPlayingAudio(false);
//         await audio.play();
//       } else {
//         setIsPlayingAudio(false);
//       }
//     } catch (err) {
//       console.error("TTS audio playback error:", err);
//       setIsPlayingAudio(false);
//     }
//   };

//   // Demo simulation function
//   const simulateSpeech = () => {
//     const text = "नमस्ते, आज हम संख्या सीखेंगे।";
//     setTeacherText(text);
//     setTranslatedText("ᱡᱚᱦᱟᱨ, ᱛᱮᱦᱮᱧ ᱵᱚᱱ ᱮᱞᱠᱷᱟ ᱪᱮᱫᱚᱜᱼᱟ᱾");
//     handlePlayAudio("ᱡᱚᱦᱟᱨ, ᱛᱮᱦᱮᱧ ᱵᱚᱱ ᱮᱞᱠᱷᱟ ᱪᱮᱫᱚᱜᱼᱟ᱾", "sat");
//   };

//   return (
//     <div className="p-8 max-w-4xl mx-auto space-y-8 h-[calc(100vh-4rem)] flex flex-col">
//       <div>
//         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
//           Classroom Voice Translator
//         </h1>
//         <p className="text-slate-500 mt-1">
//           Real-time bilingual voice communication with your students (Hindi ➔ Santali)
//         </p>
//       </div>

//       <Card className="flex-1 bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
//         {/* Ambient background glows */}
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

//         <CardContent className="p-8 flex-1 flex flex-col justify-between relative z-10">
//           {/* Header language pills */}
//           <div className="flex justify-between items-center bg-slate-800/50 rounded-full px-6 py-3 border border-slate-700 backdrop-blur-sm">
//             <div className="text-center">
//               <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">
//                 Teacher Speaks
//               </p>
//               <p className="text-lg font-bold text-white">Hindi (हिंदी)</p>
//             </div>

//             <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
//               ➔
//             </div>

//             <div className="text-center">
//               <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">
//                 Student Hears
//               </p>
//               <p className="text-lg font-bold text-emerald-400">Santali (ᱥᱟᱱᱛᱟᱲᱤ)</p>
//             </div>
//           </div>

//           {/* Speech transcript and translation boxes */}
//           <div className="flex-1 flex flex-col justify-center space-y-8 my-6">
//             {errorMsg && (
//               <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-xl mx-auto w-full">
//                 <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
//                 <Button
//                   onClick={simulateSpeech}
//                   variant="outline"
//                   size="sm"
//                   className="w-fit bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white shrink-0"
//                 >
//                   Test Demo Voice
//                 </Button>
//               </div>
//             )}

//             {/* Teacher Hindi speech box */}
//             <div className="space-y-1.5 transition-all">
//               <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
//                 Teacher Said (Hindi):
//               </p>
//               <div
//                 className={`min-h-[3.5rem] text-2xl md:text-3xl font-medium text-white transition-opacity ${
//                   !teacherText ? "opacity-30" : "opacity-100"
//                 }`}
//               >
//                 {teacherText || "Click the microphone below and speak in Hindi..."}
//               </div>
//             </div>

//             {/* Santali translation box */}
//             <div className="space-y-1.5">
//               <div className="flex items-center justify-between">
//                 <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
//                   Santali Translation (Ol Chiki):
//                 </p>
//                 {translatedText && (
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => handlePlayAudio(translatedText, "sat")}
//                     disabled={isPlayingAudio}
//                     className="h-8 text-xs text-emerald-300 hover:bg-emerald-950/50 hover:text-emerald-200 gap-1.5 border border-emerald-500/30 rounded-full px-4"
//                   >
//                     {isPlayingAudio ? "🔊 Playing..." : "🔊 Replay Audio"}
//                   </Button>
//                 )}
//               </div>

//               <div className="min-h-[4rem]">
//                 {loading ? (
//                   <div className="flex items-center gap-3 text-emerald-500/80 py-2">
//                     <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" />
//                     <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce delay-100" />
//                     <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce delay-200" />
//                     <span className="text-sm font-medium text-slate-400 ml-2">
//                       Transcribing & Translating...
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="text-2xl md:text-4xl font-bold text-emerald-400 leading-tight">
//                     {translatedText}
//                   </div>
//                 )}
//               </div>

//               {translatedText && latency > 0 && (
//                 <div className="flex items-center gap-3 pt-2">
//                   <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
//                     ⚡ Latency: {(latency / 1000).toFixed(1)}s
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Central Microphone Recording Button with Toggle Click */}
//           <div className="flex flex-col items-center justify-center pb-2 space-y-3">
//             <button
//               type="button"
//               onClick={handleToggleListening}
//               className={`
//                 relative group flex flex-col items-center justify-center w-28 h-28 rounded-full transition-all duration-300 shadow-xl
//                 ${
//                   isListening
//                     ? "bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.6)] scale-110 ring-4 ring-red-300 animate-pulse"
//                     : "bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:scale-105 hover:bg-emerald-400"
//                 }
//               `}
//               title={isListening ? "Click to Stop & Translate" : "Click to Start Speaking"}
//             >
//               {isListening && (
//                 <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-60 pointer-events-none" />
//               )}

//               <span className="text-3xl mb-1 relative z-10 pointer-events-none">
//                 {isListening ? "⏹️" : "🎤"}
//               </span>

//               <span className="text-[11px] font-bold text-white uppercase tracking-wider relative z-10 pointer-events-none">
//                 {isListening ? `Stop (${recordingSeconds}s)` : "Tap to Speak"}
//               </span>
//             </button>

//             <p className="text-xs text-slate-400 font-medium">
//               {isListening ? "Listening... Tap to finish & translate" : "Click once to speak, click again to stop"}
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  voiceTranslate,
  postTextToSpeech,
} from "@/lib/api";

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

  const [recordingSeconds, setRecordingSeconds] =
    useState(0);

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

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

      streamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType =
        MediaRecorder.isTypeSupported(
          "audio/webm;codecs=opus"
        )
          ? "audio/webm;codecs=opus"
          : "audio/webm";

      const recorder = new MediaRecorder(
        stream,
        { mimeType }
      );

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {

        clearInterval(timerRef.current);

        if (streamRef.current) {
          streamRef.current
            .getTracks()
            .forEach((track) => track.stop());

          streamRef.current = null;
        }

        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type: recorder.mimeType,
          }
        );

        if (audioBlob.size === 0) {
          setErrorMsg("No audio recorded.");
          return;
        }

        await handleVoiceTranslation(audioBlob);
      };

      recorder.start(250);

      setIsListening(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds(
          (seconds) => seconds + 1
        );
      }, 1000);

    } catch (error) {
      console.error(error);

      setErrorMsg(
        "Unable to access microphone."
      );
    }
  };

  const stopListening = () => {
    clearInterval(timerRef.current);

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
        "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsListening(false);
  };

  const handleVoiceTranslation = async (
    audioBlob
  ) => {

    setLoading(true);
    setErrorMsg("");

    const startTime =
      performance.now();

    try {

      const result = await voiceTranslate(
        audioBlob,
        sourceLanguage,
        targetLanguage
      );

      const endTime =
        performance.now();

      setLatency(
        Math.round(endTime - startTime)
      );

      if (!result.success) {
        setErrorMsg(
          result.error ||
          "Voice translation failed."
        );

        return;
      }

      setInputText(
        result.input_text || ""
      );

      setTranslatedText(
        result.translated_text || ""
      );

      /*
       * Hindi output can use the current
       * Hindi TTS implementation.
       */

      if (
        targetLanguage === "hi" &&
        result.translated_text
      ) {
        await playAudio(
          result.translated_text,
          "hi"
        );
      }

    } catch (error) {

      console.error(
        "Voice translation error:",
        error
      );

      setErrorMsg(
        "Voice translation service unavailable."
      );

    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (
    text,
    language
  ) => {

    if (!text || isPlayingAudio) return;

    setIsPlayingAudio(true);

    try {

      const result =
        await postTextToSpeech({
          text,
          language,
        });

      if (
        result.success &&
        result.audioUrl
      ) {

        const audio = new Audio(
          result.audioUrl
        );

        audio.onended = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(
            result.audioUrl
          );
        };

        audio.onerror = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(
            result.audioUrl
          );
        };

        await audio.play();

      } else {
        setIsPlayingAudio(false);
      }

    } catch (error) {

      console.error(
        "Audio playback error:",
        error
      );

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

              <p className="text-xs text-slate-400 uppercase">
                Source
              </p>

              <select
                value={sourceLanguage}
                onChange={(e) =>
                  setSourceLanguage(
                    e.target.value
                  )
                }
                className="w-full mt-1 p-3 rounded-lg"
              >
                <option value="hi">
                  {languageNames.hi}
                </option>

                <option value="sat">
                  {languageNames.sat}
                </option>
              </select>

            </div>

            <Button
              onClick={handleSwap}
              className="rounded-full mt-5"
            >
              ⇄
            </Button>

            <div className="flex-1">

              <p className="text-xs text-slate-400 uppercase">
                Target
              </p>

              <select
                value={targetLanguage}
                onChange={(e) =>
                  setTargetLanguage(
                    e.target.value
                  )
                }
                className="w-full mt-1 p-3 rounded-lg"
              >
                <option value="sat">
                  {languageNames.sat}
                </option>

                <option value="hi">
                  {languageNames.hi}
                </option>
              </select>

            </div>

          </div>

          {/* Input */}

          <div>

            <p className="text-xs text-slate-400 uppercase mb-2">
              Speech Input
            </p>

            <div className="min-h-[70px] text-xl text-white">

              {inputText ||
                "Speak after pressing the microphone..."}

            </div>

          </div>

          {/* Output */}

          <div>

            <p className="text-xs text-emerald-400 uppercase mb-2">
              Translation
            </p>

            <div className="min-h-[80px] text-3xl font-bold text-emerald-400">

              {loading
                ? "Transcribing & translating..."
                : translatedText}

            </div>

          </div>

          {/* Warning */}

          {translatedText &&
            targetLanguage === "sat" && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">

                <p className="text-yellow-300 text-sm">
                  ⚠️ Santali voice output is not
                  implemented yet. Santali text
                  translation is available.
                </p>

              </div>
            )}

          {/* Hindi audio status */}

          {translatedText &&
            targetLanguage === "hi" && (
              <Button
                onClick={() =>
                  playAudio(
                    translatedText,
                    "hi"
                  )
                }
                disabled={isPlayingAudio}
              >
                {isPlayingAudio
                  ? "🔊 Playing..."
                  : "🔊 Play Hindi Voice"}
              </Button>
            )}

          {/* Error */}

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
              <p className="text-red-400 text-sm">
                {errorMsg}
              </p>
            </div>
          )}

          {/* Microphone */}

          <div className="flex flex-col items-center">

            <button
              type="button"
              onClick={
                isListening
                  ? stopListening
                  : startListening
              }
              className={`w-28 h-28 rounded-full text-white ${
                isListening
                  ? "bg-red-500"
                  : "bg-emerald-500"
              }`}
            >
              <div className="text-3xl">
                {isListening
                  ? "⏹️"
                  : "🎤"}
              </div>

              <div className="text-xs font-bold mt-1">
                {isListening
                  ? `STOP ${recordingSeconds}s`
                  : "SPEAK"}
              </div>

            </button>

            {latency > 0 && (
              <p className="text-xs text-slate-400 mt-3">
                ⚡ Processing:
                {" "}
                {(latency / 1000).toFixed(1)}s
              </p>
            )}

          </div>

        </CardContent>

      </Card>

    </div>
  );
}