import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFlashcardTopics, postFlashcards } from "@/lib/api";
import { recordActivity } from "@/lib/analytics";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


const TOPIC_LABELS = {
  animals: "Animals",
  fruits: "Fruits",
  vegetables: "Vegetables",
  colors: "Colors",
  shapes: "Shapes",
  numbers: "Numbers",
  bodyParts: "Body Parts",
  schoolObjects: "School Objects",
  vehicles: "Vehicles",
  family: "Family",
};


export default function FlashcardsPage() {

  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState("animals");
  const [count, setCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const [flashcardData, setFlashcardData] = useState(null);
  const [error, setError] = useState("");
  const sheetRef = useRef(null);

  // Load available topics
  useEffect(() => {

    const loadTopics = async () => {

      const result = await getFlashcardTopics();

      if (result.success) {
        setTopics(result.data);
        if (result.data.length > 0) {
          setTopic(result.data[0]);
        }
      } else {
        setError(result.error);
      }
    };
    loadTopics();
  }, []);


  // Generate flashcards
  const handleGenerate = async () => {
      setLoading(true);
      setError("");
      setFlashcardData(null);

      // console.log(topic, count)

      const result = await postFlashcards({
          topic,
          targetLanguage: "sat",
          count,
        });


      if (result.success) {
        // console.log(result)
        setFlashcardData(
          result.data
        );

        recordActivity({
          type: "flashcard",
          title: "Flashcards generated",
          details: TOPIC_LABELS[result.data.topic] || result.data.topic,
        });

      } else {

        setError(
          result.error ||
          "Unable to generate flashcards."
        );

      }

      setLoading(false);
    };


  // Download PDF
  const handleDownloadPDF =
    async () => {

      if (!sheetRef.current) {
        return;
      }


      try {

        const canvas =
          await html2canvas(
            sheetRef.current,
            {
              scale: 2,
              backgroundColor: "#ffffff",
            }
          );


        const image =
          canvas.toDataURL("image/png");


        const pdf =
          new jsPDF(
            "p",
            "mm",
            "a4"
          );


        const pageWidth =
          pdf.internal.pageSize.getWidth();

        const pageHeight =
          pdf.internal.pageSize.getHeight();


        const margin = 8;

        const usableWidth =
          pageWidth -
          margin * 2;

        const ratio =
          canvas.height /
          canvas.width;

        const imageHeight =
          usableWidth * ratio;


        if (
          imageHeight <=
          pageHeight - margin * 2
        ) {

          pdf.addImage(
            image,
            "PNG",
            margin,
            margin,
            usableWidth,
            imageHeight
          );

        } else {

          pdf.addImage(
            image,
            "PNG",
            margin,
            margin,
            usableWidth,
            pageHeight -
              margin * 2
          );
        }


        pdf.save(
          `flashcards-${topic}.pdf`
        );

      } catch (error) {

        console.error(
          "PDF error:",
          error
        );

        setError(
          "Unable to create PDF."
        );
      }
    };


  const handlePrint =
    () => {
      window.print();
    };


  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Visual Flashcards
        </h1>

        <p className="text-slate-500 mt-1">
          Independent bilingual classroom learning tool
        </p>

      </div>


      {/* GENERATOR SETTINGS */}

      <Card>

        <CardHeader>

          <CardTitle>
            Create Flashcards
          </CardTitle>

        </CardHeader>


        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* TOPIC */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Select Topic
              </label>

              <select
                value={topic}
                onChange={(e) =>
                  setTopic(
                    e.target.value
                  )
                }
                className="w-full h-11 border rounded-lg px-3 bg-white"
              >

                {topics.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {TOPIC_LABELS[item] ||
                        item}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* NUMBER OF CARDS */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Number of Flashcards: {count}
              </label>

              <input
                type="range"
                min="2"
                max="8"
                value={count}
                onChange={(e) =>
                  setCount(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full accent-purple-600"
              />

              <div className="flex justify-between text-xs text-slate-400">
                <span>2</span>
                <span>4</span>
                <span>6</span>
                <span>8</span>
              </div>

            </div>

          </div>


          {/* GENERATE BUTTON */}

          <div className="flex justify-end">

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >

              {loading
                ? "Generating..."
                : "Generate Flashcards"}

            </Button>

          </div>

        </CardContent>

      </Card>


      {/* ERROR */}

      {error && (

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">

          <p className="text-red-600">
            {error}
          </p>

        </div>

      )}


      {/* LOADING */}

      {loading && (

        <div className="flex flex-col items-center justify-center p-12">

          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>

          <p className="text-slate-500 mt-4">
            Generating bilingual flashcards...
          </p>

        </div>

      )}


      {/* FLASHCARD SHEET */}

      {flashcardData &&
        !loading && (

          <div className="space-y-5">

            {/* ACTION BUTTONS */}

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


            {/* PRINTABLE SHEET */}

            <div
              ref={sheetRef}
              className="bg-white max-w-[850px] mx-auto p-8 border shadow-sm"
            >

              {/* SHEET HEADER */}

              <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">

                <p className="text-xs uppercase tracking-[0.2em] font-bold text-purple-600">
                  Classroom Learning Tool
                </p>

                <h2 className="text-3xl font-black text-slate-900 mt-1">
                  BILINGUAL FLASHCARDS
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Topic:{" "}
                  {TOPIC_LABELS[
                    flashcardData.topic
                  ] ||
                    flashcardData.topic}
                </p>

              </div>


              {/* CARDS GRID */}

              <div className="grid grid-cols-2 gap-5">

                {(
                  flashcardData.cards ||
                  []
                ).map(
                  (card, index) => (

                    <div
                      key={card.id}
                      className="border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden bg-white"
                    >

                      {/* VISUAL */}

                      <div className="h-44 bg-slate-50 flex items-center justify-center">

                        <span className="text-8xl">
                          {card.emoji}
                        </span>

                      </div>


                      {/* CARD BODY */}

                      <div className="p-5 text-center">

                        <p className="text-xs font-bold text-slate-400 tracking-wider">
                          CARD {index + 1}
                        </p>


                        {/* HINDI */}

                        <div className="mt-3">

                          <p className="text-2xl font-bold text-slate-900">
                            {card.hindi}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            Hindi
                          </p>

                        </div>


                        {/* SANTALI */}

                        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-4">

                          <p className="text-2xl font-bold text-emerald-700">
                            {card.target}
                          </p>

                          <p className="text-xs text-emerald-600 mt-1">
                            Santali
                          </p>

                        </div>


                        {/* CONFIDENCE */}

                        <p className="text-xs text-slate-400 mt-4">
                          Translation confidence:{" "}
                          {Math.round(
                            (card.confidence ||
                              0.85) *
                              100
                          )}
                          %
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>


              {/* FOOTER */}

              <div className="mt-7 pt-4 border-t text-center">

                <p className="text-xs text-slate-400">
                  Hindi ↔ Santali •
                  Bilingual classroom learning
                </p>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}