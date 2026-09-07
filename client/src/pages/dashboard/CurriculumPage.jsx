// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { getCurriculum } from "@/lib/api";

// export default function CurriculumPage() {
//   const [lessons, setLessons] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getCurriculum().then((data) => {
//       if (data.success) {
//         setLessons(data.data);
//       }
//       setLoading(false);
//     });
//   }, []);

//   return (
//     <div className="p-8 max-w-6xl mx-auto space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Curriculum Library</h1>
//         <p className="text-slate-500 mt-1">Browse NIPUN Bharat aligned standard curriculum lessons</p>
//       </div>

//       {loading ? (
//         <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div></div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {lessons.map((lesson) => (
//             <Card key={lesson.id} className="flex flex-col">
//               <CardHeader>
//                 <div className="flex justify-between items-start mb-2">
//                   <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">Grade {lesson.grade}</span>
//                   <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-600 rounded">NIPUN Aligned</span>
//                 </div>
//                 <CardTitle>{lesson.title}</CardTitle>
//                 <CardDescription>{lesson.subject} - {lesson.topic}</CardDescription>
//               </CardHeader>
//               <CardContent className="flex-1 flex flex-col justify-between">
//                 <div className="mb-4 text-sm text-slate-600">
//                   <span className="font-semibold text-slate-900">Outcome:</span> {lesson.learningObjective}
//                 </div>

//                 <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
//                   <p className="text-xs text-slate-500 font-medium">Available Languages:</p>
//                   <div className="flex gap-2">
//                     <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-600">✓ Hindi</span>
//                     <span className="text-xs px-2 py-1 bg-emerald-100 rounded text-emerald-700">✓ Santhali</span>
//                   </div>
//                 </div>

//                 <div className="mt-6 flex gap-2">
//                   <Link to={`/dashboard/translate?lessonId=${lesson.id}`} className="flex-1">
//                     <Button variant="outline" className="w-full">Translate</Button>
//                   </Link>
//                   <Link to={`/dashboard/worksheets?lessonId=${lesson.id}`} className="flex-1">
//                     <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Worksheet</Button>
//                   </Link>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  getCurriculumBooks,
} from "@/lib/api";

export default function CurriculumPage() {
  const [grade, setGrade] = useState(1);
  const [subject, setSubject] =
    useState("Mathematics");

  const [books, setBooks] = useState([]);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");

  const subjects = [
    "Hindi",
    "Mathematics",
    "English",
    "Environmental Studies",
    "General Awareness",
  ];

  const handleGo = async () => {
    setLoading(true);
    setError("");
    setBooks([]);

    const result = await getCurriculumBooks({
      grade,
      subject,
    });

    if (result.success) {
      setBooks(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Curriculum Library
        </h1>

        <p className="text-slate-500 mt-1">
          Select class and subject to explore
          curriculum resources
        </p>
      </div>

      {/* Selection */}

      <Card>
        <CardContent className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

            <div>
              <label className="text-sm font-medium">
                Class
              </label>

              <select
                value={grade}
                onChange={(e) =>
                  setGrade(
                    Number(e.target.value)
                  )
                }
                className="w-full mt-2 h-10 border rounded-md px-3"
              >
                {[1, 2, 3, 4, 5].map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      Class {item}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Subject
              </label>

              <select
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                className="w-full mt-2 h-10 border rounded-md px-3"
              >
                {subjects.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleGo}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading
                ? "Loading..."
                : "Go"}
            </Button>

          </div>

        </CardContent>
      </Card>

      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}

      {/* Book cards */}

      {!loading && books.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-5 text-slate-400">
            Available Books
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {books.map((book) => (

              <Card
                key={book.id}
                className="flex flex-col"
              >

                <CardHeader>

                  <div className="flex justify-between">

                    <span className="text-xs px-2 py-1 bg-slate-100 rounded">
                      Class {book.grade}
                    </span>

                    <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded">
                      NIPUN / FLN
                    </span>

                  </div>

                  <CardTitle className="mt-3">
                    {book.title}
                  </CardTitle>

                  <CardDescription>
                    {book.subject}
                  </CardDescription>

                </CardHeader>

                <CardContent className="flex-1">

                  <p className="text-sm text-slate-600 mb-4">
                    {book.description}
                  </p>

                  <div className="text-sm text-slate-500 mb-5">
                    📚 {book.chapterCount} chapters
                  </div>

                  <div className="flex gap-2">

                    <a
                      href={book.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full"
                      >
                        Source
                      </Button>
                    </a>

                    <Link
                      to={`/dashboard/worksheets?bookId=${book.id}`}
                      className="flex-1"
                    >
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Worksheet
                      </Button>
                    </Link>

                  </div>

                </CardContent>

              </Card>

            ))}

          </div>
        </div>
      )}

    </div>
  );
}