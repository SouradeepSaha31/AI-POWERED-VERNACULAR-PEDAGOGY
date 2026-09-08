import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Languages,
  FileText,
  BookOpen,
  ImageIcon,
  Settings2,
  WifiOff,
  Activity,
  RotateCcw,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getAnalytics,
  clearAnalytics,
  formatActivityTime,
} from "@/lib/analytics";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(() => getAnalytics());

  useEffect(() => {
    const updateAnalytics = () => {
      setAnalytics(getAnalytics());
    };

    window.addEventListener("analyticsUpdated", updateAnalytics);

    return () => {
      window.removeEventListener("analyticsUpdated", updateAnalytics);
    };
  }, []);

  const handleClearAnalytics = () => {
    clearAnalytics();

    setAnalytics(getAnalytics());
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Teacher Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Manage your vernacular classroom materials
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm">
            <span className="text-slate-500">Active Language:</span>

            <span className="ml-2 font-semibold text-emerald-600">
              Santhali
            </span>
          </div>

          <div className="w-px h-4 bg-slate-200"></div>

          <div className="text-sm">
            <span className="text-slate-500">Status:</span>

            <span className="ml-2 font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">
              Prototype
            </span>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Lessons */}

        <Card className="bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Translations
              </p>

              <p className="text-3xl font-bold text-slate-900">
                {analytics.totalTranslations}
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Languages className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Worksheets */}

        <Card className="bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Worksheets Gen.
              </p>

              <p className="text-3xl font-bold text-slate-900">
                {analytics.worksheetsGenerated}
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <FileText className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Flashcards */}

        <Card className="bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Flashcards Gen.
              </p>

              <p className="text-3xl font-bold text-slate-900">
                {analytics.flashcardsGenerated}
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
              <ImageIcon className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Offline */}

        <Card className="bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Offline Readiness
              </p>

              <p className="text-xl font-bold text-emerald-600">Prototype</p>
            </div>

            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <WifiOff className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MAIN TOOLS */}

      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Classroom Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Translation */}

          <Link to="/dashboard/translate" className="group">
            <Card className="h-full hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Languages className="w-6 h-6" />
                </div>

                <CardTitle>Language Translator</CardTitle>

                <CardDescription>
                  Translate Hindi FLN curriculum into native languages
                  automatically.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Worksheet */}

          <Link to="/dashboard/worksheets" className="group">
            <Card className="h-full hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>

                <CardTitle>Worksheet Generator</CardTitle>

                <CardDescription>
                  Generate bilingual printable worksheets based on learning
                  outcomes.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Flashcards */}

          <Link to="/dashboard/flashcards" className="group">
            <Card className="h-full hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>

                <CardTitle>Visual Flashcards</CardTitle>

                <CardDescription>
                  Create educational visual aids with native terminology.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Curriculum */}

          <Link to="/dashboard/curriculum" className="group">
            <Card className="h-full hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>

                <CardTitle>Curriculum Library</CardTitle>

                <CardDescription>
                  Browse NIPUN Bharat aligned standard curriculum lessons.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Offline */}

          <Link to="/dashboard/offline" className="group">
            <Card className="h-full border-dashed hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer bg-slate-50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Settings2 className="w-6 h-6" />
                </div>

                <CardTitle>Offline Readiness</CardTitle>

                <CardDescription>
                  Manage local cached models and curriculum for remote areas.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* ANALYTICS */}

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />

              <h2 className="text-xl font-semibold text-slate-900">
                Teacher Analytics
              </h2>
            </div>

            <p className="text-sm text-slate-500 mt-1">
              Your recent classroom activity
            </p>
          </div>

          <button
            onClick={handleClearAnalytics}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <Card className="bg-white">
          <CardContent className="p-6">
            {analytics.recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-8 h-8 mx-auto text-slate-300" />

                <p className="text-sm text-slate-400 mt-2">
                  No activity recorded yet.
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Generate a worksheet, flashcard set, or translation to see
                  activity here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between gap-4 border-b last:border-b-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        {activity.type === "worksheet" && "📄"}

                        {activity.type === "flashcard" && "🃏"}

                        {activity.type === "translation" && "🌐"}
                      </div>

                      <div>
                        <p className="font-medium text-slate-800">
                          {activity.title}
                        </p>

                        {activity.details && (
                          <p className="text-sm text-slate-500">
                            {activity.details}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 whitespace-nowrap">
                      {formatActivityTime(activity.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
