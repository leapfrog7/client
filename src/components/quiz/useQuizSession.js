import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL, TOKEN, uuid, isAxiosCanceled } from "./quizUtils";
import { loadState, saveState } from "./quizStorage";
import { currentToken, readSession } from "../../auth/session";
import { QUIZ_SUBMITTED_EVENT } from "./quizEvents";

function blank(mode = false) {
  return { quizData: [], answersById: {}, currentQuestionIndex: 0, flagged: [], showAllQuestions: mode,
    submissionId: uuid(), startedAt: new Date().toISOString(), pendingPayload: null,
    isSubmitted: false, completed: false, serverResult: null, serverComparison: null, finalScore: null };
}
function restored(userId, topicId, topicName) {
  let login;
  try { login = JSON.parse(localStorage.getItem("quiz-login-draft:" + userId + ":" + topicId)); } catch { /* Optional storage. */ }
  const normal = loadState(userId, topicId);
  const draft = normal?.version === 2 && normal.topicName === topicName ? normal : login;
  if (!draft?.quizData?.length || !draft.quizData.every(q => q?._id && Array.isArray(q.options))) return blank();
  const answersById = draft.answersById || Object.fromEntries(draft.quizData.map((q, i) => [q._id, draft.selectedAnswers?.[i]]).filter(([, answer]) => answer != null));
  return { ...blank(), ...draft, answersById, flagged: draft.flagged || [],
    currentQuestionIndex: Math.max(0, Math.min(draft.quizData.length - 1, draft.currentQuestionIndex || 0)) };
}
export default function useQuizSession({ userId, topicName, topicId }) {
  const scope = userId + ":" + topicId + ":" + topicName;
  const [view, setView] = useState(() => restored(userId, topicId, topicName));
  const [loading, setLoading] = useState(true), [isSubmitting, setIsSubmitting] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]), [loadingBM, setLoadingBM] = useState(false);
  const [error, setError] = useState(null), [errorType, setErrorType] = useState("");
  const live = useRef(view), active = useRef(false), generation = useRef(0), scopeRef = useRef(scope);
  const fetchAbort = useRef(null), submitBusy = useRef(false), bookmarkBusy = useRef(false);
  const draftKey = "quiz-login-draft:" + userId + ":" + topicId;
  const persist = useCallback(value => {
    if (!userId || !topicId || !value.quizData.length) return;
    saveState(userId, topicId, { ...value, version: 2, topicName, updatedAt: Date.now() });
  }, [userId, topicId, topicName]);
  const update = useCallback(value => {
    live.current = value; setView(value); persist(value);
  }, [persist]);
  const stillHere = useCallback((sequence, token) => active.current && generation.current === sequence &&
    scopeRef.current === scope && TOKEN() === token, [scope]);
  const fetchUnattemptedQuestions = useCallback(async (mode) => {
    if (!userId || !topicId) return;
    const sequence = ++generation.current, token = TOKEN();
    fetchAbort.current?.abort();
    const controller = new AbortController(); fetchAbort.current = controller;
    setLoading(true); setError(null); setErrorType("");
    try {
      const showAll = typeof mode === "boolean" ? mode : live.current.showAllQuestions;
      const response = await axios.get(BASE_URL + (showAll ? "/quiz/getRandomQuiz" : "/quiz/getQuiz"), {
        params: { userId, topicId, topicName }, headers: { Authorization: "Bearer " + token },
        signal: controller.signal, timeout: 20000,
      });
      if (!stillHere(sequence, token)) return;
      // A valid existing draft or receipt keeps the exact questions/order across refresh and re-login.
      if (!live.current.quizData.length) update({ ...live.current, quizData: Array.isArray(response.data) ? response.data : [] });
      try { localStorage.removeItem(draftKey); } catch { /* Optional storage. */ }
    } catch (e) {
      if (isAxiosCanceled(e) || !stillHere(sequence, token)) return;
      setError(e.response?.data?.message || "Could not load questions. Your saved answers have been retained.");
      setErrorType(live.current.pendingPayload ? "submit" : "load");
    } finally {
      if (active.current && scopeRef.current === scope && generation.current === sequence) {
        setLoading(false);
        if (TOKEN() && TOKEN() !== token) { setError("Your sign-in was updated. Retry loading to continue."); setErrorType(live.current.pendingPayload ? "submit" : "load"); }
      }
    }
  }, [userId, topicId, topicName, stillHere, update, draftKey, scope]);
  const fetchBookmarks = useCallback(async () => {
    const token = TOKEN(), mountedScope = scope;
    try {
      const { data } = await axios.get(BASE_URL + "/quiz/fetchAllBookmarks", {
        params: { userId, topicId }, headers: { Authorization: "Bearer " + token }, timeout: 10000,
      });
      if (!active.current || scopeRef.current !== mountedScope || TOKEN() !== token) return;
      const entry = data?.bookmarks?.find(b => b.topic?._id === topicId);
      setBookmarkedQuestions(entry?.questions?.filter(Boolean).map(q => String(q._id)) || []);
    } catch { /* A bookmark outage must not hide or replace an active quiz. */ }
  }, [userId, topicId, scope]);
  useEffect(() => {
    active.current = true; scopeRef.current = scope;
    const value = restored(userId, topicId, topicName);
    live.current = value; setView(value);
    setIsSubmitting(false); setBookmarkedQuestions([]);
    fetchUnattemptedQuestions(); fetchBookmarks();
    if (value.pendingPayload) { setError("Your previous submission is awaiting confirmation. Retry it to recover the receipt."); setErrorType("submit"); }
    return () => { active.current = false; fetchAbort.current?.abort(); };
  }, [scope, userId, topicId, topicName, fetchUnattemptedQuestions, fetchBookmarks]);
  useEffect(() => {
    function save() {
      const user = readSession(currentToken());
      if (user && user.userId !== userId) return;
      persist(live.current);
      try { if (live.current.quizData.length) localStorage.setItem(draftKey, JSON.stringify(live.current)); } catch { /* Optional storage. */ }
    }
    window.addEventListener("auth:expiring", save);
    window.addEventListener("beforeunload", save);
    return () => { window.removeEventListener("auth:expiring", save); window.removeEventListener("beforeunload", save); };
  }, [userId, draftKey, persist]);
  const change = useCallback(patch => {
    const s = live.current;
    if (s.pendingPayload || submitBusy.current) return;
    update({ ...s, ...patch });
  }, [update]);
  const handleOptionClick = useCallback(option => {
    const s = live.current, q = s.quizData[s.currentQuestionIndex];
    if (!q || !q.options.includes(option) || s.pendingPayload || submitBusy.current) return;
    update({ ...s, answersById: { ...s.answersById, [q._id]: option },
      ...(s.completed ? { completed: false, submissionId: uuid(), startedAt: new Date().toISOString() } : {}) });
  }, [update]);
  const clearSelection = useCallback(() => {
    const s = live.current, q = s.quizData[s.currentQuestionIndex];
    if (!q || s.pendingPayload || submitBusy.current) return;
    const answersById = { ...s.answersById }; delete answersById[q._id];
    update({ ...s, answersById, ...(s.completed ? { completed: false, submissionId: uuid(), startedAt: new Date().toISOString() } : {}) });
  }, [update]);
  const jumpToQuestion = useCallback(index => change({ currentQuestionIndex: Math.max(0, Math.min(index, live.current.quizData.length - 1)) }), [change]);
  const goNext = useCallback(() => jumpToQuestion(live.current.currentQuestionIndex + 1), [jumpToQuestion]);
  const goPrev = useCallback(() => jumpToQuestion(live.current.currentQuestionIndex - 1), [jumpToQuestion]);
  const toggleFlag = useCallback(() => {
    const s = live.current, id = String(s.quizData[s.currentQuestionIndex]?._id || "");
    change({ flagged: s.flagged.includes(id) ? s.flagged.filter(value => value !== id) : [...s.flagged, id] });
  }, [change]);
  const handleBookmark = useCallback(async () => {
    const s = live.current, q = s.quizData[s.currentQuestionIndex];
    if (!q || bookmarkBusy.current || s.pendingPayload) return;
    bookmarkBusy.current = true; setLoadingBM(true);
    const id = String(q._id), already = bookmarkedQuestions.includes(id), token = TOKEN(), mountedScope = scope;
    setBookmarkedQuestions(previous => already ? previous.filter(value => value !== id) : [...previous, id]);
    try {
      if (already) await axios.delete(BASE_URL + "/quiz/removeBookmark", { data: { userId, topicId, questionId: id }, headers: { Authorization: "Bearer " + token }, timeout: 10000 });
      else await axios.post(BASE_URL + "/quiz/addBookmark", { userId, topicName, questionId: id }, { headers: { Authorization: "Bearer " + token }, timeout: 10000 });
    } catch {
      if (active.current && scopeRef.current === mountedScope && TOKEN() === token) {
        setBookmarkedQuestions(previous => already ? [...new Set([...previous, id])] : previous.filter(value => value !== id));
        setError("Bookmark change could not be confirmed. Your quiz answers are safe."); setErrorType("bookmark");
      }
    } finally { bookmarkBusy.current = false; if (active.current && scopeRef.current === mountedScope) setLoadingBM(false); }
  }, [bookmarkedQuestions, scope, userId, topicId, topicName]);
  const handleSubmit = useCallback(async () => {
    const s = live.current, token = TOKEN(), mountedScope = scope;
    if (submitBusy.current || !s.quizData.length) return;
    submitBusy.current = true; setIsSubmitting(true); setError(null); setErrorType("");
    const payload = s.pendingPayload || {
      userId, topicName, submissionId: s.submissionId, startedAt: s.startedAt,
      attemptedQuestions: s.quizData.map(q => q._id),
      responses: s.quizData.map(q => ({ questionId: q._id, selected: s.answersById[q._id] ?? null,
        selectedOptionIndex: s.answersById[q._id] == null ? null : q.options.indexOf(s.answersById[q._id]) })),
    };
    update({ ...s, pendingPayload: payload });
    try {
      const { data } = await axios.post(BASE_URL + "/quiz/submitQuiz", payload, {
        headers: { Authorization: "Bearer " + token }, timeout: 20000,
      });
      if (!data?.result || !data?.attempt?.attemptId) throw new Error("Unconfirmed receipt");
      if (!active.current || scopeRef.current !== mountedScope || TOKEN() !== token) return;
      update({ ...live.current, pendingPayload: null, isSubmitted: true, completed: true,
        serverResult: data.result, serverComparison: data.comparison, finalScore: data.result.correct });
      window.dispatchEvent(new CustomEvent(QUIZ_SUBMITTED_EVENT, { detail: { userId, topicId } }));
    } catch (e) {
      if (active.current && scopeRef.current === mountedScope && TOKEN() === token) {
        // A validation rejection creates no receipt; allow correcting answers or deliberately starting afresh.
        // Network/5xx/429 failures stay locked to the retained payload until confirmation.
        if ([400, 404].includes(e.response?.status)) update({ ...live.current, pendingPayload: null });
        setError(e.response?.data?.message || "Submission is not confirmed. Your answers are retained. Retry the same submission."); setErrorType("submit");
      }
    } finally { submitBusy.current = false; if (active.current && scopeRef.current === mountedScope) setIsSubmitting(false); }
  }, [scope, userId, topicId, topicName, update]);
  const newSet = useCallback(mode => {
    if (live.current.pendingPayload || submitBusy.current) return;
    const value = blank(mode); update(value);
    saveState(userId, topicId, { ...value, version: 2, topicName });
    try { localStorage.removeItem(draftKey); } catch { /* Optional storage. */ }
    fetchUnattemptedQuestions(mode);
  }, [update, userId, topicId, topicName, draftKey, fetchUnattemptedQuestions]);
  const resetAndRefetch = useCallback(() => newSet(live.current.showAllQuestions), [newSet]);
  const setShowAllQuestions = useCallback(action => {
    const s = live.current, mode = typeof action === "function" ? action(s.showAllQuestions) : action;
    if (mode === s.showAllQuestions || s.pendingPayload || submitBusy.current) return;
    if (!s.completed && Object.keys(s.answersById).length && !window.confirm("Start a different question set? This will replace your current unsent answers.")) return;
    newSet(mode);
  }, [newSet]);
  const setIsSubmitted = useCallback(value => change({ isSubmitted: value }), [change]);
  const reviewQuestion = useCallback(index => change({ isSubmitted: false, currentQuestionIndex: index }), [change]);
  const retryError = useCallback(() => {
    if (errorType === "submit") return handleSubmit();
    if (errorType === "bookmark") { setError(null); setErrorType(""); return fetchBookmarks(); }
    return fetchUnattemptedQuestions();
  }, [errorType, handleSubmit, fetchBookmarks, fetchUnattemptedQuestions]);
  const selectedAnswers = useMemo(() => Object.fromEntries(view.quizData.map((q, i) => [i, view.answersById[q._id]]).filter(([, value]) => value != null)), [view]);
  return { ...view, selectedAnswers, flagged: new Set(view.flagged), currentQuestion: view.quizData[view.currentQuestionIndex],
    loading, isSubmitting, bookmarkedQuestions, loadingBM, error, errorType, retryError,
    isLocked: !!view.pendingPayload || isSubmitting, canStartAnotherSet: errorType === "submit" && !view.pendingPayload && !isSubmitting, setError, setIsSubmitted, setShowAllQuestions,
    fetchUnattemptedQuestions, handleOptionClick, clearSelection, goNext, goPrev, jumpToQuestion,
    toggleFlag, handleBookmark, handleSubmit, resetAndRefetch, reviewQuestion };
}
