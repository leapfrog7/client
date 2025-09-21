import { useState, useEffect, useRef } from "react";
import Question from "./Question";
import Timer from "./Timer";
import axiosInstance from "../../../components/AxiosInstance";
import { getUserIdFromToken } from "../../../util/decodeJWT";
import { FaArrowLeft, FaArrowRight, FaSave, FaEye } from "react-icons/fa"; // Import icons
import {
  FaCalendarAlt,
  FaFileAlt,
  FaRedo,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // at top
import Results from "./Results";

const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [paperId, setPaperId] = useState("");
  const [answers, setAnswers] = useState({});
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [evaluatedResponses, setEvaluatedResponses] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [remainingTime, setRemainingTime] = useState(2 * 60 * 60); // Default to 2 hours in seconds
  const [papers, setPapers] = useState([]); // List of available papers with their status
  const [currentPaper, setCurrentPaper] = useState(null); // Currently selected paper
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const timeUpRef = useRef(false);

  const yearsToShow = ["2016-17", "2018", "2019-20", "2021-22", "2023", "2024"]; // Only show these years
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch available papers and their status
    const fetchPapers = async () => {
      try {
        const userId = getUserIdFromToken();
        const response = await axiosInstance.get("/available-papers", {
          params: { userId },
        });
        setPapers(response.data);
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };

    fetchPapers();
  }, []);

  const goHome = async () => {
    // optional: refresh the papers list so UI is up-to-date
    try {
      const userId = getUserIdFromToken();
      if (userId) {
        const { data } = await axiosInstance.get("/available-papers", {
          params: { userId },
        });
        setPapers(data);
      }
    } catch (e) {
      console.warn("Refresh papers failed:", e);
    }

    // hard reset exam-local state
    setIsSubmitted(false);
    setIsSubmitting(false);
    setIsStarted(false);
    setIsSaved(false);
    setIsCompleted(false);
    setCurrentPaper(null);
    setAnswers({});
    setQuestions([]); // optional but safe
    setPaperId("");
    setShowCorrectAnswer(false);
    setRemainingTime(2 * 60 * 60);
    navigate("/pages/quiz/previousYear/Exam", { replace: true });
    // If you truly want to leave this page, navigate (adjust path if needed)
    // navigate("/"); // or navigate("/dashboard");
  };

  // Filter papers to include only selected years - database can have more but show less
  const filteredPapers = papers.filter((paper) =>
    yearsToShow.includes(paper.year)
  );

  useEffect(() => {
    if (isStarted) {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isStarted]);

  useEffect(() => {
    if (!isStarted) return;
    if (remainingTime <= 0 && !timeUpRef.current) {
      timeUpRef.current = true; // ensure we only run once
      handleSaveAndSubmit();
    }
  }, [remainingTime, isStarted]);

  const handleOptionSelect = (option) => {
    setAnswers({
      ...answers,
      [currentPaper.currentQuestionIndex]: option,
    });
  };

  const handleNextQuestion = () => {
    setCurrentPaper({
      ...currentPaper,
      currentQuestionIndex: Math.min(
        currentPaper.currentQuestionIndex + 1,
        questions.length - 1
      ),
    });
  };

  const handlePreviousQuestion = () => {
    setCurrentPaper({
      ...currentPaper,
      currentQuestionIndex: Math.max(currentPaper.currentQuestionIndex - 1, 0),
    });
  };

  const handleStart = async (year, paperType, resume = false) => {
    try {
      // 1) Fetch the paper
      const { data: paper } = await axiosInstance.get(
        `/prev-year-papers/${year}/${paperType}`
      );

      // 2) Reset lightweight flags & load questions
      setIsStarted(false); // stop any running timer
      setIsSaved(false); // clear save toast
      setShowCorrectAnswer(false); // hide answer reveal
      setQuestions(paper.questions);
      setPaperId(paper._id);

      if (resume) {
        // 3) RESUME: fetch saved session and rebuild answers map
        const userId = getUserIdFromToken();
        const { data: session } = await axiosInstance.get(
          `/exam-sessions/${userId}/${paper._id}`
        );

        const savedRemainingTime = Math.max(
          Number(session.remainingTime || 0),
          0
        );

        const restoredAnswers = (session.responses || []).reduce(
          (acc, { questionId, userAnswer }) => {
            const idx = paper.questions.findIndex((q) => q._id === questionId);
            if (idx >= 0) acc[idx] = userAnswer;
            return acc;
          },
          {}
        );

        setRemainingTime(savedRemainingTime);
        setAnswers(restoredAnswers);

        setCurrentPaper({
          year: paper.year,
          paperType: paper.paperType,
          currentQuestionIndex: 0,
          remainingTime: savedRemainingTime,
        });

        setIsStarted(true);
      } else {
        // 4) NEW SESSION: clear per-paper selections so grids don’t carry over
        setAnswers({});
        const freshDuration = 2 * 60 * 60; // 2 hours (seconds)
        setRemainingTime(freshDuration);

        setCurrentPaper({
          year: paper.year,
          paperType: paper.paperType,
          currentQuestionIndex: 0,
          remainingTime: freshDuration,
        });

        setIsStarted(true);
      }
    } catch (error) {
      console.error("Error fetching questions or resuming session:", error);
    }
  };

  const handleSave = async () => {
    // Show toast, pause the exam view
    setIsSaved(true);
    setIsStarted(false);

    const userId = getUserIdFromToken();
    if (!userId || !paperId) {
      console.error("User ID or Paper ID is missing");
      setTimeout(() => setIsSaved(false), 1200);
      return;
    }

    try {
      // Build responses safely (skip any undefined question indices)
      const responses = Object.entries(answers).flatMap(([idx, userAnswer]) => {
        const q = questions[Number(idx)];
        return q
          ? [
              {
                questionId: q._id,
                userAnswer,
                isCorrect: q.correctAnswer === userAnswer,
              },
            ]
          : [];
      });

      // UPSC-style scoring: +1.25 correct, −1/3 incorrect, 0 for unanswered
      const score = responses.reduce(
        (s, r) => s + (r.isCorrect ? 1.25 : -1 / 3),
        0
      );

      await axiosInstance.post("/exam-sessions", {
        userId,
        paperId,
        startTime: new Date(),
        remainingTime: Math.max(remainingTime, 0),
        responses,
        score,
      });

      // Optimistic update so the row shows "Resume" immediately
      setPapers((prev) =>
        prev.map((p) => (p._id === paperId ? { ...p, session: true } : p))
      );

      // Soft refresh the papers list from server (keeps SPA feel, no full reload)
      try {
        const refreshed = await axiosInstance.get("/available-papers", {
          params: { userId },
        });
        setPapers(refreshed.data);
      } catch (e) {
        // Non-fatal; optimistic state is already applied
        console.warn("Soft refresh of papers failed:", e);
      }

      // Close the exam view and return to the table (no page reload)
      setCurrentPaper(null);

      console.log("Session saved");
    } catch (error) {
      console.error("Error saving exam session:", error);
    } finally {
      // Hide the toast after a moment
      setTimeout(() => setIsSaved(false), 1200);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      setIsStarted(false); // ⬅️ stop countdown immediately
      const userId = getUserIdFromToken();

      const responses = Object.entries(answers).flatMap(([i, userAnswer]) => {
        const q = questions[Number(i)];
        return q ? [{ questionId: q._id, userAnswer }] : [];
      });

      const response = await axiosInstance.post("/submitQuiz", {
        userId,
        paperId,
        responses,
      });

      const { score, evaluatedResponses } = response.data;

      // Update state with the received score and evaluated responses
      setScore(score);
      setEvaluatedResponses(evaluatedResponses);
      setIsSubmitted(true); // Indicate that the quiz has been submitted

      // Update the papers state to reflect the quiz is completed
      setPapers((prevPapers) =>
        prevPapers.map((paper) =>
          paper._id === paperId ? { ...paper, session: "completed" } : paper
        )
      );
      setIsCompleted(true); // Mark the quiz as completed
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleSaveAndSubmit = async () => {
    try {
      setIsSubmitting(true); // Indicate that the submission process has started
      await handleSave(); // Save the session
      await handleSubmitQuiz(); // Submit the quiz
    } catch (error) {
      console.error("Error during save and submit:", error);
    } finally {
      setIsSubmitting(false); // Indicate that the submission process is complete
    }
  };

  const handleQuestionSelect = (index) => {
    setCurrentPaper({
      ...currentPaper,
      currentQuestionIndex: index,
    });
  };

  const resetTimer = async (paperId) => {
    try {
      const userId = getUserIdFromToken();
      await axiosInstance.post(
        `/exam-sessions/${userId}/${paperId}/reset-timer`
      );

      // Reset the paper's session status to start a new quiz
      setPapers((prevPapers) =>
        prevPapers.map((paper) =>
          paper._id === paperId
            ? { ...paper, session: null, remainingTime: 2 * 60 * 60 }
            : paper
        )
      );

      console.log("Timer reset successfully");
    } catch (error) {
      console.error("Error resetting timer:", error);
    }
  };

  const renderActions = (paper) => {
    const isPaperCompleted = paper.remainingTime === 0;
    console.log(isCompleted);
    if (isPaperCompleted) {
      return (
        <div>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            disabled
          >
            Completed
          </button>
        </div>
      );
    } else if (paper.session) {
      return (
        <div>
          <button
            className="px-4 py-2 bg-pink-500 text-white rounded"
            onClick={() => handleStart(paper.year, paper.paperType, true)}
          >
            Resume Quiz
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => handleStart(paper.year, paper.paperType)}
          >
            Start Quiz
          </button>
        </div>
      );
    }
  };

  return (
    <div className="p-4 md:p-8 ">
      {isSubmitting ? (
        <div className="text-center">
          <p className="text-xl font-semibold">Submitting your quiz...</p>
          <div className="mt-4">
            <svg
              className="animate-spin h-10 w-10 text-blue-500 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              ></path>
            </svg>
          </div>
        </div>
      ) : (
        <>
          {!isStarted && !isSubmitted && (
            <div className="overflow-x-auto">
              <div className="mb-4">
                <p className="text-lg font-semibold text-center text-gray-700 bg-gradient-to-r from-blue-100 to-indigo-100 p-2 rounded-lg shadow-md mb-4">
                  The Previous Year Question Papers
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-white text-gray-800 p-6 rounded-lg shadow-lg space-y-2">
                  <p className="text-sm md:text-base font-medium">
                    Experience real exam conditions with the previous year
                    papers to benchmark your current preparation.
                  </p>
                  <p className="text-xs md:text-sm italic">
                    Answers are aligned with the official UPSC answer key.
                  </p>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base mt-8">
                <thead>
                  <tr className="font-bold text-center">
                    <th className="px-2 md:px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-2 md:px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Paper Type
                    </th>
                    <th className="px-2 md:px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Start/ Resume
                    </th>
                    <th className="px-2 md:px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Time Left
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 ">
                  {filteredPapers.map((paper) => (
                    <tr key={`${paper.year}-${paper.paperType}`}>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-xs md:text-base text-gray-500 text-center">
                        {paper.year}
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-xs md:text-base text-gray-500 text-center">
                        {paper.paperType}
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-xs md:text-base font-medium text-center">
                        {renderActions(paper)}
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-xs md:text-base text-gray-500 flex flex-col text-center">
                        {paper.remainingTime !== null &&
                        paper.remainingTime !== undefined
                          ? `${Math.floor(
                              paper.remainingTime / 3600
                            )}h ${Math.floor(
                              (paper.remainingTime % 3600) / 60
                            )}m`
                          : "N/A"}
                        <button
                          className="mt-2 px-3 py-1 text-center text-pink-600 rounded text-sm mx-auto"
                          onClick={() => resetTimer(paper._id)}
                        >
                          <FaRedo />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Important Points to Remember */}
              <div className="bg-gray-100 mt-16 p-4 rounded-md shadow-sm text-sm text-gray-800">
                <p className="text-lg font-semibold text-blue-800 mb-2">
                  Important Points:
                </p>

                <ul className="list-disc list-inside space-y-2">
                  <li>More questions on previous year exams to follow soon.</li>
                  <li>
                    You will have 120 minutes to finish the exam after starting.
                  </li>
                  <li>You can save your progress and resume later.</li>
                  <li>
                    The exam will auto-submit once the 120-minute timer runs
                    out. You can also click the submit button before the timer
                    expires.
                  </li>
                  <li>
                    Your score will be calculated based on UPSC&apos;s current
                    marking criteria, including negative marking.
                  </li>
                  <li>
                    If you want to retake the exam afresh, click the reset
                    button. There is no limit to how many times you can take
                    this exam.
                  </li>
                  <li>
                    For the best experience, we recommend using a desktop to
                    attempt this module.
                  </li>
                  <li className="text-xs md:text-sm">
                    <span className="font-semibold">Please note:</span> On
                    mobile devices, the timer display may not update in real
                    time, but the actual timing is accurately tracked in the
                    background. When you save and exit, the system will store
                    the correct time elapsed.
                  </li>
                </ul>
              </div>
            </div>
          )}
          {isStarted && !isSubmitted && currentPaper && (
            <div
              key={paperId || `${currentPaper.year}-${currentPaper.paperType}`}
            >
              <div className="flex justify-between items-center">
                <div className="text-base md:text-lg font-semibold flex items-center justify-around bg-gradient-to-r from-customBlue to-indigo-900 text-white p-4 rounded-lg shadow-lg mx-auto w-full">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <span>{currentPaper.year}</span>
                  </div>
                  <span className="mx-4">|</span>
                  <div className="flex items-center">
                    <FaFileAlt className="mr-2" />
                    <span>{currentPaper.paperType}</span>
                  </div>
                  <span className="mx-4 text-white ">|</span>
                  <div>
                    <Timer
                      duration={remainingTime}
                      onTimeUp={handleSaveAndSubmit}
                    />
                  </div>
                </div>
              </div>
              <div className="2xl:flex gap-6">
                {/* Quiz side */}
                <div className="w-11/12 2xl:w-2/3 mx-auto">
                  <div className="mt-8 whitespace-pre-line w-full mx-auto">
                    <Question
                      question={
                        questions[currentPaper.currentQuestionIndex]
                          .questionText
                      }
                      options={
                        questions[currentPaper.currentQuestionIndex].options
                      }
                      onSelectOption={handleOptionSelect}
                      selectedOption={
                        answers[currentPaper.currentQuestionIndex]
                      } // Pass selected option
                    />
                    {showCorrectAnswer && (
                      <p className="text-green-600 mt-2">
                        Correct Answer:{" "}
                        {
                          questions[currentPaper.currentQuestionIndex]
                            .correctAnswer
                        }
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col gap-2 ">
                    <div className="flex justify-between lg:w-2/3 lg:mx-auto lg:justify-around my-4 ">
                      <button
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                        onClick={handlePreviousQuestion}
                        disabled={currentPaper.currentQuestionIndex === 0}
                      >
                        <FaArrowLeft className="mr-2" />
                        Previous
                      </button>
                      <button
                        className="flex-1 flex items-center justify-center ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        onClick={handleNextQuestion}
                        disabled={
                          currentPaper.currentQuestionIndex ===
                          questions.length - 1
                        }
                      >
                        Next
                        <FaArrowRight className="ml-2" />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 lg:gap-4 lg:flex-row lg:justify-around lg:w-2/3 lg:mx-auto  p-4 shadow-xl rounded-lg ring-2 ring-gray-100">
                      <div className="text-sm md:text-base flex gap-6 lg:gap-4 flex-row lg:justify-between lg:w-2/3 mx-auto">
                        <button
                          className="flex items-center justify-center px-4 py-2 lg:py-6 bg-yellow-400 text-gray-700  rounded-lg hover:bg-yellow-500 lg:flex-1"
                          onClick={() =>
                            setShowCorrectAnswer(!showCorrectAnswer)
                          }
                        >
                          <FaEye className="mr-2" />
                          {showCorrectAnswer ? "Hide Answer" : "Show Answer"}
                        </button>

                        <button
                          className="flex items-center justify-center px-4 py-2 lg:py-6 bg-emerald-600 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 lg:flex-1 lg:mt-0"
                          onClick={handleSave}
                        >
                          <FaSave className="mr-2" />
                          Save and Exit
                        </button>
                      </div>

                      <button
                        className="flex items-center justify-center px-4 py-2 lg:py-6 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200 lg:flex-1 mt-6 lg:mt-0"
                        onClick={handleSubmitQuiz}
                      >
                        <FaCheckCircle className="mr-2" />
                        Submit Quiz
                      </button>
                    </div>
                  </div>
                </div>
                <hr className="hidden 2xl:visible"></hr>

                {/* Grid Side */}
                <div className="w-11/12 2xl:w-1/3 mx-auto 2xl:border-l 2xl:border-gray-300 2xl:pl-6">
                  <p className="mt-8 text-base font-bold text-center text-white bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg shadow-md">
                    Question Grid
                  </p>
                  <div className="mt-4 text-center">
                    <p className="text-sm md:text-base font-semibold">
                      Questions Attempted: {Object.keys(answers).length} /{" "}
                      {questions.length}{" "}
                    </p>
                  </div>

                  <div className="mt-4 max-h-96 overflow-y-auto border-t pt-4 text-xs md:text-sm">
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 2xl:grid-cols-8 gap-2 lg:gap-4">
                      {questions.map((_, index) => (
                        <button
                          key={index}
                          className={`p-1 md:p-2 border rounded ${
                            answers[index]
                              ? "bg-yellow-400 text-yellow-800" // Color for attempted questions
                              : index === currentPaper.currentQuestionIndex
                              ? "bg-blue-200"
                              : "bg-white"
                          } hover:bg-blue-50`}
                          onClick={() => handleQuestionSelect(index)}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isSubmitted && (
            <Results
              questions={questions}
              evaluatedResponses={evaluatedResponses}
              score={score}
              remainingTime={remainingTime}
              onGoHome={goHome}
              onRetake={() => resetTimer(paperId)}
            />
          )}

          {isSaved && (
            <div
              className={`fixed top-0 left-1/2 transform -translate-x-1/2 bg-emerald-700 text-white py-4 px-2 md:text-base rounded-lg shadow-lg z-50 transition-transform duration-500 ease-in-out w-10/12 max-w-xl ${
                isSaved
                  ? "translate-y-20 opacity-100"
                  : "-translate-y-full opacity-0"
              }`}
            >
              <p className="text-base md:text-lg text-center">
                Your session has been saved. You can resume later.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Exam;
