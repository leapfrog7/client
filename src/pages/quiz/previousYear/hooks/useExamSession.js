import { useCallback, useState } from "react";
import axiosInstance from "../../../../components/AxiosInstance";
import { getUserIdFromToken } from "../../../../util/decodeJWT";
import { EXAM_DURATION_SECONDS } from "../utils/time";
import {
  buildSavedResponses,
  buildSubmissionResponses,
  calculateUpscStyleScoreFromSavedResponses,
} from "../utils/scoring";

export default function useExamSession({ fetchPapers }) {
  const [questions, setQuestions] = useState([]);
  const [paperId, setPaperId] = useState("");
  const [answers, setAnswers] = useState({});
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [evaluatedResponses, setEvaluatedResponses] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [remainingTime, setRemainingTime] = useState(EXAM_DURATION_SECONDS);
  const [currentPaper, setCurrentPaper] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionSelect = useCallback(
    (option) => {
      setAnswers((prev) => ({
        ...prev,
        [currentPaper.currentQuestionIndex]: option,
      }));
    },
    [currentPaper],
  );

  const handleNextQuestion = useCallback(() => {
    setCurrentPaper((prev) => ({
      ...prev,
      currentQuestionIndex: Math.min(
        prev.currentQuestionIndex + 1,
        questions.length - 1,
      ),
    }));
  }, [questions.length]);

  const handlePreviousQuestion = useCallback(() => {
    setCurrentPaper((prev) => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
    }));
  }, []);

  const handleQuestionSelect = useCallback((index) => {
    setCurrentPaper((prev) => ({
      ...prev,
      currentQuestionIndex: index,
    }));
  }, []);

  const handleStart = useCallback(async (year, paperType, resume = false) => {
    try {
      const { data: paper } = await axiosInstance.get(
        `/prevYearQuiz/prev-year-papers/${year}/${paperType}`,
      );

      setIsStarted(false);
      setIsSaved(false);
      setShowCorrectAnswer(false);
      setIsSubmitted(false);
      setIsSubmitting(false);
      setQuestions(paper.questions || []);
      setPaperId(paper._id);

      if (resume) {
        const userId = getUserIdFromToken();

        const { data: session } = await axiosInstance.get(
          `/prevYearQuiz/exam-sessions/${userId}/${paper._id}`,
        );

        const savedRemainingTime = Math.max(
          Number(session.remainingTime || 0),
          0,
        );

        const restoredAnswers = (session.responses || []).reduce(
          (acc, { questionId, userAnswer }) => {
            const idx = paper.questions.findIndex(
              (q) => String(q._id) === String(questionId),
            );
            if (idx >= 0) acc[idx] = userAnswer;
            return acc;
          },
          {},
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
        setAnswers({});
        setRemainingTime(EXAM_DURATION_SECONDS);

        setCurrentPaper({
          year: paper.year,
          paperType: paper.paperType,
          currentQuestionIndex: 0,
          remainingTime: EXAM_DURATION_SECONDS,
        });

        setIsStarted(true);
      }
    } catch (error) {
      console.error("Error fetching questions or resuming session:", error);
    }
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaved(true);
    setIsStarted(false);

    const userId = getUserIdFromToken();

    if (!userId || !paperId) {
      console.error("User ID or Paper ID is missing");
      setTimeout(() => setIsSaved(false), 1200);
      return;
    }

    try {
      const responses = buildSavedResponses(answers, questions);
      const derivedScore = calculateUpscStyleScoreFromSavedResponses(responses);

      await axiosInstance.post("/prevYearQuiz/exam-sessions", {
        userId,
        paperId,
        startTime: new Date(),
        remainingTime: Math.max(remainingTime, 0),
        responses,
        score: derivedScore,
      });

      try {
        await fetchPapers?.();
      } catch (e) {
        console.warn("Soft refresh of papers failed:", e);
      }

      setCurrentPaper(null);
    } catch (error) {
      console.error("Error saving exam session:", error);
    } finally {
      setTimeout(() => setIsSaved(false), 1200);
    }
  }, [answers, questions, remainingTime, paperId, fetchPapers]);

  const handleSubmitQuiz = useCallback(async () => {
    try {
      setIsStarted(false);

      const userId = getUserIdFromToken();
      const responses = buildSubmissionResponses(answers, questions);

      const response = await axiosInstance.post("/prevYearQuiz/submitQuiz", {
        userId,
        paperId,
        responses,
      });

      const { score, evaluatedResponses } = response.data;

      setScore(score);
      setEvaluatedResponses(evaluatedResponses);
      setIsSubmitted(true);

      try {
        await fetchPapers?.();
      } catch (e) {
        console.warn("Soft refresh of papers failed after submit:", e);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  }, [answers, questions, paperId, fetchPapers]);

  const handleSaveAndSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);

      // Save first so latest in-progress state is persisted
      await handleSave();

      // Then overwrite latest submitted result
      await handleSubmitQuiz();
    } catch (error) {
      console.error("Error during save and submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [handleSave, handleSubmitQuiz]);

  const resetTimer = useCallback(
    async (paperIdToReset) => {
      try {
        const userId = getUserIdFromToken();

        await axiosInstance.post(
          `/prevYearQuiz/exam-sessions/${userId}/${paperIdToReset}/reset-timer`,
        );

        try {
          await fetchPapers?.();
        } catch (e) {
          console.warn("Soft refresh of papers failed after reset:", e);
        }

        // if user resets current active paper, clear local view too
        if (paperId === paperIdToReset) {
          setIsStarted(false);
          setCurrentPaper(null);
          setAnswers({});
          setQuestions([]);
          setPaperId("");
          setShowCorrectAnswer(false);
          setRemainingTime(EXAM_DURATION_SECONDS);
        }
      } catch (error) {
        console.error("Error resetting timer:", error);
      }
    },
    [fetchPapers, paperId],
  );

  const hardResetLocalState = useCallback(() => {
    setIsSubmitted(false);
    setIsSubmitting(false);
    setIsStarted(false);
    setIsSaved(false);
    setCurrentPaper(null);
    setAnswers({});
    setQuestions([]);
    setPaperId("");
    setShowCorrectAnswer(false);
    setRemainingTime(EXAM_DURATION_SECONDS);
    setScore(0);
    setEvaluatedResponses([]);
  }, []);

  return {
    questions,
    paperId,
    answers,
    isStarted,
    isSubmitted,
    score,
    evaluatedResponses,
    isSaved,
    remainingTime,
    setRemainingTime,
    currentPaper,
    showCorrectAnswer,
    setShowCorrectAnswer,
    isSubmitting,

    setIsSubmitted,
    setIsSubmitting,
    setIsStarted,
    setIsSaved,
    setCurrentPaper,
    setAnswers,
    setQuestions,
    setPaperId,
    setScore,
    setEvaluatedResponses,

    handleOptionSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    handleQuestionSelect,
    handleStart,
    handleSave,
    handleSubmitQuiz,
    handleSaveAndSubmit,
    resetTimer,
    hardResetLocalState,
  };
}
