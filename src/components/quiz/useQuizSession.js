import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL, TOKEN, uuid, isAxiosCanceled } from "./quizUtils";
import { loadState, saveState } from "./quizStorage";
import { currentToken, readSession } from "../../auth/session";
import { QUIZ_SUBMITTED_EVENT } from "./quizEvents";

export default function useQuizSession({ userId, topicName, topicId }) {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingBM, setLoadingBM] = useState(false);
  const [error, setError] = useState(null);
  const draftKey = "quiz-login-draft:" + userId + ":" + topicId;
  const loginDraft = useMemo(() => {try {return JSON.parse(localStorage.getItem(draftKey));} catch {return null;}}, [draftKey]);
  const recoveredDraft = useRef(loginDraft);
  const skipInitialReset = useRef(Boolean(loginDraft));
  const [showAllQuestions, setShowAllQuestions] = useState(Boolean(loginDraft?.showAllQuestions));
  const [serverResult, setServerResult] = useState(null);
  const [serverComparison, setServerComparison] = useState(null);
  const [flagged, setFlagged] = useState(new Set());
  const [finalScore, setFinalScore] = useState(null);

  const fetchAbortRef = useRef(null);
  const bookmarkReqId = useRef(0);
  const submittedOnce = useRef(false);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    const persisted = recoveredDraft.current || loadState(userId, topicId);
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

  useEffect(() => {
    function saveBeforeLogin() {
      const user = readSession(currentToken());
      // Expired JWTs no longer decode as a live session; the mounted user/topic still scope the draft.
      if (!quizData.length || isSubmitted || !userId || (user && user.userId !== userId)) return;
      try {
        localStorage.setItem(draftKey, JSON.stringify({quizData, selectedAnswers, currentQuestionIndex,
          showAllQuestions, flagged:[...flagged]}));
      } catch { /* Unavailable browser storage must not block reauthentication. */ }
    }
    window.addEventListener("auth:expiring", saveBeforeLogin);
    return () => window.removeEventListener("auth:expiring", saveBeforeLogin);
  }, [quizData, isSubmitted, userId, draftKey, selectedAnswers, currentQuestionIndex, showAllQuestions, flagged]);

  const fetchUnattemptedQuestions = useCallback(async () => {
    if (!userId || !topicId) return;

    const fetchId = ++fetchIdRef.current;
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

      if (fetchId !== fetchIdRef.current) return;

      const draft = recoveredDraft.current;
      const data = draft?.quizData?.length && draft.showAllQuestions === showAllQuestions ? draft.quizData : response.data || [];
      recoveredDraft.current = null;
      localStorage.removeItem(draftKey);
      setQuizData(data);
      setCurrentQuestionIndex((idx) => (data && idx >= data.length ? 0 : idx));
    } catch (err) {
      if (isAxiosCanceled(err) || fetchId !== fetchIdRef.current) return;

      console.error("Failed to fetch questions:", err);
      setError(
        err?.response?.status === 401
          ? "Session expired. Please sign in again."
          : err?.response?.status === 403 ? "You do not have permission to access these questions."
          : err?.response?.status === 402 ? "Your trial has ended. Activate your account to continue."
          : "Failed to fetch questions",
      );
    } finally {
      if (fetchId === fetchIdRef.current) {
        setLoading(false);
      }
    }
  }, [userId, topicName, topicId, showAllQuestions, draftKey]);

  const fetchBookmarks = useCallback(async (signal) => {
    try {
      const response = await axios.get(`${BASE_URL}/quiz/fetchAllBookmarks`, {
        signal,
        params: { userId, topicId },
        headers: { Authorization: `Bearer ${TOKEN()}` },
      });

      const topicBookmark = response.data?.bookmarks?.find(
        (bookmark) => bookmark.topic?._id === topicId,
      );

      if (topicBookmark) {
        setBookmarkedQuestions(
          topicBookmark.questions.map((q) => String(q._id)),
        );
      } else {
        setBookmarkedQuestions([]);
      }
    } catch (err) {
      if (isAxiosCanceled(err)) return;
      console.error("Failed to fetch bookmarks:", err);
    }
  }, [userId, topicId]);

  useEffect(() => {
    if (!userId || !topicId) return;

    const bookmarksController = new AbortController();
    fetchUnattemptedQuestions();
    fetchBookmarks(bookmarksController.signal);

    return () => {
      if (fetchAbortRef.current) fetchAbortRef.current.abort();
      bookmarksController.abort();
    };
  }, [
    userId,
    topicName,
    topicId,
    showAllQuestions,
    fetchUnattemptedQuestions,
    fetchBookmarks,
  ]);

  const currentQuestion = useMemo(
    () => quizData[currentQuestionIndex],
    [quizData, currentQuestionIndex],
  );

  const handleOptionClick = useCallback(
    (option) => {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: option,
      }));
    },
    [currentQuestionIndex],
  );

  const clearSelection = useCallback(() => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestionIndex];
      return next;
    });
  }, [currentQuestionIndex]);

  const goNext = useCallback(() => {
    setCurrentQuestionIndex((i) => Math.min(i + 1, quizData.length - 1));
  }, [quizData.length]);

  const goPrev = useCallback(() => {
    setCurrentQuestionIndex((i) => Math.max(i - 1, 0));
  }, []);

  const jumpToQuestion = useCallback(
    (index) => {
      setCurrentQuestionIndex(() =>
        Math.max(0, Math.min(index, quizData.length - 1)),
      );
    },
    [quizData.length],
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
          { headers: { Authorization: `Bearer ${TOKEN()}` } },
        );
      } else {
        await axios.delete(`${BASE_URL}/quiz/removeBookmark`, {
          data: { userId, topicId, questionId: qId },
          headers: { Authorization: `Bearer ${TOKEN()}` },
        });
      }
    } catch (err) {
      if (thisReq === bookmarkReqId.current) {
        console.error("Failed to update bookmark:", err);
        setBookmarkedQuestions(prevState);
        setError("Failed to update bookmark");
      }
    } finally {
      if (thisReq === bookmarkReqId.current) setLoadingBM(false);
    }
  }, [bookmarkedQuestions, currentQuestion, topicId, topicName, userId]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const responses = quizData.map((q, idx) => ({
        questionId: q._id,
        selected: selectedAnswers[idx] ?? null,
      }));

      const submissionId = uuid();

      const { data } = await axios.post(
        `${BASE_URL}/quiz/submitQuiz`,
        {
          userId,
          topicName,
          attemptedQuestions: quizData.map((q) => q._id),
          responses,
          startedAt: new Date().toISOString(),
          timeTakenSec: undefined,
          submissionId,
        },
        { headers: { Authorization: `Bearer ${TOKEN()}` } },
      );

      setServerResult(data?.result || null);
      setServerComparison(data?.comparison || null);
      setFinalScore(data?.result?.correct ?? 0);
      submittedOnce.current = true;
      setIsSubmitted(true);
      window.dispatchEvent(
        new CustomEvent(QUIZ_SUBMITTED_EVENT, { detail: { userId, topicId } }),
      );
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      setError("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  }, [quizData, selectedAnswers, topicName, userId, topicId]);

  const resetAndRefetch = useCallback(() => {
    setIsSubmitted(false);
    setFinalScore(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setFlagged(new Set());
    setServerResult(null);
    setServerComparison(null);

    saveState(userId, topicId, {
      selectedAnswers: {},
      currentQuestionIndex: 0,
      showAllQuestions,
      flagged: [],
    });

    fetchUnattemptedQuestions();
  }, [fetchUnattemptedQuestions, showAllQuestions, topicId, userId]);

  const reviewQuestion = useCallback((index) => {
    submittedOnce.current = false;
    setIsSubmitted(false);
    setCurrentQuestionIndex(index);
  }, []);

  useEffect(() => {
    if (skipInitialReset.current) {skipInitialReset.current = false; return;}
    setIsSubmitted(false);
    submittedOnce.current = false;
    setSelectedAnswers({});
    setFlagged(new Set());
    setCurrentQuestionIndex(0);
    setServerResult(null);
    setServerComparison(null);
    setFinalScore(null);

    saveState(userId, topicId, {
      selectedAnswers: {},
      currentQuestionIndex: 0,
      showAllQuestions,
      flagged: [],
    });
  }, [showAllQuestions, userId, topicId]);

  return {
    quizData,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswers,
    bookmarkedQuestions,
    isSubmitted,
    isSubmitting,
    loading,
    loadingBM,
    error,
    showAllQuestions,
    serverResult,
    serverComparison,
    flagged,
    finalScore,

    setError,
    setIsSubmitted,
    setShowAllQuestions,

    fetchUnattemptedQuestions,

    handleOptionClick,
    clearSelection,
    goNext,
    goPrev,
    jumpToQuestion,
    toggleFlag,
    handleBookmark,
    handleSubmit,
    resetAndRefetch,
    reviewQuestion,
  };
}
