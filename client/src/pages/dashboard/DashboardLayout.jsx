import { Link, Outlet } from "react-router-dom";
import {
  BookOpen,
  Languages,
  FileText,
  LayoutDashboard,
  Image as ImageIcon,
  WifiOff,
} from "lucide-react";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link to="/" className="font-bold text-lg flex items-center gap-2">
            <span className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </span>
            <span>AI Classroom</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 font-medium">
                <LayoutDashboard className="w-5 h-5 text-slate-500" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard/translate" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 font-medium">
                <Languages className="w-5 h-5 text-slate-500" />
                Lesson Translator
              </Link>
            </li>
            <li>
              <Link to="/dashboard/voice" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 font-medium">
                <span className="w-5 h-5 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full shrink-0">🎤</span>
                Voice Translator
              </Link>
            </li>
            <li>
              <Link to="/dashboard/worksheets" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 font-medium">
                <FileText className="w-5 h-5 text-slate-500" />
                Worksheets
              </Link>
            </li>
            <li>
              <Link to="/dashboard/flashcards" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 font-medium">
                <ImageIcon className="w-5 h-5 text-slate-500" />
                Flashcards
              </Link>
            </li>
            <li className="pt-4 pb-2">
              <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Library</div>
            </li>
            <li>
              <Link to="/dashboard/curriculum" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 font-medium">
                <BookOpen className="w-5 h-5 text-slate-500" />
                Curriculum
              </Link>
            </li>
            <li>
              <Link to="/dashboard/offline" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 font-medium">
                <WifiOff className="w-5 h-5 text-slate-500" />
                Offline Readiness
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              T
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Teacher Profile</p>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
