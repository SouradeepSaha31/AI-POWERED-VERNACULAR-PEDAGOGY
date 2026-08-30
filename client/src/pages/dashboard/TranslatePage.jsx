import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getCurriculum, postTranslate } from "@/lib/api";

export default function TranslatePage() {
  const [searchParams] = useSearchParams();
  const initialLessonId = searchParams.get("lessonId") || "";

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(initialLessonId);
  const [targetLang, setTargetLang] = useState("sat");
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    getCurriculum().then((d) => {
      if (d.success) setLessons(d.data);
      if (!selectedLesson && d.data.length > 0) setSelectedLesson(d.data[0].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTranslate = async () => {
    if (!selectedLesson) return;
    setLoading(true);
    setTranslation(null);
    try {
      const data = await postTranslate({
        lessonId: selectedLesson,
        sourceLanguage: "hi",
        targetLanguage: targetLang,
      });
      if (data.success) {
        setTranslation(data.data);
        setLatency(data.metadata.latencyMs);
      }
    } catch (e) {}
    setLoading(false);
  };

  const playAudio = (text) => {
    // In a real app, this would call TTS API or use browser TTS with a specific lang tag.
    // For prototype, we use SpeechSynthesis API if available, though native Santhali isn't usually supported.
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported in this browser.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Lesson Translator</h1>
        <p className="text-slate-500 mt-1">Translate Hindi FLN lessons into vernacular languages</p>
      </div>

      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <Label>Select Lesson</Label>
              <select
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm"
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
              >
                {lessons.map((l) => (
                  <option key={l.id} value={l.id}>{l.title} (Grade {l.grade})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Target Language</Label>
              <select
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                <option value="sat">Santhali (Prototype)</option>
                <option value="un" disabled>Mundari (Coming Soon)</option>
                <option value="ho" disabled>Ho (Coming Soon)</option>
              </select>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleTranslate}
              disabled={loading}
            >
              {loading ? "Translating..." : "Translate Lesson"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-slate-500 animate-pulse">AI is translating lesson content...</p>
        </div>
      )}

      {translation && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>Translation completed</span>
            <span>Latency: {(latency / 1000).toFixed(1)} seconds</span>
          </div>

          <Card className="border-emerald-200 shadow-md">
            <CardHeader className="bg-emerald-50 rounded-t-xl border-b border-emerald-100">
              <CardTitle className="text-emerald-800 text-2xl">{translation.lesson_title}</CardTitle>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Target: {translation.language}
                </span>
                <Button size="sm" variant="outline" onClick={() => playAudio(translation.lesson_title)} className="gap-2">
                  🔊 Listen
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">Learning Objective</h3>
                  <Button size="sm" variant="ghost" onClick={() => playAudio(translation.learning_objective)}>🔊</Button>
                </div>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-md border border-slate-100">{translation.learning_objective}</p>
              </section>

              <section>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">Teacher Script</h3>
                  <Button size="sm" variant="ghost" onClick={() => playAudio(translation.teacher_script)}>🔊</Button>
                </div>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-md border border-slate-100 font-medium text-lg leading-relaxed">{translation.teacher_script}</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Activities</h3>
                <div className="space-y-3">
                  {translation.activities.map((act, i) => (
                    <div key={i} className="flex gap-4 bg-slate-50 p-4 rounded-md border border-slate-100 items-start">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-slate-700 flex-1">{act}</p>
                      <Button size="sm" variant="ghost" onClick={() => playAudio(act)}>🔊</Button>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Assessment</h3>
                <div className="space-y-3">
                  {translation.assessment.map((ast, i) => (
                    <div key={i} className="flex gap-4 bg-blue-50 p-4 rounded-md border border-blue-100 items-start">
                      <span className="text-xl shrink-0 mt-0.5">📝</span>
                      <p className="text-slate-800 flex-1">{ast}</p>
                      <Button size="sm" variant="ghost" onClick={() => playAudio(ast)}>🔊</Button>
                    </div>
                  ))}
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
