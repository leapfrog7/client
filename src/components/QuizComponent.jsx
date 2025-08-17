// import { useState, useEffect } from "react";
// import { FaChevronUp, FaChevronDown } from "react-icons/fa";
// import axios from "axios";
// import PropTypes from "prop-types";
// import { MdOutlineBookmarkAdded } from "react-icons/md";
// import { MdOutlineBookmarkRemove } from "react-icons/md";
// import { IoReload } from "react-icons/io5";
// import { MdPreview } from "react-icons/md";
// import { TailSpin } from "react-loader-spinner"; // Importing the loading spinner
// import QuestionFeedback from "./QuestionFeedback";

// const QuizComponent = ({ userId, topicName, topicId }) => {
//   const [quizData, setQuizData] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false); //for loader spinner
//   const [showExplanation, setShowExplanation] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [loadingBM, setLoadingBM] = useState(false);
//   const [error, setError] = useState(null);
//   const [showAllQuestions, setShowAllQuestions] = useState(false);

//   const token = localStorage.getItem("jwtToken");

//   const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL
//   // const BASE_URL = "http://localhost:5000/api/v1";
//   const fetchUnattemptedQuestions = async () => {
//     setLoading(true);
//     try {
//       const endpoint = showAllQuestions
//         ? `${BASE_URL}/quiz/getRandomQuiz`
//         : `${BASE_URL}/quiz/getQuiz`;
//       const response = await axios.get(endpoint, {
//         params: { userId, topicName, topicId },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setQuizData(response.data);
//     } catch (error) {
//       console.error("Failed to fetch questions:", error);
//       setError("Failed to fetch questions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBookmarks = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/quiz/fetchAllBookmarks`, {
//         params: { userId, topicId },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       //console.log("fetchBookmarks", response.data.bookmarks);
//       const topicBookmark = response.data.bookmarks.find(
//         (bookmark) => bookmark.topic._id === topicId
//       );
//       if (topicBookmark) {
//         setBookmarkedQuestions(topicBookmark.questions.map((q) => q._id));
//       } else {
//         setBookmarkedQuestions([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch bookmarks:", error);
//     }
//   };
//   useEffect(() => {
//     if (userId) {
//       fetchUnattemptedQuestions();
//       fetchBookmarks();
//     }
//   }, [topicName, showAllQuestions, topicId]);

//   const handleOptionClick = (option) => {
//     setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: option });
//   };

//   const handleBookmark = async () => {
//     const currentQuestionId = quizData[currentQuestionIndex]._id;
//     setLoadingBM(true);
//     try {
//       if (!bookmarkedQuestions.includes(currentQuestionId.toString())) {
//         await axios.post(
//           `${BASE_URL}/quiz/addBookmark`,
//           {
//             userId,
//             topicName,
//             questionId: currentQuestionId,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`, // Add the token to the headers
//             },
//           }
//         );
//         setBookmarkedQuestions([
//           ...bookmarkedQuestions,
//           currentQuestionId.toString(),
//         ]);
//         //setLoadingBM(false)
//       } else {
//         await axios.delete(`${BASE_URL}/quiz/removeBookmark`, {
//           data: { userId, topicName, questionId: currentQuestionId },
//           headers: {
//             Authorization: `Bearer ${token}`, // Add the token to the headers
//           },
//         });
//         setBookmarkedQuestions(
//           bookmarkedQuestions.filter(
//             (id) => id !== currentQuestionId.toString()
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Failed to update bookmark:", error);
//       setError("Failed to update bookmark");
//     } finally {
//       setLoadingBM(false);
//     }
//   };

//   const handleNavigation = (direction) => {
//     setCurrentQuestionIndex(currentQuestionIndex + direction);
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       //console.log("inside handleSubmit");

//       await axios.post(
//         `${BASE_URL}/quiz/submitQuiz`,
//         {
//           userId,
//           topicName,
//           attemptedQuestions: quizData.map((question) => question._id),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Add the token to the headers
//           },
//         }
//       );

//       setIsSubmitted(true);
//     } catch (error) {
//       console.error("Failed to submit quiz:", error);
//       setError("Failed to submit quiz");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const toggleExplanation = (index) => {
//     setShowExplanation({
//       ...showExplanation,
//       [index]: !showExplanation[index],
//     });
//   };

//   if (loading) {
//     return <div>Loading questions...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }
//   //Once the Quiz are all done, the random question option doesn't appear. It is being fixed here by rendering the component again.
//   if (quizData.length === 0) {
//     return (
//       <div>
//         <div className="flex justify-end mb-4 mr-4">
//           <label className="inline-flex items-center">
//             <span className="mr-4 text-sm md:text-lg">Random Questions</span>
//             <input
//               type="checkbox"
//               checked={showAllQuestions}
//               onChange={() =>
//                 setShowAllQuestions((prev) => {
//                   setCurrentQuestionIndex(0);
//                   return !prev;
//                 })
//               }
//               className="hidden mr-2"
//             />
//             <span
//               className={`w-8 h-4 flex items-center flex-shrink-0 p-0 bg-blue-300 rounded-full duration-300 ease-in-out ${
//                 showAllQuestions ? "bg-blue-400" : "bg-gray-600"
//               }`}
//             >
//               <span
//                 className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-400 ease-in-out ${
//                   showAllQuestions ? "translate-x-4 bg-blue-700" : "bg-white"
//                 }`}
//               ></span>
//             </span>
//           </label>
//         </div>
//         <div>No questions available for this topic.</div>
//       </div>
//     );
//   }

//   const currentQuestion = quizData[currentQuestionIndex];

//   const calculateScore = () => {
//     return quizData.reduce((score, question, index) => {
//       return (
//         score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
//       );
//     }, 0);
//   };

//   const score = calculateScore();

//   return (
//     <div className="min-h-screen">
//       <div className="flex justify-end mb-4 mr-4">
//         <label className="inline-flex items-center">
//           <span className="mr-4 text-sm md:text-lg">Random Questions</span>
//           <input
//             type="checkbox"
//             checked={showAllQuestions}
//             onChange={() =>
//               setShowAllQuestions((prev) => {
//                 setCurrentQuestionIndex(0);
//                 return !prev;
//               })
//             }
//             className="hidden mr-2"
//           />
//           <span
//             className={`w-8 h-4 flex items-center flex-shrink-0 p-0 bg-blue-300 rounded-full duration-300 ease-in-out ${
//               showAllQuestions ? "bg-blue-400" : "bg-gray-600"
//             }`}
//           >
//             <span
//               className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-400 ease-in-out ${
//                 showAllQuestions ? "translate-x-4 bg-blue-700" : "bg-white"
//               }`}
//             ></span>
//           </span>
//         </label>
//       </div>

//       {!isSubmitted ? (
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="mb-4">
//             <h2 className="text-sm font-bold mb-2">{`Question ${
//               currentQuestionIndex + 1
//             }`}</h2>
//             <p
//               className="text-gray-800 mb-4 font-semibold text-sm md:text-lg"
//               style={{ whiteSpace: "pre-line" }}
//             >
//               {currentQuestion.questionText}
//             </p>
//             {currentQuestion.options.map((option, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleOptionClick(option)}
//                 className={`block w-full text-left p-2 mb-2 border rounded-lg text-sm md:text-base ${
//                   selectedAnswers[currentQuestionIndex] === option
//                     ? "bg-customCyan text-white"
//                     : "bg-white text-black"
//                 }`}
//               >
//                 {option}
//               </button>
//             ))}
//           </div>
//           <div className="flex justify-between text-sm md:text-lg">
//             <button
//               onClick={() => handleNavigation(-1)}
//               disabled={currentQuestionIndex === 0}
//               className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <button
//               onClick={handleBookmark}
//               className={`px-4 py-2 rounded text-xl ${
//                 bookmarkedQuestions.includes(currentQuestion._id)
//                   ? "bg-yellow-500"
//                   : "bg-gray-300"
//               }`}
//             >
//               {!loadingBM ? (
//                 bookmarkedQuestions.includes(currentQuestion._id) ? (
//                   <MdOutlineBookmarkRemove />
//                 ) : (
//                   <MdOutlineBookmarkAdded />
//                 )
//               ) : (
//                 <TailSpin color="#fff" height={20} width={20} />
//               )}
//             </button>
//             <button
//               onClick={() => handleNavigation(1)}
//               disabled={currentQuestionIndex === quizData.length - 1}
//               className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>

//           <div>
//             <button
//               onClick={() => toggleExplanation(currentQuestionIndex)}
//               className="my-6 px-4 py-2 bg-yellow-300 text-black rounded mx-auto flex items-center min-w-24 text-sm md:text-base"
//             >
//               {showExplanation[currentQuestionIndex]
//                 ? "Hide Answer"
//                 : "Show Answer"}
//               {showExplanation[currentQuestionIndex] ? (
//                 <FaChevronUp className="ml-2" />
//               ) : (
//                 <FaChevronDown className="ml-2" />
//               )}
//             </button>
//             {/* {console.log(quizData[currentQuestionIndex]._id)} */}

//             {showExplanation[currentQuestionIndex] && (
//               <div className="mt-4 text-gray-700 text-sm md:text-base space-y-3">
//                 {/* Answer Section */}
//                 <div className="flex items-center gap-2 bg-green-50 border-l-4 border-green-500 rounded-md px-3 py-2 shadow-sm">
//                   <span className="font-semibold text-green-800">
//                     Answer: <br />
//                     <span className="text-green-700 font-bold px-1 py-1 rounded-md shadow-sm">
//                       {currentQuestion.correctAnswer}
//                     </span>
//                   </span>
//                 </div>

//                 {/* Explanation Section */}
//                 <div className="bg-blue-50 border-l-4 border-blue-400 rounded-md px-3 py-2 shadow-sm">
//                   <strong className="text-blue-700">Explanation:</strong>
//                   <p className="mt-1 whitespace-pre-line leading-relaxed text-gray-700">
//                     {currentQuestion.explanation}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {currentQuestionIndex === quizData.length - 1 && (
//             <div className="mt-4 flex justify-center">
//               <button
//                 onClick={handleSubmit}
//                 className="px-12 py-2 bg-gradient-to-b from-emerald-600 to-emerald-800 text-white rounded items-center"
//                 disabled={isSubmitting} // Disable button when submitting
//               >
//                 {isSubmitting ? (
//                   <TailSpin color="#fff" height={20} width={20} />
//                 ) : (
//                   "Submit"
//                 )}
//               </button>
//             </div>
//           )}
//           <div className="mt-2">
//             <QuestionFeedback questionId={quizData[currentQuestionIndex]._id} />
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-bold mb-4">Quiz Results</h2>
//           {/* Dynamic Score Display */}
//           <p
//             className={`text-base font-bold my-4 py-2 px-4 text-center rounded-full shadow-sm ${
//               score >= quizData.length * 0.7
//                 ? "bg-green-100 text-green-700"
//                 : score >= quizData.length * 0.4
//                 ? "bg-yellow-100 text-yellow-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//           >
//             🎯 Your Score: {calculateScore()} / {quizData.length}
//           </p>
//           {quizData.map((question, index) => (
//             <div
//               key={index}
//               className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-300"
//             >
//               <p className="font-semibold text-gray-700">{`Question ${
//                 index + 1
//               }: ${question.questionText}`}</p>
//               <p
//                 className={`text-${
//                   selectedAnswers[index] === question.correctAnswer
//                     ? "green"
//                     : "red"
//                 }-700 my-2`}
//               >
//                 {/* {`Your Answer: ${selectedAnswers[index]}`} */}
//                 {selectedAnswers[index] === question.correctAnswer
//                   ? "✅"
//                   : "❌"}{" "}
//                 Your Answer: {selectedAnswers[index] || "Not Attempted"}
//               </p>
//               {selectedAnswers[index] !== question.correctAnswer && (
//                 <p className="text-green-800 font-semibold">{`Correct Answer: ${question.correctAnswer}`}</p>
//               )}
//               <button
//                 onClick={() => toggleExplanation(index)}
//                 className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500  hover:from-blue-500 hover:to-cyan-500 text-white rounded flex items-center"
//               >
//                 {showExplanation[index]
//                   ? "Hide Explanation"
//                   : "Show Explanation"}
//                 {showExplanation[index] ? (
//                   <FaChevronUp className="ml-2" />
//                 ) : (
//                   <FaChevronDown className="ml-2" />
//                 )}
//               </button>
//               {showExplanation[index] && (
//                 <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md shadow-inner transition-all duration-300 ease-in-out">
//                   <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//                     <strong className="text-blue-700">Explanation:</strong>{" "}
//                     {question.explanation}
//                   </p>
//                 </div>
//               )}
//             </div>
//           ))}

//           <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto">
//             {/* Review Again Button */}
//             <button
//               onClick={() => setIsSubmitted(false)}
//               className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-indigo-600 hover:to-blue-500 transform  flex items-center gap-2"
//             >
//               <MdPreview className="text-xl" />
//               <span>Review Again</span>
//             </button>

//             {/* Take Another Quiz Button */}
//             <button
//               onClick={() => window.location.reload()}
//               className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:from-rose-500 hover:to-pink-500 transform flex items-center gap-2"
//             >
//               <IoReload className="text-xl" />
//               <span>Take Another Quiz</span>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// QuizComponent.propTypes = {
//   userId: PropTypes.string.isRequired,
//   topicName: PropTypes.string.isRequired,
//   topicId: PropTypes.string,
// };

// export default QuizComponent;

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import PropTypes from "prop-types";
import {
  MdOutlineBookmarkAdded,
  MdOutlineBookmarkRemove,
} from "react-icons/md";
import { IoReload } from "react-icons/io5";
import { MdPreview } from "react-icons/md";
import { TailSpin } from "react-loader-spinner";
import QuestionFeedback from "./QuestionFeedback";

// ✅ Drop-in: single-file component with client-only upgrades (no backend changes)

const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; // keep your existing
const TOKEN = () => localStorage.getItem("jwtToken");

// Local storage helpers
const storageKey = (userId, topicId) => `quiz:${userId}:${topicId}`;
const loadState = (userId, topicId) => {
  try {
    const raw = localStorage.getItem(storageKey(userId, topicId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveState = (userId, topicId, state) => {
  try {
    localStorage.setItem(storageKey(userId, topicId), JSON.stringify(state));
  } catch (e) {
    // localStorage can fail (Safari private mode / quota). Swallow in prod, warn in dev.
    if (typeof process !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn("saveState failed:", e);
    }
  }
};

const SKELETON = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
    <div className="h-5 w-3/4 bg-gray-200 rounded mb-4" />
    <div className="space-y-2">
      <div className="h-10 w-full bg-gray-200 rounded" />
      <div className="h-10 w-full bg-gray-200 rounded" />
      <div className="h-10 w-full bg-gray-200 rounded" />
      <div className="h-10 w-full bg-gray-200 rounded" />
    </div>
    <div className="flex justify-between mt-6">
      <div className="h-9 w-24 bg-gray-200 rounded" />
      <div className="h-9 w-10 bg-gray-200 rounded" />
      <div className="h-9 w-24 bg-gray-200 rounded" />
    </div>
  </div>
);

const QuizComponent = ({ userId, topicName, topicId }) => {
  // ---- Core state
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // {index: optionText}
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]); // store as strings
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingBM, setLoadingBM] = useState(false);
  const [error, setError] = useState(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  // Enhancements
  const [flagged, setFlagged] = useState(new Set()); // client-only flagging
  const [finalScore, setFinalScore] = useState(null); // compute once on submit
  const [filterView, setFilterView] = useState("all"); // results filter: all|wrong|flagged|bookmarked

  // Refs for aborting/canceling stale requests
  const fetchAbortRef = useRef(null);
  const bookmarkReqId = useRef(0);
  const submittedOnce = useRef(false);
  // put with other refs
  const pillRefs = useRef([]);

  // --- Swipe refs/state ---
  const touchStart = useRef({ x: 0, y: 0, t: 0 });
  const touchCurr = useRef({ x: 0, y: 0 });
  const swipeCooldownRef = useRef(0); // timestamp ms

  const SWIPE_DIST = 48; // min horizontal px
  const SWIPE_ANGLE = 30; // max degrees off horizontal
  const SWIPE_COOLDOWN = 350; // ms

  const onTouchStart = (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    touchCurr.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchMove = (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    touchCurr.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = () => {
    // const dt = Date.now() - touchStart.current.t;
    if (Date.now() - swipeCooldownRef.current < SWIPE_COOLDOWN) return;

    const dx = touchCurr.current.x - touchStart.current.x;
    const dy = touchCurr.current.y - touchStart.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absX < SWIPE_DIST) return; // too short
    if (absY > absX * Math.tan((SWIPE_ANGLE * Math.PI) / 180)) return; // too vertical

    // decide direction
    if (dx < 0 && currentQuestionIndex < quizData.length - 1) {
      handleNavigation(1);
      swipeCooldownRef.current = Date.now();
    } else if (dx > 0 && currentQuestionIndex > 0) {
      handleNavigation(-1);
      swipeCooldownRef.current = Date.now();
    }
  };

  // --- Smooth slide transition state ---
  const [animState, setAnimState] = useState("idle"); // "idle" | "leaving" | "entering"
  const [animDir, setAnimDir] = useState("left"); // "left" or "right"

  const SLIDE_MS = 200; // match Tailwind duration-200

  const animateNavigate = useCallback(
    (dir) => {
      if (dir > 0 && currentQuestionIndex >= quizData.length - 1) return;
      if (dir < 0 && currentQuestionIndex <= 0) return;

      // 1) leave
      setAnimDir(dir > 0 ? "left" : "right");
      setAnimState("leaving");

      setTimeout(() => {
        // update index mid-way
        setCurrentQuestionIndex((i) =>
          Math.min(Math.max(i + dir, 0), quizData.length - 1)
        );

        // 2) enter from opposite side
        setAnimDir(dir > 0 ? "right" : "left");
        setAnimState("entering");

        // 3) next frame -> idle (this triggers the actual 'animate in')
        requestAnimationFrame(() => {
          setAnimState("idle");
        });
      }, SLIDE_MS);
    },
    [currentQuestionIndex, quizData.length]
  );

  const animateJumpTo = useCallback(
    (target) => {
      if (target === currentQuestionIndex) return;
      const dir = target > currentQuestionIndex ? 1 : -1;

      setAnimDir(dir > 0 ? "left" : "right");
      setAnimState("leaving");

      setTimeout(() => {
        setCurrentQuestionIndex(target);
        setAnimDir(dir > 0 ? "right" : "left");
        setAnimState("entering");
        requestAnimationFrame(() => setAnimState("idle"));
      }, SLIDE_MS);
    },
    [currentQuestionIndex]
  );

  // auto-scroll current into view on small screens
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return; // desktop doesn't need it
    const el = pillRefs.current[currentQuestionIndex];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentQuestionIndex]);

  // Restore persisted state on mount/topic change
  useEffect(() => {
    const persisted = loadState(userId, topicId);
    if (persisted) {
      setSelectedAnswers(persisted.selectedAnswers || {});
      setCurrentQuestionIndex(persisted.currentQuestionIndex || 0);
      setShowAllQuestions(!!persisted.showAllQuestions);
      setFlagged(new Set(persisted.flagged || []));
    } else {
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setShowAllQuestions(false);
      setFlagged(new Set());
    }
  }, [userId, topicId]);

  // Persist on changes (debounced-ish via effect batching)
  useEffect(() => {
    const id = setTimeout(() => {
      saveState(userId, topicId, {
        selectedAnswers,
        currentQuestionIndex,
        showAllQuestions,
        flagged: [...flagged],
      });
    }, 250);
    return () => clearTimeout(id);
  }, [
    userId,
    topicId,
    selectedAnswers,
    currentQuestionIndex,
    showAllQuestions,
    flagged,
  ]);

  // Fetch questions + bookmarks with abort safety
  const fetchUnattemptedQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (fetchAbortRef.current) fetchAbortRef.current.abort();
    const controller = new AbortController();
    fetchAbortRef.current = controller;

    try {
      const endpoint = showAllQuestions
        ? `${BASE_URL}/quiz/getRandomQuiz`
        : `${BASE_URL}/quiz/getQuiz`;

      const response = await axios.get(endpoint, {
        params: { userId, topicName, topicId },
        headers: { Authorization: `Bearer ${TOKEN()}` },
        signal: controller.signal,
      });

      setQuizData(response.data || []);
      // Reset derived state if fresh load has fewer questions than current index
      setCurrentQuestionIndex((idx) =>
        response.data && idx >= response.data.length ? 0 : idx
      );
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error("Failed to fetch questions:", err);
      setError(
        err?.response?.status === 401 || err?.response?.status === 403
          ? "Session expired. Please sign in again."
          : "Failed to fetch questions"
      );
    } finally {
      setLoading(false);
    }
  }, [userId, topicName, topicId, showAllQuestions]);

  const fetchBookmarks = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/quiz/fetchAllBookmarks`, {
        params: { userId, topicId },
        headers: { Authorization: `Bearer ${TOKEN()}` },
      });
      const topicBookmark = response.data?.bookmarks?.find(
        (bookmark) => bookmark.topic?._id === topicId
      );
      if (topicBookmark) {
        setBookmarkedQuestions(
          topicBookmark.questions.map((q) => String(q._id))
        );
      } else {
        setBookmarkedQuestions([]);
      }
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
      // soft-fail (don’t surface to user aggressively)
    }
  }, [userId, topicId]);

  useEffect(() => {
    if (!userId) return;
    fetchUnattemptedQuestions();
    fetchBookmarks();
    // cleanup on unmount
    return () => {
      if (fetchAbortRef.current) fetchAbortRef.current.abort();
    };
  }, [
    userId,
    topicName,
    topicId,
    showAllQuestions,
    fetchUnattemptedQuestions,
    fetchBookmarks,
  ]);

  // Derived
  const currentQuestion = useMemo(
    () => quizData[currentQuestionIndex],
    [quizData, currentQuestionIndex]
  );

  // Handlers
  const handleOptionClick = useCallback(
    (option) => {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: option,
      }));
    },
    [currentQuestionIndex]
  );

  const clearSelection = useCallback(() => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestionIndex];
      return next;
    });
  }, [currentQuestionIndex]);

  const handleNavigation = useCallback(
    (directionOrIndex) => {
      if (
        typeof directionOrIndex === "number" &&
        Number.isInteger(directionOrIndex)
      ) {
        if (directionOrIndex === 1) {
          setCurrentQuestionIndex((i) => Math.min(i + 1, quizData.length - 1));
        } else if (directionOrIndex === -1) {
          setCurrentQuestionIndex((i) => Math.max(i - 1, 0));
        } else {
          // direct set if passed an absolute index
          setCurrentQuestionIndex(() =>
            Math.max(0, Math.min(directionOrIndex, quizData.length - 1))
          );
        }
      }
    },
    [quizData.length]
  );

  const toggleFlag = useCallback(() => {
    setFlagged((prev) => {
      const next = new Set(prev);
      const id = String(currentQuestion?._id || "");
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, [currentQuestion]);

  const handleBookmark = useCallback(async () => {
    if (!currentQuestion) return;
    const qId = String(currentQuestion._id);
    const thisReq = ++bookmarkReqId.current;

    // Optimistic toggle
    const already = bookmarkedQuestions.includes(qId);
    const prevState = bookmarkedQuestions;
    const nextState = already
      ? bookmarkedQuestions.filter((id) => id !== qId)
      : [...bookmarkedQuestions, qId];
    setBookmarkedQuestions(nextState);
    setLoadingBM(true);

    try {
      if (!already) {
        await axios.post(
          `${BASE_URL}/quiz/addBookmark`,
          { userId, topicName, questionId: qId },
          { headers: { Authorization: `Bearer ${TOKEN()}` } }
        );
      } else {
        await axios.delete(`${BASE_URL}/quiz/removeBookmark`, {
          // data: { userId, topicName, questionId: qId },
          data: { userId, topicId, questionId: qId },
          headers: { Authorization: `Bearer ${TOKEN()}` },
        });
      }
    } catch (err) {
      // rollback if this is the latest request
      if (thisReq === bookmarkReqId.current) {
        console.error("Failed to update bookmark:", err);
        setBookmarkedQuestions(prevState);
        setError("Failed to update bookmark");
      }
    } finally {
      if (thisReq === bookmarkReqId.current) setLoadingBM(false);
    }
  }, [bookmarkedQuestions, currentQuestion, topicName, userId]);

  const handleSubmit = useCallback(async () => {
    // if (submittedOnce.current) return; // double-submit guard
    setIsSubmitting(true);
    setError(null);
    try {
      await axios.post(
        `${BASE_URL}/quiz/submitQuiz`,
        {
          userId,
          topicName,
          attemptedQuestions: quizData.map((q) => q._id),
        },
        { headers: { Authorization: `Bearer ${TOKEN()}` } }
      );
      submittedOnce.current = true;

      // Compute score once
      const score = quizData.reduce((acc, q, idx) => {
        return acc + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0);
      }, 0);
      setFinalScore(score);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      setError("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  }, [quizData, selectedAnswers, topicName, userId]);

  const resetAndRefetch = useCallback(() => {
    // soft reset, no full reload
    setIsSubmitted(false);
    setFinalScore(null);
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentQuestionIndex(0);
    setFlagged(new Set());
    saveState(userId, topicId, {
      selectedAnswers: {},
      currentQuestionIndex: 0,
      showAllQuestions,
      flagged: [],
    });
    fetchUnattemptedQuestions();
  }, [fetchUnattemptedQuestions, showAllQuestions, topicId, userId]);

  // Keyboard shortcuts: arrows, 1-4, b=bookmark, f=flag, e=explanation toggle
  useEffect(() => {
    const onKey = (e) => {
      if (isSubmitted) return;
      if (e.key === "ArrowRight") {
        handleNavigation(1);
      } else if (e.key === "ArrowLeft") {
        handleNavigation(-1);
      } else if (["1", "2", "3", "4"].includes(e.key)) {
        const idx = Number(e.key) - 1;
        const opt = currentQuestion?.options?.[idx];
        if (opt) handleOptionClick(opt);
      } else if (e.key.toLowerCase() === "b") {
        handleBookmark();
      } else if (e.key.toLowerCase() === "f") {
        toggleFlag();
      } else if (e.key.toLowerCase() === "e") {
        setShowExplanation((prev) => ({
          ...prev,
          [currentQuestionIndex]: !prev[currentQuestionIndex],
        }));
      } else if (e.key.toLowerCase() === "c") {
        // 'c' to clear selection
        clearSelection();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    isSubmitted,
    handleNavigation,
    currentQuestion,
    handleOptionClick,
    handleBookmark,
    toggleFlag,
    currentQuestionIndex,
    clearSelection,
  ]);

  useEffect(() => {
    // When Random toggle changes, treat it as a fresh attempt
    setSelectedAnswers({});
    setShowExplanation({});
    setFlagged(new Set());
    setCurrentQuestionIndex(0);

    // persist the clean slate
    saveState(userId, topicId, {
      selectedAnswers: {},
      currentQuestionIndex: 0,
      showAllQuestions,
      flagged: [],
    });
  }, [showAllQuestions, userId, topicId]);

  // Results filters
  const filteredResultsIndexes = !isSubmitted
    ? []
    : filterView === "all"
    ? quizData.map((_, i) => i)
    : filterView === "wrong"
    ? quizData.reduce((acc, q, i) => {
        if (selectedAnswers[i] !== q.correctAnswer) acc.push(i);
        return acc;
      }, [])
    : /* flagged */
      quizData.reduce((acc, q, i) => {
        if (flagged.has(String(q._id))) acc.push(i);
        return acc;
      }, []);

  // ---- Render states
  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Random toggle shell visible even during loading */}
        <div className="flex justify-end mb-4 mr-4">
          <label className="inline-flex items-center">
            <span className="mr-4 text-sm md:text-lg">Random Questions</span>
            <input
              type="checkbox"
              checked={showAllQuestions}
              onChange={() => {
                setCurrentQuestionIndex(0);
                setShowAllQuestions((prev) => !prev);
              }}
              className="hidden mr-2"
              aria-label="Toggle random questions"
            />
            <span
              className={`w-8 h-4 flex items-center flex-shrink-0 p-0 rounded-full duration-300 ease-in-out ${
                showAllQuestions ? "bg-blue-400" : "bg-gray-600"
              }`}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-400 ease-in-out ${
                  showAllQuestions ? "translate-x-4" : ""
                }`}
              />
            </span>
          </label>
        </div>
        <SKELETON />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-red-700 font-semibold">{error}</div>
        <button
          onClick={fetchUnattemptedQuestions}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!quizData || quizData.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="flex justify-end mb-4 mr-4">
          <label className="inline-flex items-center">
            <span className="mr-4 text-sm md:text-lg">Random Questions</span>
            <input
              type="checkbox"
              checked={showAllQuestions}
              onChange={() => {
                setCurrentQuestionIndex(0);
                setShowAllQuestions((prev) => !prev);
              }}
              className="hidden mr-2"
              aria-label="Toggle random questions"
            />
            <span
              className={`w-8 h-4 flex items-center flex-shrink-0 p-0 rounded-full duration-300 ease-in-out ${
                showAllQuestions ? "bg-blue-400" : "bg-gray-600"
              }`}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-400 ease-in-out ${
                  showAllQuestions ? "translate-x-4" : ""
                }`}
              />
            </span>
          </label>
        </div>
        <div>No questions available for this topic.</div>
      </div>
    );
  }

  // Helpers
  const qIdStr = String(currentQuestion?._id || "");
  const isBookmarked = bookmarkedQuestions.includes(qIdStr);
  const isFlagged = flagged.has(qIdStr);
  const userAnswer = selectedAnswers[currentQuestionIndex];

  // Question palette with states
  // const renderPalette = () => (
  //   <div className="flex flex-wrap gap-2 mb-4">
  //     {quizData.map((q, idx) => {
  //       const id = String(q._id);
  //       const answered =
  //         selectedAnswers[idx] !== undefined && selectedAnswers[idx] !== null;
  //       const bookmarked = bookmarkedQuestions.includes(id);
  //       const flg = flagged.has(id);
  //       const isCurrent = idx === currentQuestionIndex;

  //       const base =
  //         "w-8 h-8 flex items-center justify-center rounded-full border text-xs font-semibold cursor-pointer";
  //       const bg = isCurrent
  //         ? "bg-blue-600 text-white border-blue-600"
  //         : answered
  //         ? "bg-emerald-100 text-emerald-800 border-emerald-300"
  //         : "bg-gray-100 text-gray-800 border-gray-300";
  //       const ring = bookmarked
  //         ? "ring-2 ring-yellow-400"
  //         : flg
  //         ? "ring-2 ring-pink-400"
  //         : "";

  //       return (
  //         <button
  //           key={id}
  //           onClick={() => handleNavigation(idx)}
  //           className={`${base} ${bg} ${ring}`}
  //           aria-label={`Jump to question ${idx + 1}`}
  //         >
  //           {idx + 1}
  //         </button>
  //       );
  //     })}
  //   </div>
  // );

  return (
    <div className="min-h-screen">
      {/* Random toggle */}
      <div className="flex justify-end mb-4 mr-4">
        <label className="inline-flex items-center">
          <span className="mr-4 text-sm md:text-lg">Random Questions</span>
          <input
            type="checkbox"
            checked={showAllQuestions}
            onChange={() => {
              setCurrentQuestionIndex(0);
              setShowAllQuestions((prev) => !prev);
            }}
            className="hidden mr-2"
            aria-label="Toggle random questions"
          />
          <span
            className={`w-8 h-4 flex items-center flex-shrink-0 p-0 rounded-full duration-300 ease-in-out ${
              showAllQuestions ? "bg-blue-400" : "bg-gray-600"
            }`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-400 ease-in-out ${
                showAllQuestions ? "translate-x-4" : ""
              }`}
            />
          </span>
        </label>
      </div>

      {!isSubmitted ? (
        <>
          {/* Palette */}
          {/* {renderPalette()} */}

          {/* Question Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div
              className={`mb-4
    transition-all duration-200 ease-out
    ${animState === "idle" ? "opacity-100 translate-x-0" : ""}
    ${
      animState === "leaving" && animDir === "left"
        ? "-translate-x-6 opacity-0"
        : ""
    }
    ${
      animState === "leaving" && animDir === "right"
        ? "translate-x-6 opacity-0"
        : ""
    }
    ${
      animState === "entering" && animDir === "left"
        ? "translate-x-6 opacity-0"
        : ""
    }
    ${
      animState === "entering" && animDir === "right"
        ? "-translate-x-6 opacity-0"
        : ""
    }
  `}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <h2 className="text-sm font-bold mb-2">{`Question ${
                currentQuestionIndex + 1
              }`}</h2>

              <p
                className="text-gray-800 mb-4 font-semibold text-sm md:text-lg"
                style={{ whiteSpace: "pre-line" }}
              >
                {currentQuestion.questionText}
              </p>

              {/* Options as ARIA radiogroup */}
              <div role="radiogroup" aria-label="Options" className="space-y-2">
                {currentQuestion.options.map((option, idx) => {
                  const selected = userAnswer === option;
                  return (
                    <button
                      key={idx}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => handleOptionClick(option)}
                      className={`block w-full text-left p-2 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        selected
                          ? "bg-customCyan text-white border-customCyan"
                          : "bg-white text-black"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}

                {/* ✅ Clear Selection */}
                <div className="pt-1">
                  <button
                    onClick={clearSelection}
                    disabled={userAnswer === undefined}
                    className="text-xs underline text-gray-600 disabled:text-gray-300"
                    aria-label="Clear selected option"
                  >
                    Clear selection
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop controls */}
            {/* Controls row (now universal, below options) */}
            <div className="mt-4 flex justify-between items-center text-sm md:text-lg">
              <button
                onClick={() => animateNavigate(-1)}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                aria-label="Previous question"
              >
                Previous
              </button>

              <div className="flex  gap-2 lg:gap-12 items-stretch">
                <button
                  onClick={toggleFlag}
                  className={`px-4 py-2 rounded ${
                    isFlagged ? "bg-pink-100" : "bg-gray-300"
                  }`}
                  aria-pressed={isFlagged}
                  aria-label="Toggle flag"
                >
                  {isFlagged ? "🚩" : "🏴"}
                </button>

                <button
                  onClick={handleBookmark}
                  className={`px-4 py-2 rounded text-xl ${
                    isBookmarked ? "bg-yellow-400" : "bg-gray-300"
                  }`}
                  aria-pressed={isBookmarked}
                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {!loadingBM ? (
                    isBookmarked ? (
                      <MdOutlineBookmarkRemove />
                    ) : (
                      <MdOutlineBookmarkAdded />
                    )
                  ) : (
                    <TailSpin color="#fff" height={20} width={20} />
                  )}
                </button>
              </div>

              <button
                onClick={() => animateNavigate(1)}
                disabled={currentQuestionIndex === quizData.length - 1}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                aria-label="Next question"
              >
                Next
              </button>
            </div>

            {/* Collapsible Question Map (below options & controls) */}
            {/* One-row Question Row: horizontally scrollable on mobile */}
            {/* Question Pills — centered on desktop, scrollable on mobile */}
            <div className="mt-4 -mx-2 px-2">
              <div className="relative">
                {/* soft highlight strip on desktop for depth */}
                <div
                  className="hidden md:block absolute inset-0 rounded pointer-events-none"
                  aria-hidden="true"
                />

                <div
                  className="overflow-x-auto md:overflow-x-visible"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <div
                    className="flex flex-nowrap md:flex-wrap gap-4 my-2 py-2 min-w-max md:min-w-0
                      justify-start md:justify-center snap-x snap-mandatory mx-2"
                  >
                    {quizData.map((q, idx) => {
                      const id = String(q._id);
                      const answered =
                        selectedAnswers[idx] !== undefined &&
                        selectedAnswers[idx] !== null;
                      const bookmarked = bookmarkedQuestions.includes(id);
                      const flg = flagged.has(id);
                      const isCurrent = idx === currentQuestionIndex;

                      const base =
                        "w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border " +
                        "text-xs md:text-sm font-semibold shrink-0 snap-start transition-all duration-150 " +
                        "focus:outline-none focus:ring-2 focus:ring-blue-400";
                      const bg = isCurrent
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                        : answered
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-white text-gray-800 border-gray-300";
                      const ring = bookmarked
                        ? "ring-2 ring-yellow-400"
                        : flg
                        ? "ring-2 ring-pink-400"
                        : "";
                      const hover = isCurrent
                        ? ""
                        : "hover:-translate-y-0.5 hover:shadow";

                      return (
                        <button
                          key={id}
                          ref={(el) => (pillRefs.current[idx] = el)}
                          onClick={() => animateJumpTo(idx)}
                          className={`${base} ${bg} ${ring} ${hover}`}
                          aria-label={`Jump to question ${idx + 1}`}
                          title={`Q${idx + 1}${answered ? " • Answered" : ""}${
                            bookmarked ? " • Bookmarked" : ""
                          }${flg ? " • Flagged" : ""}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* tiny progress bar for polish */}
                <div className="mt-2 h-1 bg-gray-200 rounded">
                  <div
                    className="h-1 bg-blue-500 rounded transition-all"
                    style={{
                      width: `${Math.round(
                        (Object.keys(selectedAnswers).length /
                          Math.max(quizData.length, 1)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Answer & Explanation */}
            <div>
              <button
                onClick={() =>
                  setShowExplanation((prev) => ({
                    ...prev,
                    [currentQuestionIndex]: !prev[currentQuestionIndex],
                  }))
                }
                className="my-6 px-4 py-2 bg-yellow-300 text-black rounded mx-auto flex items-center min-w-24 text-sm md:text-base"
                aria-pressed={!!showExplanation[currentQuestionIndex]}
                aria-label="Toggle explanation"
              >
                {showExplanation[currentQuestionIndex]
                  ? "Hide Answer"
                  : "Show Answer"}
                {showExplanation[currentQuestionIndex] ? (
                  <FaChevronUp className="ml-2" />
                ) : (
                  <FaChevronDown className="ml-2" />
                )}
              </button>

              {showExplanation[currentQuestionIndex] && (
                <div className="mt-4 text-gray-700 text-sm md:text-base space-y-3">
                  <div className="flex items-center gap-2 bg-green-50 border-l-4 border-green-500 rounded-md px-3 py-2 shadow-sm">
                    <span className="font-semibold text-green-800">
                      Answer: <br />
                      <span className="text-green-700 font-bold px-1 py-1 rounded-md shadow-sm">
                        {currentQuestion.correctAnswer}
                      </span>
                    </span>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-400 rounded-md px-3 py-2 shadow-sm">
                    <strong className="text-blue-700">Explanation:</strong>
                    <p className="mt-1 whitespace-pre-line leading-relaxed text-gray-700">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            {currentQuestionIndex === quizData.length - 1 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="px-12 py-2 bg-gradient-to-b from-emerald-600 to-emerald-800 text-white rounded items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <TailSpin color="#fff" height={20} width={20} />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            )}

            {/* Inline feedback */}
            <div className="mt-2">
              <QuestionFeedback questionId={currentQuestion._id} />
            </div>
          </div>
        </>
      ) : (
        // ---------------- Results View ----------------
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Quiz Results</h2>

          <p
            className={`text-base font-bold my-4 py-2 px-4 text-center rounded-full shadow-sm ${
              finalScore >= quizData.length * 0.7
                ? "bg-green-100 text-green-700"
                : finalScore >= quizData.length * 0.4
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            🎯 Your Score: {finalScore} / {quizData.length}
          </p>

          {/* Results filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: "all", label: "All" },
              { key: "wrong", label: "Wrong" },
              { key: "flagged", label: "Flagged" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterView(f.key)}
                className={`text-sm px-3 py-1 rounded border ${
                  filterView === f.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredResultsIndexes.map((index) => {
            const question = quizData[index];
            const userAns = selectedAnswers[index];
            const correct = userAns === question.correctAnswer;

            return (
              <div
                key={String(question._id)}
                className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-300"
              >
                <p className="font-semibold text-gray-700">{`Question ${
                  index + 1
                }: ${question.questionText}`}</p>

                <p
                  className={`my-2 ${
                    correct ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {correct ? "✅" : "❌"} Your Answer:{" "}
                  {userAns || "Not Attempted"}
                </p>

                {!correct && (
                  <p className="text-green-800 font-semibold">{`Correct Answer: ${question.correctAnswer}`}</p>
                )}

                <button
                  onClick={() =>
                    setShowExplanation((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }))
                  }
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white rounded flex items-center"
                >
                  {showExplanation[index]
                    ? "Hide Explanation"
                    : "Show Explanation"}
                  {showExplanation[index] ? (
                    <FaChevronUp className="ml-2" />
                  ) : (
                    <FaChevronDown className="ml-2" />
                  )}
                </button>

                {showExplanation[index] && (
                  <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md shadow-inner transition-all duration-300 ease-in-out">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      <strong className="text-blue-700">Explanation:</strong>{" "}
                      {question.explanation}
                    </p>
                  </div>
                )}

                <div className="mt-3">
                  <button
                    onClick={() => {
                      // allow re-submission after review
                      submittedOnce.current = false;
                      setIsSubmitted(false);
                      setCurrentQuestionIndex(index);
                    }}
                    className="text-sm underline text-blue-700"
                  >
                    Review this question
                  </button>
                </div>
              </div>
            );
          })}

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto">
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-indigo-600 hover:to-blue-500 transform  flex items-center gap-2"
            >
              <MdPreview className="text-xl" />
              <span>Review Again</span>
            </button>

            <button
              onClick={resetAndRefetch}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:from-rose-500 hover:to-pink-500 transform flex items-center gap-2"
            >
              <IoReload className="text-xl" />
              <span>Take Another Quiz</span>
            </button>
          </div>
        </div>
      )}

      {/* What's New (simple collapsible, no state) */}
      <details className="my-4 rounded-lg border border-blue-200 bg-blue-50 text-blue-900">
        <summary className="cursor-pointer select-none px-3 py-2 font-semibold">
          What’s new in Quiz
        </summary>
        <div className="px-3 pb-3 text-sm leading-relaxed">
          <ul className="list-disc pl-5 space-y-1">
            <li>Swipe left/right on mobile to change questions.</li>
            <li>One-row question pills for easier navigation.</li>

            <li>Clear selection button for the current question.</li>
            <li>Option to flag questions for later review and tracking.</li>
          </ul>
        </div>
      </details>
    </div>
  );
};

QuizComponent.propTypes = {
  userId: PropTypes.string.isRequired,
  topicName: PropTypes.string.isRequired,
  topicId: PropTypes.string,
};

export default QuizComponent;
