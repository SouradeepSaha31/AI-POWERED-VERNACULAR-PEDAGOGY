"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { get } from "idb-keyval";

function TranslateContent() {
  const searchParams = useSearchParams();
  const initialLessonId = searchParams?.get('lessonId') || "";
  
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState(initialLessonId);
  const [sourceLang, setSourceLang] = useState("hi");
  const [targetLang, setTargetLang] = useState("sat");
  const [translation, setTranslation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState(0);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const loadCurriculum = async () => {
      if (!navigator.onLine) {
         console.log("Offline mode detected, loading from local cache...");
         const cached = await get('curriculum-cache');
         if (cached) {
            setLessons(cached);
            if (!selectedLesson && cached.length > 0) setSelectedLesson(cached[0].id);
         }
         return;
      }
      
      try {
        const r = await fetch('/api/curriculum');
        const d = await r.json();
        if (d.success) {
           setLessons(d.data);
           if (!selectedLesson && d.data.length > 0) setSelectedLesson(d.data[0].id);
        }
      } catch (err) {
        console.log("Failed to fetch curriculum online, trying cache...");
        const cached = await get('curriculum-cache');
        if (cached) {
           setLessons(cached);
           if (!selectedLesson && cached.length > 0) setSelectedLesson(cached[0].id);
        }
      }
    };
    loadCurriculum();
  }, []);

  const handleTranslate = async () => {
    if (!selectedLesson) return;
    setLoading(true);
    setTranslation(null);
    setEditMode(false);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang
        })
      });
      const data = await res.json();
      if (data.success) {
        setTranslation(data.data);
        setLatency(data.metadata.latencyMs);
      }
    } catch (e) {}
    setLoading(false);
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported in this browser.");
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const activeLesson = lessons.find(l => l.id === selectedLesson);

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Lesson Translator</h1>
        <p className="text-slate-500 mt-1">Translate FLN lessons bi-directionally</p>
      </div>

      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 md:col-span-4 lg:col-span-1">
              <Label>Select Lesson</Label>
              <select 
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm"
                value={selectedLesson} 
                onChange={e => setSelectedLesson(e.target.value)}
              >
                {lessons.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.title} {l.nipunCode ? `[${l.nipunCode}]` : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Source Language</Label>
              <select 
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm"
                value={sourceLang} 
                onChange={e => setSourceLang(e.target.value)}
              >
                <option value="hi">Hindi</option>
                <option value="sat">Santhali</option>
              </select>
            </div>

            <div className="flex justify-center pb-2">
               <Button variant="ghost" onClick={swapLanguages} title="Swap Languages">
                  ⇄
               </Button>
            </div>

            <div className="space-y-2">
              <Label>Target Language</Label>
              <select 
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm"
                value={targetLang} 
                onChange={e => setTargetLang(e.target.value)}
              >
                <option value="hi">Hindi</option>
                <option value="sat">Santhali</option>
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
            <div className="flex items-center gap-4">
              <span>Translation completed in {(latency / 1000).toFixed(1)}s</span>
              {translation.confidence_score && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getConfidenceColor(translation.confidence_score)}`}>
                  Confidence: {translation.confidence_score}%
                </span>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
              {editMode ? "💾 Save Changes" : "✏️ Edit Translation"}
            </Button>
          </div>

          <Card className="border-emerald-200 shadow-md">
            <CardHeader className="bg-emerald-50 rounded-t-xl border-b border-emerald-100">
              <CardTitle className="text-emerald-800 text-2xl flex justify-between items-center">
                <span>{translation.lesson_title}</span>
                {activeLesson?.nipunCode && (
                   <span className="text-sm px-3 py-1 bg-white text-emerald-700 rounded shadow-sm">
                      NIPUN: {activeLesson.nipunCode}
                   </span>
                )}
              </CardTitle>
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
                  {!editMode && <Button size="sm" variant="ghost" onClick={() => playAudio(translation.learning_objective)}>🔊</Button>}
                </div>
                {editMode ? (
                  <textarea 
                    value={translation.learning_objective} 
                    onChange={e => setTranslation({...translation, learning_objective: e.target.value})}
                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-slate-50 border-emerald-300"
                  />
                ) : (
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-md border border-slate-100">{translation.learning_objective}</p>
                )}
              </section>

              <section>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">Teacher Script</h3>
                  {!editMode && <Button size="sm" variant="ghost" onClick={() => playAudio(translation.teacher_script)}>🔊</Button>}
                </div>
                {editMode ? (
                  <textarea 
                    value={translation.teacher_script} 
                    onChange={e => setTranslation({...translation, teacher_script: e.target.value})}
                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-slate-50 border-emerald-300 h-32"
                  />
                ) : (
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-md border border-slate-100 font-medium text-lg leading-relaxed">{translation.teacher_script}</p>
                )}
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Activities</h3>
                <div className="space-y-3">
                  {translation.activities.map((act: string, i: number) => (
                    <div key={i} className="flex gap-4 bg-slate-50 p-4 rounded-md border border-slate-100 items-start">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                      {editMode ? (
                         <textarea 
                           value={act} 
                           onChange={e => {
                             const newActivities = [...translation.activities];
                             newActivities[i] = e.target.value;
                             setTranslation({...translation, activities: newActivities});
                           }}
                           className="flex min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 bg-white border-emerald-300"
                         />
                      ) : (
                         <>
                           <p className="text-slate-700 flex-1">{act}</p>
                           <Button size="sm" variant="ghost" onClick={() => playAudio(act)}>🔊</Button>
                         </>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Assessment</h3>
                <div className="space-y-3">
                  {translation.assessment.map((ast: string, i: number) => (
                    <div key={i} className="flex gap-4 bg-blue-50 p-4 rounded-md border border-blue-100 items-start">
                      <span className="text-xl shrink-0 mt-0.5">📝</span>
                      {editMode ? (
                         <textarea 
                           value={ast} 
                           onChange={e => {
                             const newAssessment = [...translation.assessment];
                             newAssessment[i] = e.target.value;
                             setTranslation({...translation, assessment: newAssessment});
                           }}
                           className="flex min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 bg-white border-blue-300"
                         />
                      ) : (
                        <>
                          <p className="text-slate-800 flex-1">{ast}</p>
                          <Button size="sm" variant="ghost" onClick={() => playAudio(ast)}>🔊</Button>
                        </>
                      )}
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

export default function TranslatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TranslateContent />
    </Suspense>
  );
}
