import { NavLink, Link, Outlet } from "react-router-dom";
import {
  BookOpen,
  Languages,
  FileText,
  LayoutDashboard,
  Image as ImageIcon,
  WifiOff,
  LibraryBig,
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
            <span className="text-slate-400">AI Classroom</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-blue-100 font-medium ${isActive ? "bg-blue-100" : ""}`
                }
              >
                <LayoutDashboard className="w-5 h-5 text-slate-500" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/translate"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-blue-100 font-medium ${isActive ? "bg-blue-100" : ""}`
                }
              >
                <Languages className="w-5 h-5 text-slate-500" />
                Language Translator
              </NavLink>
            </li>
            {/* <li>
              <NavLink to="/dashboard/voice" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-blue-100 font-medium ${isActive ? "bg-blue-100" : ""}`}>
                <span className="w-5 h-5 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full shrink-0">🎤</span>
                Voice Translator
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="/dashboard/curriculum"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-blue-100 font-medium ${isActive ? "bg-blue-100" : ""}`
                }
              >
                <BookOpen className="w-5 h-5 text-slate-500" />
                Curriculum
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/worksheets"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-blue-100 font-medium ${isActive ? "bg-blue-100" : ""}`
                }
              >
                <FileText className="w-5 h-5 text-slate-500" />
                Worksheets
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/flashcards"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-blue-100 font-medium ${isActive ? "bg-blue-100" : ""}`
                }
              >
                <ImageIcon className="w-5 h-5 text-slate-500" />
                Flashcards
              </NavLink>
            </li>
            {/* <li className="pt-4 pb-2">
              <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Library</div>
            </li> */}
            <li>
              <NavLink
                to="/dashboard/library"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-blue-100 font-medium ${
                    isActive ? "bg-blue-100" : ""
                  }`
                }
              >
                <LibraryBig className="w-5 h-5 text-slate-500" />
                My Library
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/offline"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-blue-100 font-medium ${isActive ? "bg-blue-100" : ""}`
                }
              >
                <WifiOff className="w-5 h-5 text-slate-500" />
                Offline Readiness
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              T
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                Teacher Profile
              </p>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
                Online
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
