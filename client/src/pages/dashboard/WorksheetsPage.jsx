import {
  useEffect,
  useState,
  useRef,
} from "react";

import { useSearchParams } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  getBook,
  postWorksheet,
} from "@/lib/api";
import { recordActivity } from "@/lib/analytics";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function WorksheetsPage() {
  const [searchParams] =
    useSearchParams();

  const bookId =
    searchParams.get("bookId") || "";

  const [book, setBook] =
    useState(null);

  const [chapterId, setChapterId] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("Easy");

  const [numQuestions, setNumQuestions] =
    useState(5);

  const [loading, setLoading] =
    useState(false);

  const [worksheet, setWorksheet] =
    useState(null);

  const [error, setError] =
    useState("");

  const worksheetRef =
    useRef(null);

  useEffect(() => {
    if (!bookId) return;

    async function loadBook() {
      const result =
        await getBook(bookId);

      if (result.success) {
        setBook(result.data);

        if (result.data.chapters?.length) {
          setChapterId(
            result.data.chapters[0].id
          );
        }
      } else {
        setError(result.error);
      }
    }

    loadBook();

  }, [bookId]);

  const handleGenerate = async () => {
    if (!bookId || !chapterId) {
      return;
    }

    setLoading(true);
    setWorksheet(null);
    setError("");

    const result =
      await postWorksheet({
        bookId,
        chapterId,
        targetLanguage: "sat",
        difficulty,
        numQuestions,
      });

    if (result.success) {
      setWorksheet(result.data);
      recordActivity({
        type: "worksheet",
        title: "Worksheet generated",
        details: `${result.data.book?.subject || ""} • ${result.data.chapter?.title || ""}`,
      });
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleDownloadPDF = async () => {
    if (!worksheetRef.current) return;

    const canvas =
      await html2canvas(
        worksheetRef.current,
        {
          scale: 2,
        }
      );

    const imgData =
      canvas.toDataURL("image/png");

    const pdf =
      new jsPDF(
        "p",
        "mm",
        "a4"
      );

    const width =
      pdf.internal.pageSize.getWidth();

    const height =
      (canvas.height * width) /
      canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      width,
      height
    );

    pdf.save(
      `worksheet-${Date.now()}.pdf`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Worksheet Generator
        </h1>

        <p className="text-slate-500 mt-1">
          Generate chapter-specific bilingual worksheets
        </p>
      </div>

      {!book && !error && (
        <div className="text-slate-500">
          Loading selected book...
        </div>
      )}

      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}

      {book && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* SETTINGS */}

          <div className="lg:col-span-4">

            <Card className="sticky top-8">

              <CardHeader>
                <CardTitle>
                  Worksheet Settings
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">

                {/* Book */}

                <div>
                  <label className="text-sm font-medium">
                    Selected Book
                  </label>

                  <div className="mt-2 border rounded-md p-3 bg-slate-50 text-sm">
                    <strong>
                      {book.title}
                    </strong>

                    <p className="text-slate-500 mt-1">
                      Class {book.grade} •{" "}
                      {book.subject}
                    </p>
                  </div>
                </div>

                {/* Chapter */}

                <div>
                  <label className="text-sm font-medium">
                    Chapter
                  </label>

                  <select
                    value={chapterId}
                    onChange={(e) =>
                      setChapterId(
                        e.target.value
                      )
                    }
                    className="w-full mt-2 h-10 border rounded-md px-3"
                  >
                    {book.chapters.map(
                      (chapter) => (
                        <option
                          key={chapter.id}
                          value={chapter.id}
                        >
                          Chapter{" "}
                          {chapter.chapterNumber}{" "}
                          - {chapter.title}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Difficulty */}

                <div>
                  <label className="text-sm font-medium">
                    Difficulty
                  </label>

                  <div className="flex gap-2 mt-2">

                    {[
                      "Easy",
                      "Medium",
                      "Hard",
                    ].map((level) => (

                      <Button
                        key={level}
                        size="sm"
                        variant={
                          difficulty === level
                            ? "default"
                            : "outline"
                        }
                        className={
                          difficulty === level
                            ? "bg-amber-600 hover:bg-amber-700"
                            : ""
                        }
                        onClick={() =>
                          setDifficulty(
                            level
                          )
                        }
                      >
                        {level}
                      </Button>

                    ))}

                  </div>
                </div>

                {/* Number */}

                <div>
                  <label className="text-sm font-medium">
                    Questions:{" "}
                    {numQuestions}
                  </label>

                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={numQuestions}
                    onChange={(e) =>
                      setNumQuestions(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full mt-3 accent-amber-600"
                  />
                </div>

                {/* Generate */}

                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 h-12"
                >
                  {loading
                    ? "Generating..."
                    : "Generate Worksheet"}
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

                <div className="flex justify-end gap-3 print:hidden">

                  <Button
                    variant="outline"
                    onClick={handlePrint}
                  >
                    🖨️ Print
                  </Button>

                  <Button
                    onClick={handleDownloadPDF}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    📥 Download PDF
                  </Button>

                </div>

                <div
                  ref={worksheetRef}
                  className="bg-white border shadow-sm p-8 max-w-[595px] mx-auto"
                >

                  <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">

                    <h1 className="text-2xl font-black text-slate-800">
                      {worksheet.chapter.title}
                    </h1>

                    <p className="text-sm text-slate-500 mt-2">
                      Class {worksheet.book.grade} •{" "}
                      {worksheet.book.subject}
                    </p>

                    <p className="text-sm text-slate-500">
                      Difficulty:{" "}
                      {worksheet.difficulty}
                    </p>

                  </div>

                  <div className="bg-slate-100 text-slate-400 p-4 rounded-lg mb-8">

                    <p className="font-semibold">
                      Hindi:
                    </p>

                    <p className="text-slate-400">
                      {
                        worksheet.instructions
                          .hi
                      }
                    </p>

                    <p className="font-semibold text-emerald-700 mt-3">
                      Santali:
                    </p>

                    <p className="text-emerald-700">
                      {
                        worksheet.instructions
                          .target
                      }
                    </p>

                  </div>

                  <div className="space-y-10">

                    {worksheet.questions.map(
                      (question, index) => (

                        <div
                          key={index}
                          className="space-y-3"
                        >

                          <div className="font-bold text-slate-400">
                            Q{index + 1}.
                          </div>

                          <p className="font-medium text-slate-400">
                            {question.q_hi}
                          </p>

                          <p className="text-emerald-700">
                            {question.q_target}
                          </p>

                          <div className="pt-3">
                            <span className="text-slate-800">
                              Answer:
                            </span>

                            <span className="inline-block ml-3 border-b-2 border-slate-400 w-64"></span>
                          </div>

                        </div>

                      )
                    )}

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