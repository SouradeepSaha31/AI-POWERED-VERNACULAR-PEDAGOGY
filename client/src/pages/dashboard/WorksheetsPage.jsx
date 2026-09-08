import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { getBook, postWorksheet } from "@/lib/api";

import { recordActivity } from "@/lib/analytics";

import { saveToLibrary, getLibraryItem } from "@/lib/offline";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function WorksheetsPage() {
  const [searchParams] = useSearchParams();

  const bookId = searchParams.get("bookId");
  const libraryId = searchParams.get("libraryId");

  const isLibraryView = Boolean(libraryId);

  const [book, setBook] = useState(null);
  const [chapterId, setChapterId] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [numQuestions, setNumQuestions] = useState(5);

  const [loading, setLoading] = useState(false);
  const [worksheet, setWorksheet] = useState(null);
  const [error, setError] = useState("");

  const worksheetRef = useRef(null);

  // =========================================================
  // LOAD SAVED WORKSHEET FROM LIBRARY
  // =========================================================

  useEffect(() => {
    if (!libraryId) return;

    setError("");
    setBook(null);

    const item = getLibraryItem(libraryId);

    if (!item || item.type !== "worksheet") {
      setError("Saved worksheet not found.");
      return;
    }

    if (!item.content) {
      setError("Saved worksheet content is unavailable.");
      return;
    }

    setWorksheet(item.content);
  }, [libraryId]);

  // =========================================================
  // LOAD BOOK FOR NORMAL GENERATOR MODE ONLY
  // =========================================================

  useEffect(() => {
    if (!bookId || isLibraryView) return;

    setLoading(true);
    setError("");

    async function loadBook() {
      try {
        const result = await getBook(bookId);

        if (result.success) {
          setBook(result.data);

          if (result.data?.chapters?.length > 0) {
            setChapterId(result.data.chapters[0].id);
          }
        } else {
          setError(result.error || "Unable to load the selected book.");
        }
      } catch (err) {
        console.error("Book loading error:", err);

        setError("Unable to load the selected book.");
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [bookId, isLibraryView]);

  // =========================================================
  // GENERATE WORKSHEET
  // =========================================================

  const handleGenerate = async () => {
    // Do not allow generation in Library mode
    if (isLibraryView) return;

    if (!bookId || !chapterId) {
      setError("Please select a valid book and chapter.");
      return;
    }

    setLoading(true);
    setWorksheet(null);
    setError("");

    try {
      const result = await postWorksheet({
        bookId,
        chapterId,
        targetLanguage: "sat",
        difficulty,
        numQuestions,
      });

      if (result.success && result.data) {
        setWorksheet(result.data);

        // Analytics
        recordActivity({
          type: "worksheet",
          title: "Worksheet generated",
          details: `${result.data.book?.subject || ""} • ${
            result.data.chapter?.title || ""
          }`,
        });

        // Save to local library
        saveToLibrary({
          type: "worksheet",
          title: result.data.chapter?.title || "Generated Worksheet",
          subtitle: `Class ${result.data.book?.grade || ""} • ${
            result.data.book?.subject || ""
          } • ${result.data.difficulty || ""}`,
          content: result.data,
        });
      } else {
        setError(result.error || "Unable to generate worksheet.");
      }
    } catch (err) {
      console.error("Worksheet generation error:", err);

      setError("Something went wrong while generating the worksheet.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DOWNLOAD PDF
  // =========================================================

  const handleDownloadPDF = async () => {
    if (!worksheetRef.current) {
      console.error("Worksheet element not found.");
      setError("Worksheet is not ready for download.");
      return;
    }

    try {
      setError("");

      const element = worksheetRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();

      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;

      const contentWidth = pageWidth - margin * 2;

      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      // If content fits on one page
      if (contentHeight <= pageHeight - margin * 2) {
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          margin,
          contentWidth,
          contentHeight,
        );
      } else {
        // Multi-page PDF
        const pageContentHeight = pageHeight - margin * 2;

        let remainingHeight = contentHeight;

        let sourceY = 0;

        while (remainingHeight > 0) {
          if (sourceY > 0) {
            pdf.addPage();
          }

          const currentPageHeight = Math.min(
            remainingHeight,
            pageContentHeight,
          );

          const sourceHeight =
            (currentPageHeight / contentWidth) * canvas.width;

          const pageCanvas = document.createElement("canvas");

          pageCanvas.width = canvas.width;

          pageCanvas.height = Math.ceil(sourceHeight);

          const context = pageCanvas.getContext("2d");

          context.fillStyle = "#ffffff";

          context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

          context.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            canvas.width,
            sourceHeight,
          );

          const pageImage = pageCanvas.toDataURL("image/png");

          pdf.addImage(
            pageImage,
            "PNG",
            margin,
            margin,
            contentWidth,
            currentPageHeight,
          );

          remainingHeight -= currentPageHeight;

          sourceY += sourceHeight;
        }
      }

      // Create PDF blob
      const pdfBlob = pdf.output("blob");

      const url = URL.createObjectURL(pdfBlob);

      // Force browser download
      const link = document.createElement("a");

      link.href = url;

      link.download = `worksheet-${Date.now()}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      // Release memory
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Worksheet PDF download error:", error);

      setError("Unable to download worksheet PDF.");
    }
  };

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = () => {
    window.print();
  };

  // =========================================================
  // SAVED WORKSHEET VIEW
  // =========================================================

  if (isLibraryView) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Saved Worksheet
          </h1>

          <p className="text-slate-500 mt-1">
            Previously generated classroom worksheet
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* LOADING */}

        {!worksheet && !error && (
          <div className="h-64 border-2 border-dashed rounded-xl flex items-center justify-center">
            <p className="text-slate-400">Loading saved worksheet...</p>
          </div>
        )}

        {/* SAVED WORKSHEET */}

        {worksheet && (
          <div className="space-y-5">
            {/* ACTION BUTTONS */}

            {/* <div className="flex justify-end gap-3 print:hidden">
              <Button variant="outline" onClick={handlePrint}>
                🖨️ Print
              </Button>

              <Button
                onClick={handleDownloadPDF}
                className="bg-blue-600 hover:bg-blue-700"
              >
                📥 Download PDF
              </Button>
            </div> */}

            {/* WORKSHEET */}

            <div
              ref={worksheetRef}
              className="bg-white border shadow-sm p-8 max-w-[700px] mx-auto"
            >
              {/* HEADER */}

              <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
                <h1 className="text-2xl font-black text-slate-800">
                  {worksheet.chapter?.title || "Worksheet"}
                </h1>

                <p className="text-sm text-slate-500 mt-2">
                  Class {worksheet.book?.grade || ""}
                  {" • "}
                  {worksheet.book?.subject || ""}
                </p>

                <p className="text-sm text-slate-500">
                  Difficulty: {worksheet.difficulty || ""}
                </p>
              </div>

              {/* INSTRUCTIONS */}

              <div className="bg-slate-100 p-5 rounded-lg mb-8">
                <p className="font-semibold text-slate-800">Hindi:</p>

                <p className="text-slate-700 mt-1">
                  {worksheet.instructions?.hi || ""}
                </p>

                <p className="font-semibold text-emerald-700 mt-4">Santali:</p>

                <p className="text-emerald-700 mt-1">
                  {worksheet.instructions?.target || ""}
                </p>
              </div>

              {/* QUESTIONS */}

              <div className="space-y-10">
                {(worksheet.questions || []).map((question, index) => (
                  <div key={question.id || index} className="space-y-4">
                    <div className="font-bold text-slate-700">
                      Q{index + 1}.
                    </div>

                    <p className="font-medium text-slate-800">
                      {question.q_hi || ""}
                    </p>

                    <p className="text-emerald-700">
                      {question.q_target || ""}
                    </p>

                    <div className="pt-2">
                      <span className="text-slate-800">Answer:</span>

                      <span className="inline-block ml-3 border-b-2 border-slate-400 w-64"></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}

              <div className="mt-10 pt-4 border-t text-center">
                <p className="text-xs text-slate-400">
                  Hindi ↔ Santali
                  {" • "}
                  Bilingual Classroom Worksheet
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================
  // NORMAL GENERATOR VIEW
  // =========================================================

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Worksheet Generator
        </h1>

        <p className="text-slate-500 mt-1">
          Generate chapter-specific bilingual worksheets
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* BOOK LOADING */}

      {!book && !error && (
        <div className="text-slate-500">Loading selected book...</div>
      )}

      {/* GENERATOR */}

      {book && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SETTINGS */}

          <div className="lg:col-span-4">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Worksheet Settings</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* SELECTED BOOK */}

                <div>
                  <label className="text-sm font-medium">Selected Book</label>

                  <div className="mt-2 border rounded-md p-3 bg-slate-50 text-sm">
                    <strong>{book.title}</strong>

                    <p className="text-slate-500 mt-1">
                      Class {book.grade}
                      {" • "}
                      {book.subject}
                    </p>
                  </div>
                </div>

                {/* CHAPTER */}

                <div>
                  <label className="text-sm font-medium">Chapter</label>

                  <select
                    value={chapterId}
                    onChange={(e) => setChapterId(e.target.value)}
                    className="w-full mt-2 h-10 border rounded-md px-3"
                  >
                    {(book.chapters || []).map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        Chapter {chapter.chapterNumber}
                        {" - "}
                        {chapter.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DIFFICULTY */}

                <div>
                  <label className="text-sm font-medium">Difficulty</label>

                  <div className="flex gap-2 mt-2">
                    {["Easy", "Medium", "Hard"].map((level) => (
                      <Button
                        key={level}
                        size="sm"
                        variant={difficulty === level ? "default" : "outline"}
                        className={
                          difficulty === level
                            ? "bg-amber-600 hover:bg-amber-700"
                            : ""
                        }
                        onClick={() => setDifficulty(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* QUESTIONS */}

                <div>
                  <label className="text-sm font-medium">
                    Questions: {numQuestions}
                  </label>

                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full mt-3 accent-amber-600"
                  />
                </div>

                {/* GENERATE */}

                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 h-12"
                >
                  {loading ? "Generating..." : "Generate Worksheet"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* PREVIEW */}

          <div className="lg:col-span-8">
            {loading && (
              <div className="h-96 border-2 border-dashed rounded-xl flex flex-col items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>

                <p className="text-slate-500 mt-4">
                  Generating bilingual worksheet...
                </p>
              </div>
            )}

            {!loading && !worksheet && (
              <div className="h-96 border-2 border-dashed rounded-xl flex items-center justify-center text-slate-400">
                Select chapter, difficulty and question count.
              </div>
            )}

            {worksheet && !loading && (
              <div className="space-y-4">
                {/* ACTIONS */}

                {/* <div className="flex justify-end gap-3 print:hidden">
                  <Button variant="outline" onClick={handlePrint}>
                    🖨️ Print
                  </Button>

                  <Button
                    onClick={handleDownloadPDF}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    📥 Download PDF
                  </Button>
                </div> */}

                {/* WORKSHEET PREVIEW */}

                <div
                  ref={worksheetRef}
                  className="bg-white border shadow-sm p-8 max-w-[595px] mx-auto"
                >
                  <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
                    <h1 className="text-2xl font-black text-slate-800">
                      {worksheet.chapter?.title || "Worksheet"}
                    </h1>

                    <p className="text-sm text-slate-500 mt-2">
                      Class {worksheet.book?.grade || ""} •{" "}
                      {worksheet.book?.subject || ""}
                    </p>

                    <p className="text-sm text-slate-500">
                      Difficulty: {worksheet.difficulty || ""}
                    </p>
                  </div>

                  {/* INSTRUCTIONS */}

                  <div className="bg-slate-100 p-4 rounded-lg mb-8">
                    <p className="font-semibold">Hindi:</p>

                    <p className="text-slate-700">
                      {worksheet.instructions?.hi || ""}
                    </p>

                    <p className="font-semibold text-emerald-700 mt-3">
                      Santali:
                    </p>

                    <p className="text-emerald-700">
                      {worksheet.instructions?.target || ""}
                    </p>
                  </div>

                  {/* QUESTIONS */}

                  <div className="space-y-10">
                    {(worksheet.questions || []).map((question, index) => (
                      <div key={question.id || index} className="space-y-3">
                        <div className="font-bold text-slate-700">
                          Q{index + 1}.
                        </div>

                        <p className="font-medium text-slate-800">
                          {question.q_hi || ""}
                        </p>

                        <p className="text-emerald-700">
                          {question.q_target || ""}
                        </p>

                        <div className="pt-3">
                          <span className="text-slate-800">Answer:</span>

                          <span className="inline-block ml-3 border-b-2 border-slate-400 w-64"></span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER */}

                  <div className="mt-10 pt-4 border-t text-center">
                    <p className="text-xs text-slate-400">
                      Hindi ↔ Santali
                      {" • "}
                      Bilingual Classroom Worksheet
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
