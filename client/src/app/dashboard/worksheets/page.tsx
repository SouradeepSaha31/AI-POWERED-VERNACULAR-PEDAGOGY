"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function WorksheetsContent() {
  const searchParams = useSearchParams();
  const initialLessonId = searchParams?.get('lessonId') || "";
  
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState(initialLessonId);
  const [difficulty, setDifficulty] = useState("Easy");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [worksheet, setWorksheet] = useState<any>(null);
  
  const worksheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/curriculum').then(r => r.json()).then(d => {
      if (d.success) setLessons(d.data);
      if (!selectedLesson && d.data.length > 0) setSelectedLesson(d.data[0].id);
    });
  }, []);

  const handleGenerate = async () => {
    if (!selectedLesson) return;
    setLoading(true);
    setWorksheet(null);
    try {
      const res = await fetch('/api/worksheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson,
          targetLanguage: 'sat',
          difficulty,
          numQuestions
        })
      });
      const data = await res.json();
      if (data.success) {
        setWorksheet(data.data);
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleDownloadPDF = async () => {
    if (!worksheetRef.current) return;
    
    const canvas = await html2canvas(worksheetRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`worksheet-${Date.now()}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Worksheet Generator</h1>
        <p className="text-slate-500 mt-1">Generate bilingual printable worksheets based on learning outcomes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white sticky top-8">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Label>Lesson Topic</Label>
                <select 
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={selectedLesson} 
                  onChange={e => setSelectedLesson(e.target.value)}
                >
                  {lessons.map(l => (
                    <option key={l.id} value={l.id}>{l.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Difficulty</Label>
                <div className="flex gap-2">
                  {['Easy', 'Medium', 'Advanced'].map(diff => (
                    <Button 
                      key={diff}
                      variant={difficulty === diff ? "default" : "outline"}
                      className={difficulty === diff ? "bg-amber-600 hover:bg-amber-700" : ""}
                      onClick={() => setDifficulty(diff)}
                      size="sm"
                    >
                      {diff}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Questions: {numQuestions}</Label>
                <input 
                  type="range" 
                  min="3" max="15" 
                  value={numQuestions} 
                  onChange={e => setNumQuestions(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>

              <Button 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-4 h-12"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? "Generating Worksheet..." : "Generate Worksheet"}
              </Button>

            </CardContent>
          </Card>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-8">
          {loading && (
             <div className="h-96 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center space-y-4">
               <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
               <p className="text-slate-500">Designing worksheet using AI...</p>
             </div>
          )}

          {!loading && !worksheet && (
            <div className="h-96 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
              Configure settings and click generate to preview
            </div>
          )}

          {worksheet && !loading && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-end gap-3 print:hidden">
                <Button variant="outline" onClick={handlePrint}>🖨️ Print</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleDownloadPDF}>📥 Download PDF</Button>
              </div>

              {/* Printable Worksheet Container */}
              <div className="bg-white border shadow-sm p-8 min-h-[842px] w-full max-w-[595px] mx-auto print:shadow-none print:border-none print:p-0" ref={worksheetRef}>
                
                <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
                  <h1 className="text-2xl font-black uppercase tracking-widest text-slate-900">{worksheet.title}</h1>
                  <h2 className="text-xl font-bold text-slate-600 mt-1">{worksheet.title} (Santhali)</h2>
                </div>

                <div className="flex justify-between mb-8 border-b border-slate-200 pb-4">
                  <div className="flex gap-2 text-lg">
                    <span className="font-semibold text-slate-900">Name:</span>
                    <span className="border-b border-slate-400 w-48 inline-block"></span>
                  </div>
                  <div className="flex gap-2 text-lg">
                    <span className="font-semibold text-slate-900">Date:</span>
                    <span className="border-b border-slate-400 w-32 inline-block"></span>
                  </div>
                </div>

                <div className="bg-slate-100 p-4 rounded-lg mb-8">
                  <p className="font-semibold text-slate-800">Hindi: {worksheet.instructions.hi}</p>
                  <p className="font-semibold text-emerald-700 mt-1">Santhali: {worksheet.instructions.target}</p>
                </div>

                <div className="space-y-12">
                  {worksheet.questions.map((q: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="font-bold text-xl text-slate-900">Q{i+1}.</div>
                      <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                          <p className="text-lg text-slate-800 font-medium">{q.q_hi}</p>
                          <p className="text-lg text-emerald-700 italic">{q.q_target}</p>
                        </div>
                        
                        <div className="pt-4">
                          <span className="font-semibold text-slate-700">Answer:</span>
                          <span className="border-b-2 border-slate-400 w-full max-w-xs inline-block ml-4"></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function WorksheetsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorksheetsContent />
    </Suspense>
  );
}
