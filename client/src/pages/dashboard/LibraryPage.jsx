import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  BookOpen,
  FileText,
  Languages,
  Trash2,
  WifiOff,
  ImageIcon,
} from "lucide-react";

import {
  getLibrary,
  deleteFromLibrary,
  clearLibrary,
  subscribeToNetworkStatus,
} from "@/lib/offline";

export default function LibraryPage() {
  const [items, setItems] = useState([]);

  const [online, setOnline] = useState(navigator.onLine);

  const loadLibrary = () => {
    setItems(getLibrary());
  };

  useEffect(() => {
    loadLibrary();

    const handleLibraryUpdate = () => loadLibrary();

    window.addEventListener("libraryUpdated", handleLibraryUpdate);

    const cleanupNetwork = subscribeToNetworkStatus(setOnline);

    return () => {
      window.removeEventListener("libraryUpdated", handleLibraryUpdate);

      cleanupNetwork();
    };
  }, []);

  const getIcon = (type) => {
    if (type === "translation") {
      return <Languages className="w-5 h-5" />;
    }

    if (type === "worksheet") {
      return <FileText className="w-5 h-5" />;
    }

    return <ImageIcon className="w-5 h-5" />;
  };

  const getOpenPath = (item) => {
    if (item.type === "translation") {
      return `/dashboard/translate?libraryId=${encodeURIComponent(item.id)}`;
    }

    if (item.type === "worksheet") {
      return `/dashboard/worksheets?libraryId=${encodeURIComponent(item.id)}`;
    }

    return `/dashboard/flashcards?libraryId=${encodeURIComponent(item.id)}`;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Library</h1>

          <p className="text-slate-500 mt-1">
            Saved classroom materials available on this device
          </p>
        </div>

        <div
          className={`px-3 py-2 rounded-lg text-sm font-medium ${
            online
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {online ? "● Online" : "● Offline"}
        </div>
      </div>

      {!online && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <WifiOff className="w-5 h-5 text-amber-600" />

          <p className="text-sm text-amber-800">
            You are offline. Saved materials remain available.
          </p>
        </div>
      )}

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300" />

            <h2 className="font-semibold text-slate-700 mt-4">
              No saved materials
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Generate a translation, worksheet, or flashcard set to add it
              here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="text-red-500"
              onClick={() => {
                clearLibrary();
                loadLibrary();
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Library
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="bg-white">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mb-3">
                    {getIcon(item.type)}
                  </div>

                  <CardTitle className="text-lg">{item.title}</CardTitle>

                  <p className="text-sm text-slate-500">{item.subtitle}</p>
                </CardHeader>

                <CardContent>
                  <p className="text-xs text-slate-400 mb-4">
                    Saved: {new Date(item.createdAt).toLocaleString()}
                  </p>

                  <div className="flex gap-2">
                    <Link to={getOpenPath(item)} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Open
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      onClick={() => deleteFromLibrary(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
