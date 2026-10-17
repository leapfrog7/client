import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
import { normalizeStartAttemptResponse } from "./mockPublicMappers";

function MockAttemptPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const identityRef = useRef({
    username: location.state?.username || "",
    mobile: location.state?.mobile || "",
  });

  const submitInFlightRef = useRef(false);
  const autoSubmitTriggeredRef = useRef(false);
  const questionPanelRef = useRef(null);
  const lastAutoSavedPayloadRef = useRef("");
  const autoSaveInFlightRef = useRef(false);
  const latestAnswersRef = useRef([]);
  const timerDeadlineRef = useRef(null);

  const [attempt, setAttempt] = useState(location.state?.attempt || null);
  const [mockTest, setMockTest] = useState(location.state?.mockTest || null);
  const [questions, setQuestions] = useState(location.state?.questions || []);
  const [answers, setAnswers] = useState([]);

  const [recovering, setRecovering] = useState(false);
  const [recoveryForm, setRecoveryForm] = useState({
    username: identityRef.current.username || "",
    mobile: identityRef.current.mobile || "",
  });
  const [recoveryErrors, setRecoveryErrors] = useState({});

  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [timerHydrated, setTimerHydrated] = useState(false);
  const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);

  const [loading, setLoading] = useState(!location.state?.attempt);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mobileNavigatorOpen, setMobileNavigatorOpen] = useState(false);

  const [confirmState, setConfirmState] = useState({
    open: false,
    type: "",
  });

  const answeredCount = useMemo(() => {
    return answers.filter((answer) =>
      hasSelectedOption(answer.selectedOptionIndex),
    ).length;
  }, [answers]);

  const totalQuestions = questions.length;
  const unansweredCount = Math.max(totalQuestions - answeredCount, 0);

  const progressPercent = useMemo(() => {
    if (!totalQuestions) return 0;
    return Math.round((answeredCount / totalQuestions) * 100);
  }, [answeredCount, totalQuestions]);

  const currentQuestion = questions[currentQuestionIndex] || null;

  const currentQuestionId = currentQuestion
    ? currentQuestion._id || currentQuestion.id
    : null;

  const currentAnswer = currentQuestionId
    ? answers.find(
        (answer) => String(answer.questionId) === String(currentQuestionId),
      )
    : null;

  const canGoPrevious = currentQuestionIndex > 0;
  const canGoNext = currentQuestionIndex < totalQuestions - 1;

  const currentStatus = attempt?.status;

  const isFinished = ["submitted", "auto_submitted", "expired"].includes(
    currentStatus,
  );

  const isLowTime =
    remainingSeconds !== null &&
    remainingSeconds <= 300 &&
    remainingSeconds > 0;

  const isTimeOver = remainingSeconds !== null && remainingSeconds <= 0;

  const buildAnswerPayload = useCallback(() => {
    return answers.map((answer) => ({
      questionId: answer.questionId,
      selectedOptionIndex: hasSelectedOption(answer.selectedOptionIndex)
        ? Number(answer.selectedOptionIndex)
        : null,
    }));
  }, [answers]);

  const navigateToResult = useCallback(
    ({ resultAttemptId, auto = false }) => {
      navigate(`/mock-tests/result/${resultAttemptId || attemptId}`, {
        state: {
          username: identityRef.current.username,
          mobile: identityRef.current.mobile,
          autoSubmitted: auto,
        },
      });
    },
    [attemptId, navigate],
  );

  const handleSubmitAttempt = useCallback(
    async ({ auto = false } = {}) => {
      if (submitting || isFinished || submitInFlightRef.current) return;

      submitInFlightRef.current = true;

      try {
        setSubmitting(true);
        setError("");

        const response = await submitAttempt(attemptId, buildAnswerPayload());

        setAutoSubmitTriggered(true);
        autoSubmitTriggeredRef.current = true;

        const finalizedStatus = response?.data?.attempt?.status || response?.data?.status;

        const resultAttemptId =
          response?.data?.attemptId ||
          response?.data?._id ||
          response?.data?.attempt?._id ||
          attemptId;

        navigateToResult({
          resultAttemptId,
          auto:
            auto ||
            response?.alreadyFinalized ||
            finalizedStatus === "auto_submitted",
        });
      } catch (err) {
        const finalizedAttempt =
          err?.response?.data?.data ||
          err?.data?.data ||
          err?.response?.data?.attempt ||
          null;

        const finalizedStatus = finalizedAttempt?.status;

        if (
          ["submitted", "auto_submitted", "expired"].includes(finalizedStatus)
        ) {
          setAutoSubmitTriggered(true);
          autoSubmitTriggeredRef.current = true;

          navigateToResult({
            resultAttemptId: finalizedAttempt?._id || attemptId,
            auto: finalizedStatus === "auto_submitted" || auto,
          });

          return;
        }

        setError(
          getAttemptActionErrorMessage(
            err,
            "Failed to submit test. Please try again.",
          ),
        );
      } finally {
        submitInFlightRef.current = false;
        setSubmitting(false);
      }
    },
    [attemptId, buildAnswerPayload, isFinished, navigateToResult, submitting],
  );

  useEffect(() => {
    latestAnswersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setTimerHydrated(false);
    if (location.state?.username && location.state?.mobile) {
      identityRef.current = { username: location.state.username, mobile: location.state.mobile };
    }
    if (!identityRef.current.username || !identityRef.current.mobile) {
      setQuestions([]);
      setLoading(false);
      return;
    }
    async function recoverSavedAttempt() {
      try {
        // Browser history state can survive refresh with outdated answers and timing.
        const response = await resumeAttemptById(attemptId, identityRef.current);
        if (cancelled) return;
        const recovered = normalizeStartAttemptResponse(response);
        const savedAttempt = recovered.attempt;
        if (["submitted", "auto_submitted", "expired", "disqualified"].includes(savedAttempt?.status)) {
          navigate("/mock-tests/result/" + (savedAttempt?._id || attemptId), {
            replace: true, state: { ...identityRef.current, autoSubmitted: savedAttempt.status === "auto_submitted" },
          });
          return;
        }
        if (!savedAttempt || !recovered.questions.length) throw new Error("Saved attempt could not be recovered.");
        setError("");
        setAttempt(savedAttempt);
        setQuestions(recovered.questions);
        setMockTest(recovered.mockTest);
        setAnswers(recovered.questions.map((question) => {
          const questionId = question._id || question.id;
          const saved = (savedAttempt.answers || []).find((answer) => String(answer.questionId) === String(questionId));
          return { questionId, selectedOptionIndex: hasSelectedOption(saved?.selectedOptionIndex) ? Number(saved.selectedOptionIndex) : null };
        }));
        const remaining = getInitialRemainingSeconds(savedAttempt, recovered.mockTest);
        timerDeadlineRef.current = Date.now() + remaining * 1000;
        setRemainingSeconds(remaining);
        setTimerHydrated(true);
        setAutoSubmitTriggered(false);
        autoSubmitTriggeredRef.current = false;
        submitInFlightRef.current = false;
        setCurrentQuestionIndex(0);
        setMobileNavigatorOpen(false);
      } catch (error) {
        if (cancelled) return;
        setQuestions([]);
        setError(error.message || "Failed to recover saved attempt.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    recoverSavedAttempt();
    return () => { cancelled = true; };
  }, [attemptId, location.state, navigate]);

  useEffect(() => {
    const canAutoSave =
      !loading &&
      !submitting &&
      !isFinished &&
      timerHydrated &&
      Boolean(attemptId) &&
      questions.length > 0;

    if (!canAutoSave) {
      return undefined;
    }

    const intervalId = window.setInterval(async () => {
      if (autoSaveInFlightRef.current || timerDeadlineRef.current - Date.now() <= 5000) return;

      const payload = latestAnswersRef.current.map((answer) => ({
        questionId: answer.questionId,
        selectedOptionIndex: hasSelectedOption(answer.selectedOptionIndex)
          ? Number(answer.selectedOptionIndex)
          : null,
      }));

      const payloadSignature = JSON.stringify(payload);

      if (payloadSignature === lastAutoSavedPayloadRef.current) {
        return;
      }

      try {
        autoSaveInFlightRef.current = true;


        await saveAttemptAnswers(attemptId, payload);

        lastAutoSavedPayloadRef.current = payloadSignature;

      } catch (err) {
        console.error("Auto-save failed:", err);
      } finally {
        autoSaveInFlightRef.current = false;
      }
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    loading,
    submitting,
    isFinished,
    timerHydrated,
    attemptId,
    questions.length,
  ]);

  useEffect(() => {
    if (!questions.length) return;

    setCurrentQuestionIndex((prev) =>
      Math.min(Math.max(prev, 0), questions.length - 1),
    );
  }, [questions.length]);

  useEffect(() => {
    if (
      loading ||
      isFinished ||
      submitting ||
      !timerHydrated ||
      remainingSeconds === null ||
      remainingSeconds <= 0
    ) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null) return prev;

        return Math.max(0, Math.ceil((timerDeadlineRef.current - Date.now()) / 1000));
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [loading, isFinished, submitting, timerHydrated, remainingSeconds]);

  useEffect(() => {
    if (
      loading ||
      isFinished ||
      submitting ||
      autoSubmitTriggered ||
      autoSubmitTriggeredRef.current ||
      submitInFlightRef.current ||
      !timerHydrated ||
      remainingSeconds === null ||
      remainingSeconds > 0 ||
      !questions.length
    ) {
      return;
    }

    setAutoSubmitTriggered(true);
    autoSubmitTriggeredRef.current = true;

    handleSubmitAttempt({ auto: true });
  }, [
    autoSubmitTriggered,
    handleSubmitAttempt,
    isFinished,
    loading,
    questions.length,
    remainingSeconds,
    submitting,
    timerHydrated,
  ]);

  function updateRecoveryField(name, value) {
    setRecoveryForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setRecoveryErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  async function handleRecoverAttempt(event) {
    event.preventDefault();

    const cleanedForm = {
      username: sanitizeUsername(recoveryForm.username).trim(),
      mobile: sanitizeMobile(recoveryForm.mobile),
    };

    const errors = validateRecoveryForm(cleanedForm);

    if (Object.keys(errors).length) {
      setRecoveryErrors(errors);
      return;
    }

    try {
      setRecovering(true);
      setError("");
      setRecoveryErrors({});

      const response = await resumeAttemptById(attemptId, cleanedForm);
      const {
        attemptId: recoveredAttemptId,
        attempt,
        questions,
        mockTest,
      } = normalizeStartAttemptResponse(response);

      const finalAttemptId = recoveredAttemptId || attempt?._id || attemptId;

      if (
        ["submitted", "auto_submitted", "expired"].includes(attempt?.status)
      ) {
        navigate(`/mock-tests/result/${finalAttemptId}`, {
          state: {
            username: cleanedForm.username,
            mobile: cleanedForm.mobile,
            autoSubmitted: attempt?.status === "auto_submitted",
          },
        });
        return;
      }

      if (!attempt || !Array.isArray(questions) || !questions.length) {
        throw new Error("Attempt could not be recovered. Please start again.");
      }

      identityRef.current = {
        username: cleanedForm.username,
        mobile: cleanedForm.mobile,
      };

      setAttempt(attempt);
      setMockTest(mockTest || null);
      setQuestions(questions);

      const existingAnswers = Array.isArray(attempt.answers)
        ? attempt.answers
        : [];

      setAnswers(
        questions.map((question) => {
          const questionId = question._id || question.id;

          const existing = existingAnswers.find(
            (answer) => String(answer.questionId) === String(questionId),
          );

          return {
            questionId,
            selectedOptionIndex: hasSelectedOption(
              existing?.selectedOptionIndex,
            )
              ? Number(existing.selectedOptionIndex)
              : null,
          };
        }),
      );

      const initialRemainingSeconds = getInitialRemainingSeconds(
        attempt,
        mockTest,
      );

      timerDeadlineRef.current = Date.now() + initialRemainingSeconds * 1000;
      setRemainingSeconds(initialRemainingSeconds);
      setTimerHydrated(true);
      setAutoSubmitTriggered(false);
      autoSubmitTriggeredRef.current = false;
      submitInFlightRef.current = false;
      setCurrentQuestionIndex(0);
      setMobileNavigatorOpen(false);
    } catch (err) {
      setError(err.message || "Failed to recover attempt.");
    } finally {
      setRecovering(false);
    }
  }

  function goToQuestion(index) {
    if (index < 0 || index >= totalQuestions) return;

    setCurrentQuestionIndex(index);
    setMobileNavigatorOpen(false);

    window.setTimeout(() => {
      questionPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function updateAnswer(questionId, selectedOptionIndex) {
    setAnswers((prev) =>
      prev.map((answer) =>
        String(answer.questionId) === String(questionId)
          ? {
              ...answer,
              selectedOptionIndex,
            }
          : answer,
      ),
    );
  }

  function clearAnswer(questionId) {
    setAnswers((prev) =>
      prev.map((answer) =>
        String(answer.questionId) === String(questionId)
          ? {
              ...answer,
              selectedOptionIndex: null,
            }
          : answer,
      ),
    );
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");

      const payload = buildAnswerPayload();

      await saveAttemptAnswers(attemptId, payload);

      lastAutoSavedPayloadRef.current = JSON.stringify(payload);
    } catch (err) {
      setError(
        getAttemptActionErrorMessage(
          err,
          "Failed to save answers. Please try again.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePause() {
    try {
      setSaving(true);
      setError("");

      await pauseAttempt(attemptId, buildAnswerPayload());

      navigate("/mock-tests");
    } catch (err) {
      setError(
        getAttemptActionErrorMessage(
          err,
          "Failed to pause test. Please try again.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  function openSubmitConfirm() {
    setConfirmState({
      open: true,
      type: "submit",
    });
  }

  function openPauseConfirm() {
    setConfirmState({
      open: true,
      type: "pause",
    });
  }

  function closeConfirm() {
    if (submitting || saving) return;

    setConfirmState({
      open: false,
      type: "",
    });
  }

  async function handleConfirmAction() {
    if (confirmState.type === "submit") {
      closeConfirm();
      await handleSubmitAttempt();
      return;
    }

    if (confirmState.type === "pause") {
      closeConfirm();
      await handlePause();
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <LoadingState message="Loading test..." />
        </div>
      </main>
    );
  }

  if (!questions.length) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <Link
            to="/mock-tests"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <FaArrowLeft />
            Back to Mock Tests
          </Link>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-900 px-4 py-5 text-white sm:px-6">
              <p className="text-xs font-black uppercase tracking-wide text-teal-200">
                Recover Attempt
              </p>
              <h1 className="mt-2 text-xl font-black sm:text-2xl">
                Resume your mock test
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
                The page was refreshed or opened directly. Enter the same name
                and mobile number used to start the test.
              </p>
            </div>

            <form onSubmit={handleRecoverAttempt} className="p-4 sm:p-6">
              {error ? (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <RecoveryTextField
                  label="Name"
                  name="username"
                  value={recoveryForm.username}
                  error={recoveryErrors.username}
                  placeholder="Enter same name"
                  maxLength={16}
                  autoComplete="name"
                  onChange={(name, value) =>
                    updateRecoveryField(name, sanitizeUsername(value))
                  }
                />

                <RecoveryTextField
                  label="Mobile Number"
                  name="mobile"
                  value={recoveryForm.mobile}
                  error={recoveryErrors.mobile}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel"
                  onChange={(name, value) =>
                    updateRecoveryField(name, sanitizeMobile(value))
                  }
                />
              </div>

              <button
                type="submit"
                disabled={recovering}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {recovering ? "Recovering..." : "Recover Attempt"}
              </button>

              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                <p className="font-black">Important</p>
                <p className="mt-1">
                  Use exactly the same name and mobile number entered when you
                  started the attempt. If the attempt was already submitted, you
                  will be taken to the result page.
                </p>
              </div>
            </form>
          </section>
        </div>
      </main>
    );
  }

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
                  disabled={saving || submitting}
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
                  <span>Pause</span>
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
              <p className="font-black">Temporary issue</p>
              <p className="mt-1">{error}</p>
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
            <QuestionAttemptCard
              question={currentQuestion}
              index={currentQuestionIndex}
              selectedOptionIndex={currentAnswer?.selectedOptionIndex}
              onSelect={updateAnswer}
              onClear={clearAnswer}
            />
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
        title={confirmState.type === "submit" ? "Submit test" : "Pause test"}
        message={
          confirmState.type === "submit"
            ? `You have answered ${answeredCount} out of ${totalQuestions} questions. Submit the test now?`
            : "Your current answers will be saved and you can resume within the mock test window."
        }
        confirmLabel={confirmState.type === "submit" ? "Submit" : "Pause"}
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
          Use Save periodically. Submit only after reviewing all questions.
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

function QuestionNavigatorButton({ index, isAnswered, isCurrent, onClick }) {
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
      {index + 1}
    </button>
  );
}

QuestionNavigatorButton.propTypes = {
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

function RecoveryTextField({
  label,
  name,
  value,
  error,
  placeholder,
  inputMode,
  maxLength,
  autoComplete,
  onChange,
}) {
  const inputId = `recover-attempt-${name}`;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={inputId} className="text-sm font-bold text-slate-800">
          {label}
        </label>

        {maxLength ? (
          <span className="text-xs font-semibold text-slate-400">
            {String(value || "").length}/{maxLength}
          </span>
        ) : null}
      </div>

      <input
        id={inputId}
        name={name}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        onChange={(event) => onChange(name, event.target.value)}
        className={[
          "mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2",
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
            : "border-slate-300 focus:border-teal-500 focus:ring-teal-100",
        ].join(" ")}
      />

      {error ? (
        <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

RecoveryTextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  inputMode: PropTypes.string,
  maxLength: PropTypes.number,
  autoComplete: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

function getAttemptActionErrorMessage(error, fallback) {
  if (error?.status === 429) {
    return "The server is busy at the moment. Please wait a few seconds and try again.";
  }

  if (error?.status >= 500 || error?.isNetworkError) {
    return "Temporary server load prevented this action. Please try again.";
  }

  return error?.message || fallback;
}

function sanitizeUsername(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 16);
}

function sanitizeMobile(value) {
  return String(value || "")
    .replace(/\D/g, "")
    .slice(0, 10);
}

function validateRecoveryForm(form) {
  const errors = {};

  const username = String(form.username || "").trim();
  const mobile = String(form.mobile || "").trim();

  if (!username) {
    errors.username = "Name is required.";
  } else if (username.length < 2) {
    errors.username = "Name must be at least 2 characters.";
  } else if (username.length > 16) {
    errors.username = "Name cannot exceed 16 characters.";
  } else if (!/^[a-zA-Z0-9 ]+$/.test(username)) {
    errors.username = "Name can contain only letters, numbers and spaces.";
  }

  if (!mobile) {
    errors.mobile = "Mobile number is required.";
  } else if (!/^[6-9]\d{9}$/.test(mobile)) {
    errors.mobile = "Enter a valid 10-digit Indian mobile number.";
  }

  return errors;
}

function getInitialRemainingSeconds(attempt, mockTest) {
  const windowEnd = new Date(mockTest?.endAt).getTime();
  const windowRemaining = Number.isFinite(windowEnd)
    ? Math.max(0, Math.floor((windowEnd - Date.now()) / 1000)) : Infinity;
  const durationSeconds = Number(attempt?.durationSeconds) || Number(mockTest?.durationMinutes) * 60 || 1800;
  const reported = attempt?.remainingSeconds;
  const remaining = reported !== undefined && reported !== null
    ? Math.max(0, Number(reported)) : Math.max(0, durationSeconds - Number(attempt?.usedSeconds || 0));
  return Math.min(windowRemaining, remaining);
}

export default MockAttemptPage;
