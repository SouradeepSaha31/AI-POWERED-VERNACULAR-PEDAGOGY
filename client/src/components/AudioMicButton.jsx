import { useState, useRef } from "react";
import { postSpeechToText } from "@/lib/api";

export default function AudioMicButton({ onTranscribe, disabled = false }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  const startRecording = async () => {
    if (disabled || isProcessing) return; 

    try {
      audioChunksRef.current = [];
      setRecordingSeconds(0);

      // High-quality audio constraints for clear speech recognition
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Select supported mimeType
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        clearInterval(timerRef.current);

        // Stop all mic tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed < 400 || audioChunksRef.current.length === 0) {
          setIsProcessing(false);
          setIsRecording(false);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        if (audioBlob.size > 0) {
          setIsProcessing(true);
          try {
            const result = await postSpeechToText(audioBlob);
            if (result && result.success && result.text) {
              onTranscribe(result.text);
            }
          } catch (err) {
            console.error("STT Error:", err);
          } finally {
            setIsProcessing(false);
          }
        }
      };

      // Start recording with 250ms chunks to ensure continuous buffering
      mediaRecorder.start(250);
      startTimeRef.current = Date.now();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((sec) => sec + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setIsRecording(false);
      setIsProcessing(false);
      clearInterval(timerRef.current);
      alert("Microphone permission denied or microphone not found.");
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled || isProcessing}
      className={`relative inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        isRecording
          ? "bg-red-500 text-white shadow-md shadow-red-500/40 ring-2 ring-red-400 scale-105"
          : isProcessing
          ? "bg-slate-100 text-slate-400 cursor-wait"
          : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
      }`}
      title={
        isRecording
          ? "Click to Finish Recording"
          : isProcessing
          ? "Transcribing with Whisper AI..."
          : "Click to Record Voice (STT)"
      }
    >
      {isRecording && (
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
      )}
      <span>{isRecording ? "🔴" : isProcessing ? "⏳" : "🎤"}</span>
      <span>
        {isRecording
          ? `Recording (${recordingSeconds}s)... Stop`
          : isProcessing
          ? "Transcribing..."
          : "Voice Input"}
      </span>
    </button>
  );
}
