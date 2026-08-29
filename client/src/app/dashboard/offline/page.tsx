import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, Download, CheckCircle2, Wifi, Smartphone } from "lucide-react";

export default function OfflinePage() {
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
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">
                Online Mode
              </span>
            </div>
            <CardTitle>System Status</CardTitle>
            <CardDescription className="text-slate-400">Currently connected to cloud AI APIs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-300">Local Cache</span>
                <span className="text-sm font-bold text-white">45 MB</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This prototype is currently running in cloud mode. In a production environment on Android tablets, local SLMs (Small Language Models) would be downloaded here.
            </p>
          </CardContent>
        </Card>

        {/* Content Packs */}
        <div className="md:col-span-3 lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Offline Content Packs</CardTitle>
              <CardDescription>Download curriculum and voice models to the device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Santhali Grade 1 Pack</h4>
                    <p className="text-sm text-slate-500">25 Lessons • 18 Audio Files • 12 Worksheets</p>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Downloaded
                </Button>
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
                <Button className="bg-slate-900 hover:bg-slate-800 text-white">Download</Button>
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
                  The eventual production app is designed to run on low-cost Android tablets (2GB RAM). 
                  It will use Capacitor or React Native to wrap this web application and interface with on-device AI models 
                  for zero-latency, zero-internet translations in remote tribal classrooms.
                </p>
                <div className="flex gap-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-200/50 text-emerald-700 rounded">IndexedDB</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-200/50 text-emerald-700 rounded">Service Workers</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-200/50 text-emerald-700 rounded">Local LLM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
