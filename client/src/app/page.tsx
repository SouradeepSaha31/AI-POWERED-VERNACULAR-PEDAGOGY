import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen, Languages, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-4xl w-full mx-auto flex flex-col items-center text-center">
          
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-slate-700">Prototype v1.0 Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
            AI Vernacular <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-600">Classroom</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl font-light">
            Empowering teachers to teach children in their mother tongue with real-time translation and AI-generated materials.
          </p>

          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-emerald-600 hover:bg-emerald-700 text-white border-0 mb-16">
              Launch Teacher Dashboard
            </Button>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600">
                  <Languages className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl flex justify-between items-center">
                  Santhali
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Prototype Ready</span>
                </CardTitle>
                <CardDescription className="text-emerald-800/70">
                  Full text, voice, and worksheet generation support.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="opacity-75">
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl flex justify-between items-center text-slate-500">
                  Mundari
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-full">Coming Soon</span>
                </CardTitle>
                <CardDescription>
                  Language models currently in training phase.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="opacity-75">
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl flex justify-between items-center text-slate-500">
                  Ho
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-full">Coming Soon</span>
                </CardTitle>
                <CardDescription>
                  Curriculum localization planned for Q4.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
