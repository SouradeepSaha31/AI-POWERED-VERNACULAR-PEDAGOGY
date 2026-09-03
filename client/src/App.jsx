import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import TranslatePage from "./pages/dashboard/TranslatePage.jsx";
import VoiceTranslatorPage from "./pages/dashboard/VoiceTranslatorPage.jsx";
import WorksheetsPage from "./pages/dashboard/WorksheetsPage.jsx";
import FlashcardsPage from "./pages/dashboard/FlashcardsPage.jsx";
import CurriculumPage from "./pages/dashboard/CurriculumPage.jsx";
import OfflinePage from "./pages/dashboard/OfflinePage.jsx";


import { useEffect } from "react";
import { testBackend } from "./lib/api";

// function App() {

  

//   // existing code...
// }


export default function App() {

  // useEffect(() => {
  //   testBackend()
  //     .then((data) => {
  //       console.log("Backend Connected:", data);
  //     })
  //     .catch((error) => {
  //       console.error("Backend Connection Failed:", error);
  //     });
  // }, []);


  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="translate" element={<TranslatePage />} />
        <Route path="voice" element={<VoiceTranslatorPage />} />
        <Route path="worksheets" element={<WorksheetsPage />} />
        <Route path="flashcards" element={<FlashcardsPage />} />
        <Route path="curriculum" element={<CurriculumPage />} />
        <Route path="offline" element={<OfflinePage />} />
      </Route>
    </Routes>
  );
}
