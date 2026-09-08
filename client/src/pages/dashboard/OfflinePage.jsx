import { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Wifi,
  WifiOff,
  HardDrive,
  BookOpen,
  FileText,
  ImageIcon,
  LibraryBig,
  Languages,
} from "lucide-react";

import {
  getLibrary,
  getLibraryStats,
  subscribeToNetworkStatus,
} from "@/lib/offline";

export default function OfflinePage() {
  const [online, setOnline] = useState(navigator.onLine);

  const [stats, setStats] = useState(getLibraryStats());

  const refreshStats = () => {
    setStats(getLibraryStats());
  };

  useEffect(() => {
    const cleanup = subscribeToNetworkStatus(setOnline);

    window.addEventListener("libraryUpdated", refreshStats);

    return () => {
      cleanup();

      window.removeEventListener("libraryUpdated", refreshStats);
    };
  }, []);

  const library = getLibrary();

  const storageSize = new Blob([JSON.stringify(library)]).size;

  const storageKB = (storageSize / 1024).toFixed(1);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Offline Readiness</h1>

        <p className="text-slate-500 mt-1">
          Local availability of saved classroom materials
        </p>
      </div>

      {/* STATUS */}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                online ? "bg-emerald-100" : "bg-amber-100"
              }`}
            >
              {online ? (
                <Wifi className="w-7 h-7 text-emerald-600" />
              ) : (
                <WifiOff className="w-7 h-7 text-amber-600" />
              )}
            </div>

            <div>
              <p className="text-sm text-slate-500">Current connection</p>

              <h2 className="text-xl font-bold text-slate-900">
                {online ? "Online" : "Offline"}
              </h2>

              <p className="text-sm text-slate-500">
                {online
                  ? "New AI content can be generated."
                  : "Only locally saved content is available."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LOCAL STORAGE */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-5">
            <HardDrive className="w-6 h-6 text-slate-500 mb-3" />

            <p className="text-sm text-slate-500">Local Storage Used</p>

            <p className="text-2xl font-bold">{storageKB} KB</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <LibraryBig className="w-6 h-6 text-purple-500 mb-3" />

            <p className="text-sm text-slate-500">Saved Materials</p>

            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <Languages className="w-6 h-6 text-blue-500 mb-3" />

            <p className="text-sm text-slate-500">Translations</p>

            <p className="text-2xl font-bold">{stats.translations}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <FileText className="w-6 h-6 text-amber-500 mb-3" />

            <p className="text-sm text-slate-500">Worksheets</p>

            <p className="text-2xl font-bold">{stats.worksheets}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <ImageIcon className="w-6 h-6 text-blue-500 mb-3" />

            <p className="text-sm text-slate-500">Flashcard Sets</p>

            <p className="text-2xl font-bold">{stats.flashcards}</p>
          </CardContent>
        </Card>
      </div>

      {/* WHAT OFFLINE MEANS */}

      <Card className="bg-emerald-50 border-emerald-100">
        <CardHeader>
          <CardTitle className="text-emerald-900">
            Prototype Offline Mode
          </CardTitle>

          <CardDescription className="text-emerald-800">
            Saved materials remain available after losing connectivity.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <BookOpen className="w-5 h-5 text-emerald-600 shrink-0" />

            <p className="text-sm text-emerald-900">
              Previously loaded curriculum data can be served from local cache.
            </p>
          </div>

          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-emerald-600 shrink-0" />

            <p className="text-sm text-emerald-900">
              Previously generated worksheets remain available locally.
            </p>
          </div>

          <div className="flex gap-3">
            <ImageIcon className="w-5 h-5 text-emerald-600 shrink-0" />

            <p className="text-sm text-emerald-900">
              Previously generated flashcards remain available locally.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
