import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaPause,
  FaSave,
  FaTh,
  FaTimes,
} from "react-icons/fa";

import ConfirmActionModal from "../../components/mocks/ConfirmActionModal";
import LoadingState from "../../components/mocks/LoadingState";

import {
  pauseAttempt,
  resumeAttemptById,
  saveAttemptAnswers,
  submitAttempt,
} from "./mockPublicApi";

import { formatDuration } from "../Admin/mocks/mockFormatters";
import MockParticipantAccess from "./MockParticipantAccess";
import { getMockSession, clearMockSession, readMockDraft, writeMockDraft, clearMockDraft } from "./mockSession";


function MockAttemptPage() {
  const { attemptId } = useParams(), navigate = useNavigate();
  const [session, setSession] = useState(getMockSession);
  const [attempt, setAttempt] = useState(null), [mockTest, setMockTest] = useState(null);
  const [questions, setQuestions] = useState([]), [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mobileNavigatorOpen, setMobileNavigatorOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [loading, setLoading] = useState(true), [saving, setSaving] = useState(false), [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(""), [saveState, setSaveState] = useState("Saved"), [conflict, setConflict] = useState(false);
  const [confirmState, setConfirmState] = useState({ open: false, type: "" });
  const live = useRef({ answers: [], currentQuestionIndex: 0 }), revision = useRef(0);
  const deadlineRef = useRef(0), inFlight = useRef(null), submitInFlight = useRef(false);
  const confirmedSignature = useRef(""), pendingSubmission = useRef(null), lastRetry = useRef(0);
  const submitRef = useRef(null), saveRef = useRef(null), questionPanelRef = useRef(null);
  const mounted = useRef(true), recoverySequence = useRef(0);
  const invalidateRecovery = useCallback(() => { recoverySequence.current++; }, []);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; invalidateRecovery(); }; }, [invalidateRecovery]);
  const sessionRef = useRef(session); sessionRef.current = session;
  const conflictRef = useRef(conflict); conflictRef.current = conflict;
  function signature(value) { return JSON.stringify(value); }
  function persist(value = live.current) {
    if (!sessionRef.current) return;
    const ok = writeMockDraft(sessionRef.current.account.id, attemptId, {
      ...value, revision: revision.current, pending: signature(value) !== confirmedSignature.current,
      submissionPending: Boolean(pendingSubmission.current), deadlineAt: attempt?.deadlineAt,
    });
    if (!ok) setError("This browser could not keep a local backup. Keep the page open and check that answers are saved.");
  }
  function applyAnswers(value) {
    live.current = value; setAnswers(value.answers); setCurrentQuestionIndex(value.currentQuestionIndex);
  }
  function actionFailure(err) {
    if (err.code === "ANSWER_CONFLICT") { conflictRef.current = true; setConflict(true); setSaveState("Newer answers exist in another tab"); }
    else setSaveState(navigator.onLine ? "Not saved — retry pending" : "Offline — changes pending");
    setError(err.message);
    if (err.code === "MOCK_SESSION_REQUIRED") { clearMockSession(); setSession(null); setQuestions([]); }
  }
  async function recover(discardLocal = false) {
    const sequence = ++recoverySequence.current;
    if (!getMockSession()) { setSession(null); setQuestions([]); setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const response = await resumeAttemptById(attemptId), data = response.data, saved = data.attempt;
      if (!mounted.current || sequence !== recoverySequence.current) return;
      if (saved.isFinal) {
        clearMockDraft(getMockSession().account.id, attemptId);
        navigate("/mock-tests/result/" + attemptId, { replace: true }); return;
      }
      revision.current = saved.answerRevision;
      const serverValue = { answers: (saved.answers || []).map(a => ({
        questionId: a.questionId, selectedOptionIndex: a.selectedOptionIndex ?? null,
        isVisited: Boolean(a.isVisited), isMarkedForReview: Boolean(a.isMarkedForReview),
      })), currentQuestionIndex: Math.min(saved.currentQuestionIndex || 0, data.questions.length - 1) };
      confirmedSignature.current = signature(serverValue);
      const draft = discardLocal ? null : readMockDraft(getMockSession().account.id, attemptId);
      let value = serverValue;
      const usable = draft?.pending || draft?.submissionPending;
      const differs = usable && signature({ answers: draft.answers, currentQuestionIndex: draft.currentQuestionIndex }) !== confirmedSignature.current;
      const conflicting = differs && draft.revision !== saved.answerRevision;
      if (differs && !conflicting) value = { answers: draft.answers, currentQuestionIndex: Math.min(draft.currentQuestionIndex || 0, data.questions.length - 1) };
      pendingSubmission.current = draft?.submissionPending && !conflicting ? value : null;
      conflictRef.current = Boolean(conflicting); setConflict(Boolean(conflicting));
      setSaveState(conflicting ? "Newer answers exist in another tab" : differs ? "Restored local changes — waiting to save" : "Saved");
      if (conflicting) setError("Another tab saved a newer version. Your local backup was kept. Use Reload saved answers to continue with the server version.");
      setAttempt(saved); setMockTest(data.mockTest); setQuestions(data.questions); applyAnswers(value);
      deadlineRef.current = performance.now() + Math.max(0, new Date(saved.deadlineAt) - new Date(saved.serverNow));
      setRemainingSeconds(Math.max(0, Math.ceil((deadlineRef.current - performance.now()) / 1000)));
    } catch (err) { if (mounted.current && sequence === recoverySequence.current) { actionFailure(err); setQuestions([]); } }
    finally { if (mounted.current && sequence === recoverySequence.current) setLoading(false); }
  }
  useEffect(() => {
    // Session credentials are never passed in browser history.
    recover();
    return invalidateRecovery;
    // Each attempt/session hydrates from its authoritative server snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, session?.account?.id, invalidateRecovery]);

  async function saveNow({ pause = false } = {}) {
    if (inFlight.current) return inFlight.current;
    if (submitInFlight.current || conflictRef.current || !questions.length || performance.now() >= deadlineRef.current) return;
    const sequence = recoverySequence.current;
    const snapshot = { ...live.current, answers: live.current.answers.map(a => ({ ...a })) };
    if (!pause && signature(snapshot) === confirmedSignature.current) return;
    setSaving(true); setSaveState("Saving...");
    const operation = (async () => {
      try {
        const response = await (pause ? pauseAttempt : saveAttemptAnswers)(attemptId, snapshot.answers,
          { revision: revision.current, currentQuestionIndex: snapshot.currentQuestionIndex });
        if (!mounted.current || sequence !== recoverySequence.current) return;
        const saved = response.data.attempt;
        if (saved.isFinal) { navigate("/mock-tests/result/" + attemptId); return; }
        if (response.code === "MOCK_DEADLINE") return;
        revision.current = saved.answerRevision;
        confirmedSignature.current = signature(snapshot);
        setSaveState(signature(live.current) === confirmedSignature.current ? "Saved at " + new Date().toLocaleTimeString() : "Changes pending");
        setError(""); persist();
        if (pause) navigate("/mock-tests");
      } catch (err) { if (mounted.current && sequence === recoverySequence.current) actionFailure(err); throw err; }
      finally { if (mounted.current && sequence === recoverySequence.current) setSaving(false); }
    })();
    inFlight.current = operation;
    try { await operation; } finally { inFlight.current = null; }
  }
  saveRef.current = saveNow;
  async function handleSubmitAttempt() {
    if (submitInFlight.current || conflictRef.current || !questions.length) return;
    const sequence = recoverySequence.current;
    submitInFlight.current = true; setSubmitting(true); setError("");
    pendingSubmission.current ||= { ...live.current, answers: live.current.answers.map(a => ({ ...a })) };
    persist();
    try {
      // Autosave stops eight seconds before expiry and has a four-second timeout.
      if (inFlight.current) await inFlight.current;
      if (conflictRef.current) return;
      const response = await submitAttempt(attemptId, pendingSubmission.current.answers, { revision: revision.current });
      if (!mounted.current || sequence !== recoverySequence.current) return;
      if (!response.data.attempt.isFinal) throw new Error("Submission is still pending. Please retry.");
      clearMockDraft(sessionRef.current.account.id, attemptId);
      navigate("/mock-tests/result/" + attemptId, { replace: true });
    } catch (err) { if (mounted.current && sequence === recoverySequence.current) { actionFailure(err); setError(err.message + " Submission is not confirmed. Retry submission when connected."); } }
    finally { submitInFlight.current = false; if (mounted.current && sequence === recoverySequence.current) setSubmitting(false); lastRetry.current = Date.now(); }
  }
  submitRef.current = handleSubmitAttempt;

  useEffect(() => {
    if (loading || !questions.length) return;
    const timer = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadlineRef.current - performance.now()) / 1000));
      setRemainingSeconds(left);
      if (!left && Date.now() - lastRetry.current > 5000 && !conflictRef.current) submitRef.current();
    }, 250);
    const retryOnline = () => { if (pendingSubmission.current || performance.now() >= deadlineRef.current) submitRef.current(); else saveRef.current().catch(() => {}); };
    const warnUnsaved = event => {
      if (signature(live.current) !== confirmedSignature.current || pendingSubmission.current) {
        event.preventDefault(); event.returnValue = "";
      }
    };
    window.addEventListener("online", retryOnline);
    window.addEventListener("beforeunload", warnUnsaved);
    return () => { clearInterval(timer); window.removeEventListener("online", retryOnline); window.removeEventListener("beforeunload", warnUnsaved); };
  }, [loading, questions.length]);

  useEffect(() => {
    if (loading || !questions.length || submitting || conflict) return;
    const run = () => { if (deadlineRef.current - performance.now() > 8000 && !pendingSubmission.current) saveRef.current().catch(() => {}); };
    const debounce = setTimeout(run, 1500), maximum = setInterval(run, 10000);
    return () => { clearTimeout(debounce); clearInterval(maximum); };
  }, [answers, currentQuestionIndex, loading, questions.length, submitting, conflict]);

  function updateAnswer(questionId, selectedOptionIndex) {
    if (remainingSeconds <= 0 || submitting || pendingSubmission.current || conflict) return;
    const value = { ...live.current, answers: live.current.answers.map(a =>
      String(a.questionId) === String(questionId) ? { ...a, selectedOptionIndex, isVisited: true } : a) };
    applyAnswers(value); persist(value); setSaveState("Changes pending");
  }
  function clearAnswer(questionId) { updateAnswer(questionId, null); }
  function goToQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    const value = { currentQuestionIndex: index, answers: live.current.answers.map((a, i) => i === index ? { ...a, isVisited: true } : a) };
    applyAnswers(value); persist(value); setMobileNavigatorOpen(false);
    questionPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function toggleReview() {
    if (remainingSeconds <= 0 || pendingSubmission.current || conflict) return;
    const value = { ...live.current, answers: live.current.answers.map((a, i) => i === currentQuestionIndex ? { ...a, isMarkedForReview: !a.isMarkedForReview } : a) };
    applyAnswers(value); persist(value); setSaveState("Changes pending");
  }
  const answeredCount = answers.filter(a => hasSelectedOption(a.selectedOptionIndex)).length;
  const totalQuestions = questions.length, unansweredCount = totalQuestions - answeredCount;
  const progressPercent = totalQuestions ? Math.round(answeredCount / totalQuestions * 100) : 0;
  const currentQuestion = questions[currentQuestionIndex], currentAnswer = answers[currentQuestionIndex];
  const canGoPrevious = currentQuestionIndex > 0, canGoNext = currentQuestionIndex < totalQuestions - 1;
  const isLowTime = remainingSeconds !== null && remainingSeconds <= 300, isTimeOver = remainingSeconds !== null && remainingSeconds <= 0;
  const handleSave = () => saveNow().catch(() => {});
  const openSubmitConfirm = () => setConfirmState({ open: true, type: "submit" });
  const openPauseConfirm = () => setConfirmState({ open: true, type: "pause" });
  const closeConfirm = () => setConfirmState({ open: false, type: "" });
  async function handleConfirmAction() {
    const action = confirmState.type; closeConfirm();
    if (action === "submit") await handleSubmitAttempt();
    else await saveNow({ pause: true }).catch(() => {});
  }
  if (loading) return <LoadingState message="Loading test..." />;
  if (!questions.length) return <main className="min-h-screen bg-slate-50 p-4"><div className="mx-auto max-w-3xl space-y-5">
    <Link to="/mock-tests" className="underline">Back to Mock Tests</Link><h1 className="text-2xl font-bold">Resume your mock test</h1>
    <MockParticipantAccess onReady={setSession} />
    {error ? <p role="alert" className="text-red-700">{error}</p> : null}
    <button className="rounded-lg bg-teal-700 p-3 text-white disabled:opacity-50" disabled={!session} onClick={() => recover()}>Recover Attempt</button>
    <p>Your original timer continues while you reconnect.</p>
  </div></main>;
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 lg:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  to="/mock-tests"
                  className="hidden rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 sm:inline-flex"
                  aria-label="Back to mock tests"
                >
                  <FaArrowLeft className="text-sm" />
                </Link>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-950 sm:text-base">
                    {attempt?.mockTestTitle || mockTest?.title || "Mock Test"}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    LDCE SO/PS Mock Test · {totalQuestions} questions
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
              <div className="flex items-center gap-2">
                <TimerPill
                  remainingSeconds={remainingSeconds}
                  isLowTime={isLowTime}
                  isTimeOver={isTimeOver}
                />

                <ProgressPill
                  answeredCount={answeredCount}
                  totalQuestions={totalQuestions}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || submitting || conflict || isTimeOver}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                >
                  <FaSave />
                  <span>{saving ? "Saving..." : "Save"}</span>
                </button>

                <button
                  type="button"
                  onClick={openPauseConfirm}
                  disabled={saving || submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs font-bold text-amber-900 shadow-sm hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                >
                  <FaPause />
                  <span>Save & leave</span>
                </button>

                <button
                  type="button"
                  onClick={openSubmitConfirm}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-3 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                >
                  <FaCheckCircle />
                  <span>{submitting ? "Submitting..." : "Submit"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p role="status" aria-live="polite" className="mb-2 text-sm font-semibold">{saveState}</p>
            <p className="mb-2 text-xs text-slate-600">The timer continues when you leave or reconnect.</p>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <span>Progress</span>
              <span>{progressPercent}% completed</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-700 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-3 py-5 sm:px-4 lg:grid-cols-[minmax(0,1fr)_310px] lg:px-6">
        <section ref={questionPanelRef} className="space-y-4 sm:space-y-5">
          {error ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-900 shadow-sm">
              <p className="font-black">Please check</p>
              <p className="mt-1" role="alert">{error}</p>
              {conflict ? <button className="mt-2 underline" onClick={() => { clearMockDraft(session.account.id, attemptId); pendingSubmission.current = null; recover(true); }}>Reload saved answers</button> : null}
              {pendingSubmission.current && !conflict ? <button className="mt-2 underline" onClick={handleSubmitAttempt} disabled={submitting}>Retry submission</button> : null}
            </div>
          ) : null}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid gap-3 text-sm sm:grid-cols-4">
              <SummaryTile label="Answered" value={answeredCount} />
              <SummaryTile label="Unanswered" value={unansweredCount} />
              <SummaryTile
                label="Current"
                value={`${currentQuestionIndex + 1} / ${totalQuestions}`}
              />
              <SummaryTile
                label="Time left"
                value={
                  remainingSeconds === null
                    ? "--:--"
                    : formatDuration(remainingSeconds)
                }
                warning={isLowTime || isTimeOver}
              />
            </div>
          </div>

          {currentQuestion ? (
            <fieldset disabled={isTimeOver || submitting || conflict || Boolean(pendingSubmission.current)}><QuestionAttemptCard
              question={currentQuestion}
              index={currentQuestionIndex}
              selectedOptionIndex={currentAnswer?.selectedOptionIndex}
              onSelect={updateAnswer}
              onClear={clearAnswer}
            /><button type="button" aria-pressed={Boolean(currentAnswer?.isMarkedForReview)} onClick={toggleReview} className="mt-3 rounded-lg border bg-white p-3 text-sm">{currentAnswer?.isMarkedForReview ? "Unmark review" : "Mark for review"}</button></fieldset>
          ) : null}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => goToQuestion(currentQuestionIndex - 1)}
                disabled={!canGoPrevious}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <FaChevronLeft />
                Previous
              </button>

              <button
                type="button"
                onClick={() => setMobileNavigatorOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-black text-teal-800 shadow-sm hover:bg-teal-100 lg:hidden"
              >
                <FaTh />
                Question Navigator
              </button>

              {canGoNext ? (
                <button
                  type="button"
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-teal-800 sm:w-auto"
                >
                  Next
                  <FaChevronRight />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openSubmitConfirm}
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <FaCheckCircle />
                  Submit Test
                </button>
              )}
            </div>
          </div>
        </section>

        <aside className="hidden lg:block">
          <QuestionNavigatorPanel
            questions={questions}
            answers={answers}
            currentQuestionIndex={currentQuestionIndex}
            onGoToQuestion={goToQuestion}
          />
        </aside>

        <MobileQuestionNavigatorSheet
          open={mobileNavigatorOpen}
          questions={questions}
          answers={answers}
          currentQuestionIndex={currentQuestionIndex}
          onGoToQuestion={goToQuestion}
          onClose={() => setMobileNavigatorOpen(false)}
        />
      </div>

      <ConfirmActionModal
        open={confirmState.open}
        title={confirmState.type === "submit" ? "Submit test" : "Save and leave"}
        message={
          confirmState.type === "submit"
            ? `You have answered ${answeredCount} out of ${totalQuestions} questions. Submit the test now?`
            : "Your answers will be saved. The timer continues while you are away; reconnect before your deadline."
        }
        confirmLabel={confirmState.type === "submit" ? "Submit" : "Save & leave"}
        loading={submitting || saving}
        onConfirm={handleConfirmAction}
        onCancel={closeConfirm}
      />
    </main>
  );
}

function TimerPill({ remainingSeconds, isLowTime, isTimeOver }) {
  return (
    <div
      className={[
        "inline-flex min-w-[116px] items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-black shadow-sm",
        isLowTime || isTimeOver
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-teal-200 bg-teal-50 text-teal-800",
      ].join(" ")}
    >
      <FaClock />
      {remainingSeconds === null ? "--:--" : formatDuration(remainingSeconds)}
    </div>
  );
}

TimerPill.propTypes = {
  remainingSeconds: PropTypes.number,
  isLowTime: PropTypes.bool.isRequired,
  isTimeOver: PropTypes.bool.isRequired,
};

function ProgressPill({ answeredCount, totalQuestions }) {
  return (
    <div className="inline-flex min-w-[116px] items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 shadow-sm">
      {answeredCount}/{totalQuestions}
    </div>
  );
}

ProgressPill.propTypes = {
  answeredCount: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
};

function SummaryTile({ label, value, warning = false }) {
  return (
    <div
      className={[
        "rounded-xl border px-4 py-3",
        warning
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-slate-200 bg-slate-50 text-slate-800",
      ].join(" ")}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

SummaryTile.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  warning: PropTypes.bool,
};

function QuestionNavigatorPanel({
  questions,
  answers,
  currentQuestionIndex,
  onGoToQuestion,
}) {
  const answeredCount = answers.filter((answer) =>
    hasSelectedOption(answer.selectedOptionIndex),
  ).length;

  return (
    <div className="sticky top-32 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-sm font-black text-slate-950">
          Question Navigator
        </h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Jump to any question. Teal means answered. Dark ring means current.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          const questionId = question._id || question.id;

          const answer = answers.find(
            (item) => String(item.questionId) === String(questionId),
          );

          const isAnswered = hasSelectedOption(answer?.selectedOptionIndex);
          const isCurrent = index === currentQuestionIndex;

          return (
            <QuestionNavigatorButton
              key={questionId}
              index={index}
              isAnswered={isAnswered}
              isCurrent={isCurrent}
              isMarkedForReview={Boolean(answer?.isMarkedForReview)}
              onClick={() => onGoToQuestion(index)}
            />
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
        <NavigatorLegend label="Answered" className="bg-teal-700" />
        <NavigatorLegend label="Not answered" className="bg-slate-200" />
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-3 py-3 text-xs leading-5 text-slate-600">
        <p>
          <span className="font-bold text-slate-800">Answered:</span>{" "}
          {answeredCount}/{questions.length}
        </p>
        <p className="mt-1">
          Answers save automatically. Check the save status before leaving or submitting.
        </p>
      </div>
    </div>
  );
}

QuestionNavigatorPanel.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.string,
    }),
  ).isRequired,
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      questionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      selectedOptionIndex: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    }),
  ).isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  onGoToQuestion: PropTypes.func.isRequired,
};

function MobileQuestionNavigatorSheet({
  open,
  questions,
  answers,
  currentQuestionIndex,
  onGoToQuestion,
  onClose,
}) {
  if (!open) return null;

  const answeredCount = answers.filter((answer) =>
    hasSelectedOption(answer.selectedOptionIndex),
  ).length;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close question navigator"
        className="absolute inset-0 bg-slate-950/40"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 bottom-0 max-h-[78vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4">
          <div>
            <h2 className="text-base font-black text-slate-950">
              Question Navigator
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Answered {answeredCount}/{questions.length}. Tap a number to jump.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="max-h-[56vh] overflow-y-auto px-4 py-4">
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
            {questions.map((question, index) => {
              const questionId = question._id || question.id;

              const answer = answers.find(
                (item) => String(item.questionId) === String(questionId),
              );

              const isAnswered = hasSelectedOption(answer?.selectedOptionIndex);
              const isCurrent = index === currentQuestionIndex;

              return (
                <QuestionNavigatorButton
                  key={questionId}
                  index={index}
                  isAnswered={isAnswered}
                  isCurrent={isCurrent}
              isMarkedForReview={Boolean(answer?.isMarkedForReview)}
                  onClick={() => onGoToQuestion(index)}
                />
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <NavigatorLegend label="Answered" className="bg-teal-700" />
            <NavigatorLegend label="Not answered" className="bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

MobileQuestionNavigatorSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.string,
    }),
  ).isRequired,
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      questionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      selectedOptionIndex: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    }),
  ).isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  onGoToQuestion: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

function QuestionNavigatorButton({ index, isAnswered, isCurrent, isMarkedForReview = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex h-10 w-full items-center justify-center rounded-xl border text-xs font-black transition",
        isAnswered
          ? "border-teal-700 bg-teal-700 text-white"
          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
        isCurrent ? "ring-2 ring-slate-900 ring-offset-2" : "",
      ].join(" ")}
    >
      {index + 1}{isMarkedForReview ? " ★" : ""}
    </button>
  );
}

QuestionNavigatorButton.propTypes = {
  isMarkedForReview: PropTypes.bool,
  index: PropTypes.number.isRequired,
  isAnswered: PropTypes.bool.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

function NavigatorLegend({ label, className }) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <span className={["h-3 w-3 rounded", className].join(" ")} />
      <span>{label}</span>
    </div>
  );
}

NavigatorLegend.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

function QuestionAttemptCard({
  question,
  index,
  selectedOptionIndex,
  onSelect,
  onClear,
}) {
  const questionId = question._id || question.id;
  const options = Array.isArray(question.options) ? question.options : [];
  const isAnswered = hasSelectedOption(selectedOptionIndex);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                Question {index + 1}
              </span>

              <span
                className={[
                  "rounded-full px-3 py-1 text-xs font-bold",
                  isAnswered
                    ? "bg-teal-50 text-teal-800"
                    : "bg-slate-100 text-slate-600",
                ].join(" ")}
              >
                {isAnswered ? "Answered" : "Not answered"}
              </span>

              {question.subject ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {question.subject}
                </span>
              ) : null}

              {question.topic ? (
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                  {question.topic}
                </span>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onClear(questionId)}
            disabled={!isAnswered}
            className="self-start rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear response
          </button>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-5">
        <p className="whitespace-pre-wrap text-[15px] font-semibold leading-7 text-slate-950 sm:text-base sm:leading-8">
          {question.questionText}
        </p>

        <div className="mt-5 space-y-3">
          {options.map((option, optionIndex) => {
            const selected = isSameOption(selectedOptionIndex, optionIndex);
            const optionLabel = String.fromCharCode(65 + optionIndex);

            return (
              <button
                key={`${questionId}-${optionIndex}`}
                type="button"
                onClick={() => onSelect(questionId, optionIndex)}
                className={[
                  "group flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition sm:px-5",
                  selected
                    ? "border-teal-600 bg-teal-50 text-teal-950 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                ].join(" ")}
              >
                <span
                  className={[
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-black transition",
                    selected
                      ? "border-teal-700 bg-teal-700 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-600 group-hover:border-slate-400",
                  ].join(" ")}
                >
                  {optionLabel}
                </span>

                <span className="leading-6">{option.optionText}</span>
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}

QuestionAttemptCard.propTypes = {
  question: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    questionText: PropTypes.string,
    subject: PropTypes.string,
    topic: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        optionText: PropTypes.string,
      }),
    ),
  }).isRequired,
  index: PropTypes.number.isRequired,
  selectedOptionIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  onSelect: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

function hasSelectedOption(value) {
  return value !== null && value !== undefined && value !== "";
}

function isSameOption(selectedOptionIndex, optionIndex) {
  if (!hasSelectedOption(selectedOptionIndex)) return false;

  return Number(selectedOptionIndex) === Number(optionIndex);
}


export default MockAttemptPage;
