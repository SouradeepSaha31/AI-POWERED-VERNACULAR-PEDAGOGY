"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FlashcardsPage() {
  const [topic, setTopic] = useState("Animals");
  const [targetLang, setTargetLang] = useState("sat");
  const [count, setCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setFlashcards([]);
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          targetLanguage: targetLang,
          count
        })
      });
      const data = await res.json();
      if (data.success) {
        setFlashcards(data.data);
      }
    } catch (e) {}
    setLoading(false);
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Visual Flashcards</h1>
        <p className="text-slate-500 mt-1">Create educational visual aids with native terminology</p>
      </div>

      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2 md:col-span-2">
              <Label>Topic</Label>
              <Input 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Animals, Fruits, Colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Language</Label>
              <select 
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm"
                value={targetLang} 
                onChange={e => setTargetLang(e.target.value)}
              >
                <option value="sat">Santhali</option>
              </select>
            </div>

            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Cards"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          <p className="text-slate-500 animate-pulse">Designing flashcards...</p>
        </div>
      )}

      {flashcards.length > 0 && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {flashcards.map((card, i) => (
            <Card key={i} className="bg-white border-2 border-slate-100 hover:border-purple-300 transition-colors shadow-sm overflow-hidden group">
              <div className="h-48 bg-purple-50 flex items-center justify-center border-b border-slate-100">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{card.emoji}</span>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{card.concept}</h3>
                    <p className="text-sm text-slate-500">{card.explanation}</p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Hindi:</span>
                    <span className="text-lg font-semibold text-slate-800">{card.hi}</span>
                  </div>
                  <div className="flex justify-between items-center bg-emerald-50 px-3 py-2 rounded-md">
                    <span className="text-sm font-medium text-emerald-700">Santhali:</span>
                    <span className="text-lg font-bold text-emerald-800">{card.target}</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-6 text-purple-600 border-purple-200 hover:bg-purple-50"
                  onClick={() => playAudio(card.target)}
                >
                  🔊 Listen
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
