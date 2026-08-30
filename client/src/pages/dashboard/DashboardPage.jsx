import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, FileText, BookOpen, ImageIcon, Settings2, WifiOff } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Teacher Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your vernacular classroom materials</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm">
            <span className="text-slate-500">Active Language:</span>
            <span className="ml-2 font-semibold text-emerald-600">Santhali</span>
          </div>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="text-sm">
            <span className="text-slate-500">Status:</span>
            <span className="ml-2 font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">Prototype</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Lessons Translated</p>
              <p className="text-3xl font-bold text-slate-900">12</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Languages className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Worksheets Gen.</p>
              <p className="text-3xl font-bold text-slate-900">8</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <FileText className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Voice Sessions</p>
              <p className="text-3xl font-bold text-slate-900">5</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
              <span className="text-2xl">🎤</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Offline Readiness</p>
              <p className="text-xl font-bold text-emerald-600">Optimized</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <WifiOff className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tools */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Classroom Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/dashboard/translate" className="group">
            <Card className="h-full hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Languages className="w-6 h-6" />
                </div>
                <CardTitle>Lesson Translator</CardTitle>
                <CardDescription>Translate Hindi FLN curriculum into native languages automatically.</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/dashboard/voice" className="group">
            <Card className="h-full hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-xl">🎤</span>
                </div>
                <CardTitle>Voice Translator</CardTitle>
                <CardDescription>Real-time conversational translation between teacher and student.</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/dashboard/worksheets" className="group">
            <Card className="h-full hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <CardTitle>Worksheet Generator</CardTitle>
                <CardDescription>Generate bilingual printable worksheets based on learning outcomes.</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/dashboard/flashcards" className="group">
            <Card className="h-full hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <CardTitle>Visual Flashcards</CardTitle>
                <CardDescription>Create educational visual aids with native terminology.</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/dashboard/curriculum" className="group">
            <Card className="h-full hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <CardTitle>Curriculum Library</CardTitle>
                <CardDescription>Browse NIPUN Bharat aligned standard curriculum lessons.</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/dashboard/offline" className="group">
            <Card className="h-full border-dashed hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer bg-slate-50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Settings2 className="w-6 h-6" />
                </div>
                <CardTitle>Offline Readiness</CardTitle>
                <CardDescription>Manage local cached models and curriculum for remote areas.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
