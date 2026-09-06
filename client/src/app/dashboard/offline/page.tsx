"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, Wifi, Smartphone, WifiOff } from "lucide-react";
import { set, get } from "idb-keyval";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check if curriculum is already downloaded
    get('curriculum-cache').then((val) => {
       if (val) setIsDownloaded(true);
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const downloadCurriculum = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/curriculum');
      const data = await res.json();
      if (data.success) {
         await set('curriculum-cache', data.data);
         setIsDownloaded(true);
      }
    } catch (e) {
      console.error("Failed to download curriculum", e);
    }
    setDownloading(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Offline Readiness</h1>
        <p className="text-slate-500 mt-1">Manage local cached models and curriculum for remote areas without internet</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status Card */}
        <Card className="bg-slate-900 text-white border-slate-800 md:col-span-3 lg:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {isOnline ? 'Online Mode' : 'Offline Mode'}
              </span>
            </div>
            <CardTitle>System Status</CardTitle>
            <CardDescription className="text-slate-400">
              {isOnline ? 'Currently connected to cloud AI APIs.' : 'Running entirely from local cache and PWA Service Worker.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-300">Local Cache (Curriculum)</span>
                <span className="text-sm font-bold text-white">{isDownloaded ? 'Loaded' : 'Empty'}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${isDownloaded ? 'bg-emerald-500 w-full' : 'bg-slate-600 w-0'}`}></div>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This Next.js application uses a Service Worker to cache the UI (PWA) and IndexedDB to store the curriculum JSON for zero-internet loading.
            </p>
          </CardContent>
        </Card>

        {/* Content Packs */}
        <div className="md:col-span-3 lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Offline Content Packs</CardTitle>
              <CardDescription>Download curriculum to the device storage via IndexedDB.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Santhali Grade 1 Pack (JSON)</h4>
                    <p className="text-sm text-slate-500">Syncs curriculum to local IndexedDB</p>
                  </div>
                </div>
                {isDownloaded ? (
                  <Button variant="outline" className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    <CheckCircle2 className="w-4 h-4" />
                    Synced
                  </Button>
                ) : (
                  <Button onClick={downloadCurriculum} disabled={downloading} className="bg-slate-900 hover:bg-slate-800 text-white min-w-[120px]">
                    {downloading ? 'Downloading...' : 'Download'}
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Santhali Language Model</h4>
                    <p className="text-sm text-slate-500">1.2 GB • Core translation capabilities</p>
                  </div>
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white" disabled>Future Native App</Button>
              </div>

            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-100">
            <CardContent className="p-6 flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900 mb-1">Android Tablet Architecture</h3>
                <p className="text-emerald-800/80 text-sm leading-relaxed mb-4">
                  This Next.js app is now configured as a PWA (Progressive Web App). You can "Add to Home Screen" on Android tablets. 
                  Once the curriculum is downloaded, the PWA will load instantly without internet, reading directly from IndexedDB.
                </p>
                <div className="flex gap-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-200/50 text-emerald-700 rounded">IndexedDB Sync</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-200/50 text-emerald-700 rounded">Serwist SW</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-200/50 text-emerald-700 rounded">PWA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
