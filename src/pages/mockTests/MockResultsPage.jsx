import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBullhorn,
  FaCheckCircle,
  FaClock,
  FaCopy,
  FaExternalLinkAlt,
  FaMedal,
  FaSearch,
  FaShareAlt,
  FaTimesCircle,
  FaTrophy,
  FaUserPlus,
} from "react-icons/fa";

import AttemptStatusBadge from "../../components/mocks/AttemptStatusBadge";
import LoadingState from "../../components/mocks/LoadingState";

import { getAttemptResult } from "./mockPublicApi";

import {
  formatAccuracy,
  formatDateTime,
  formatDuration,
  formatScore,
} from "../Admin/mocks/mockFormatters";

const REGISTER_URL = "http://undersigned.in/register";
const SUBSCRIBE_URL = "http://undersigned.in/subscribe";
const MOCK_TESTS_URL = "http://undersigned.in/mock-tests";

function isUserLoggedIn() {
  try {
    return Boolean(localStorage.getItem("jwtToken"));
  } catch {
    return false;
  }
}

function MockResultPage() {
  const { attemptId } = useParams();
  const location = useLocation();
  const [isLoggedIn] = useState(() => isUserLoggedIn());

  const [identity, setIdentity] = useState({
    username: location.state?.username || "",
    mobile: location.state?.mobile || "",
  });

  const [result, setResult] = useState(null);
  const [formVisible, setFormVisible] = useState(
    !location.state?.username || !location.state?.mobile,
  );

  const [loading, setLoading] = useState(Boolean(location.state?.username));
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function loadResult(payload) {
    try {
      setLoading(true);
      setError("");

      const response = await getAttemptResult(attemptId, payload);

      setResult(response?.data || null);
      setFormVisible(false);
    } catch (err) {
      setError(err.message || "Failed to load result.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (location.state?.username && location.state?.mobile) {
      loadResult({
        username: location.state.username,
        mobile: location.state.mobile,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  function updateField(name, value) {
    setIdentity((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function validateForm() {
    const errors = {};

    const username = identity.username.trim();
    const mobile = identity.mobile.trim();

    if (!username) {
      errors.username = "Name is required.";
    } else if (username.length < 2) {
      errors.username = "Name must be at least 2 characters.";
    }

    if (!mobile) {
      errors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      errors.mobile = "Enter a valid 10-digit Indian mobile number.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    loadResult({
      username: identity.username.trim(),
      mobile: identity.mobile.trim(),
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-5 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/mock-tests"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 sm:px-4 sm:text-sm"
          >
            <FaArrowLeft />
            Back
            <span className="hidden sm:inline">to Mock Tests</span>
          </Link>

          {result?.mockTest?._id ? (
            <Link
              to={`/mock-tests/${result.mockTest._id}/leaderboard`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 sm:px-4 sm:text-sm"
            >
              <FaTrophy />
              Leaderboard
            </Link>
          ) : null}
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-900 px-4 py-6 text-white sm:px-6">
            <p className="text-xs font-black uppercase tracking-wide text-teal-200">
              Mock Test Result
            </p>

            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
              Your attempt summary
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200">
              Score is calculated on the basis of +1.25 for every correct answer
              and one-third negative marking for every wrong answer.
            </p>
          </div>
        </section>

        {formVisible ? (
          <ResultLookupForm
            identity={identity}
            fieldErrors={fieldErrors}
            loading={loading}
            onChange={updateField}
            onSubmit={handleSubmit}
          />
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700 shadow-sm">
            {error}
          </div>
        ) : null}

        {loading ? <LoadingState message="Loading result..." /> : null}

        {!loading && result ? (
          <>
            <ResultSummary result={result} />

            <ResultEngagementNudge isLoggedIn={isLoggedIn} />

            {Array.isArray(result.review) && result.review.length ? (
              <AnswerReviewSection review={result.review} />
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}

function ResultLookupForm({
  identity,
  fieldErrors,
  loading,
  onChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 sm:flex">
          <FaSearch />
        </div>

        <div>
          <p className="text-base font-black text-slate-950">
            Verify participant details
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Enter the same name and mobile number used for the attempt.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-start">
        <TextField
          label="Name"
          name="username"
          value={identity.username}
          error={fieldErrors.username}
          placeholder="Enter your name"
          maxLength={16}
          onChange={(name, value) =>
            onChange(
              name,
              String(value || "")
                .replace(/[^a-zA-Z0-9 ]/g, "")
                .replace(/\s+/g, " ")
                .slice(0, 16),
            )
          }
        />

        <TextField
          label="Mobile Number"
          name="mobile"
          value={identity.mobile}
          error={fieldErrors.mobile}
          placeholder="10-digit mobile number"
          inputMode="numeric"
          maxLength={10}
          onChange={(name, value) =>
            onChange(name, value.replace(/\D/g, "").slice(0, 10))
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-teal-700 px-5 text-sm font-black text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 md:mt-6"
        >
          {loading ? "Loading..." : "View Result"}
        </button>
      </div>
    </form>
  );
}

function ResultSummary({ result }) {
  const attempt = result.attempt || result;
  const mockTest = result.mockTest || {};

  const rank = result.rank ?? attempt.rank ?? null;
  const totalParticipants =
    result.totalParticipants ?? attempt.totalParticipants ?? 0;
  const percentile = result.percentile ?? attempt.percentile ?? null;
  const leaderboardAvailable = Boolean(result.leaderboardAvailable);

  const leaderboardMockTestId =
    mockTest?._id ||
    attempt?.mockTestId ||
    attempt?.mockTest?._id ||
    attempt?.mockTest ||
    "";

  return (
    <section className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-black text-slate-950">
                {mockTest.title || attempt.mockTestTitle || "Mock Test"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {mockTest.examName || "LDCE SO/PS conducted by UPSC"}
              </p>

              <p className="mt-2 text-sm font-bold text-slate-800">
                {attempt.username || result.username || "Participant"}
              </p>
            </div>

            <AttemptStatusBadge status={attempt.status} />
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
            <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm">
              <div className="flex flex-col gap-4 bg-gradient-to-br from-teal-700 to-teal-800 p-4 text-white sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-teal-100">
                    Final Score
                  </p>

                  <p className="mt-2 text-4xl font-black leading-none tracking-tight sm:text-5xl">
                    {formatScore(attempt.score)}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:min-w-[230px]">
                  <ScoreChip
                    label="Correct"
                    value={attempt.correctCount || 0}
                  />
                  <ScoreChip label="Wrong" value={attempt.wrongCount || 0} />
                  <ScoreChip
                    label="Left"
                    value={attempt.unattemptedCount || 0}
                  />
                </div>
              </div>
            </div>

            {leaderboardAvailable && rank && totalParticipants ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                      <FaMedal />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                        Leaderboard
                      </p>
                      <h3 className="mt-1 truncate text-lg font-black text-slate-950">
                        Rank {rank} of {totalParticipants}
                      </h3>
                    </div>
                  </div>

                  <div className="shrink-0 rounded-2xl bg-teal-50 px-4 py-2 text-right ring-1 ring-teal-100">
                    <p className="text-[10px] font-black uppercase tracking-wide text-teal-700">
                      Percentile
                    </p>
                    <p className="text-2xl font-black leading-none text-teal-900">
                      {percentile}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  You performed better than approximately{" "}
                  <span className="font-black text-slate-950">
                    {percentile}%
                  </span>{" "}
                  of ranked participants.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 shadow-sm sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 ring-1 ring-amber-100">
                    <FaTrophy />
                  </div>

                  <div>
                    <p className="font-black">Leaderboard not available yet</p>
                    <p className="mt-1">
                      Rank and percentile will be available after the mock test
                      window closes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Accuracy"
              value={formatAccuracy(attempt.accuracy)}
            />
            <MetricCard
              label="Used Time"
              value={formatDuration(attempt.usedSeconds)}
              icon={<FaClock />}
            />
            <MetricCard
              label="Submitted"
              value={formatDateTime(attempt.submittedAt)}
            />
            <MetricCard
              label="Started"
              value={formatDateTime(attempt.startedAt)}
            />
          </div>

          {/* <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniResultCard
              label="Correct"
              value={attempt.correctCount || 0}
              tone="success"
            />
            <MiniResultCard
              label="Wrong"
              value={attempt.wrongCount || 0}
              tone="danger"
            />
            <MiniResultCard
              label="Unattempted"
              value={attempt.unattemptedCount || 0}
              tone="neutral"
            />
          </div> */}

          {leaderboardMockTestId ? (
            <Link
              to={`/mock-tests/${leaderboardMockTestId}/leaderboard`}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-slate-800 sm:w-auto"
            >
              <FaTrophy />
              View Full Leaderboard
            </Link>
          ) : null}
        </div>
      </section>
    </section>
  );
}

function ResultEngagementNudge({ isLoggedIn }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareText =
      "Try UnderSigned for LDCE SO/PS preparation, topic-wise MCQs, previous year questions, and mock tests.";

    try {
      if (navigator.share) {
        await navigator.share({
          title: "UnderSigned LDCE SO/PS Preparation",
          text: shareText,
          url: MOCK_TESTS_URL,
        });
        return;
      }

      await navigator.clipboard.writeText(MOCK_TESTS_URL);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      try {
        await navigator.clipboard.writeText(MOCK_TESTS_URL);
        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch {
        setCopied(false);
      }
    }
  }

  if (isLoggedIn) {
    return (
      <section className="overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-emerald-50 shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
              <FaShareAlt />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-teal-700">
                Help others prepare better
              </p>
              <h2 className="mt-1 text-base font-black text-slate-950 sm:text-lg">
                Share UnderSigned with other LDCE SO/PS aspirants
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                If this mock test helped you assess your preparation, share the
                platform with colleagues who may benefit from topic-wise MCQs,
                previous year questions, and mock test practice.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-black text-teal-800 shadow-sm transition hover:bg-teal-50 sm:w-auto"
          >
            {copied ? <FaCopy /> : <FaShareAlt />}
            {copied ? "Link Copied" : "Share Link"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-700 p-4 text-white sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10">
              <FaBullhorn />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-blue-200">
                Want to improve score?
              </p>
              <h2 className="mt-1 text-lg font-black leading-tight sm:text-xl">
                Use UnderSigned for structured LDCE SO/PS practice
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200">
                Public mock results are available to everyone. For regular
                preparation, UnderSigned provides topic-wise MCQs, previous year
                questions - year and topic wise and progress tracking in one
                place.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:p-5 lg:border-l lg:border-t-0">
          <a
            href={REGISTER_URL}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-teal-800"
          >
            <FaUserPlus />
            Register Free
            <FaExternalLinkAlt className="text-[10px]" />
          </a>

          <a
            href={SUBSCRIBE_URL}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-indigo-800 shadow-sm transition hover:bg-slate-100"
          >
            View Subscription
            <FaExternalLinkAlt className="text-[10px]" />
          </a>

          <p className="text-center text-xs leading-5 text-slate-500">
            Start with free registration. Subscribe when you are ready for full
            preparation access.
          </p>
        </div>
      </div>
    </section>
  );
}

function AnswerReviewSection({ review }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-950">Answer Review</h2>
          <p className="mt-1 text-sm text-slate-500">
            Review your selected answers against the correct answers.
          </p>
        </div>

        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {review.length} questions
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {review.map((item, index) => (
          <ReviewCard
            key={item.question?._id || index}
            item={item}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

function MetricCard({ label, value, icon = null }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          {label}
        </p>
        {icon ? <span className="text-slate-400">{icon}</span> : null}
      </div>
      <p className="mt-2 text-base font-black text-slate-950">{value || "-"}</p>
    </div>
  );
}

function MiniResultCard({ label, value, tone = "neutral" }) {
  const toneClass = {
    success: "border-green-200 bg-green-50 text-green-800",
    danger: "border-red-200 bg-red-50 text-red-800",
    neutral: "border-slate-200 bg-slate-50 text-slate-800",
  };

  return (
    <div className={["rounded-2xl border p-4", toneClass[tone]].join(" ")}>
      <p className="text-xs font-black uppercase tracking-wide opacity-70">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function ReviewCard({ item, index }) {
  const question = item.question;
  const userAnswer = item.userAnswer;

  const selectedIndex =
    userAnswer?.selectedOptionIndex === null ||
    userAnswer?.selectedOptionIndex === undefined
      ? null
      : Number(userAnswer.selectedOptionIndex);

  const correctIndex = Number(question?.correctOptionIndex);
  const isUnattempted = selectedIndex === null;
  const isCorrect = !isUnattempted && selectedIndex === correctIndex;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-white">
            Q{index + 1}
          </span>

          {isUnattempted ? (
            <StatusChip label="Unattempted" tone="neutral" />
          ) : isCorrect ? (
            <StatusChip label="Correct" tone="success" />
          ) : (
            <StatusChip label="Wrong" tone="danger" />
          )}
        </div>
      </div>

      <div className="p-4">
        <p className="whitespace-pre-wrap text-sm font-semibold leading-7 text-slate-950 sm:text-base">
          {question?.questionText}
        </p>

        <div className="mt-4 space-y-2.5">
          {(question?.options || []).map((option, optionIndex) => {
            const optionIsCorrect = optionIndex === correctIndex;
            const optionIsSelected = optionIndex === selectedIndex;

            return (
              <div
                key={`${option.optionText}-${optionIndex}`}
                className={[
                  "rounded-xl border px-3 py-3 text-sm leading-6",
                  optionIsCorrect
                    ? "border-green-300 bg-green-50 text-green-800"
                    : optionIsSelected
                      ? "border-red-300 bg-red-50 text-red-800"
                      : "border-slate-200 bg-slate-50 text-slate-700",
                ].join(" ")}
              >
                <div className="flex items-start gap-2">
                  <span className="font-black">
                    {String.fromCharCode(65 + optionIndex)}.
                  </span>

                  <div className="min-w-0 flex-1">
                    <span>{option.optionText}</span>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {optionIsCorrect ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-black text-green-800">
                          <FaCheckCircle />
                          Correct
                        </span>
                      ) : null}

                      {optionIsSelected ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-black text-red-800">
                          <FaTimesCircle />
                          Selected
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {question?.explanation ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-black uppercase tracking-wide text-amber-700">
              Explanation
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-amber-900">
              {question.explanation}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function StatusChip({ label, tone }) {
  const toneClass = {
    success: "bg-green-50 text-green-700",
    danger: "bg-red-50 text-red-700",
    neutral: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-xs font-black",
        toneClass[tone],
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function TextField({
  label,
  name,
  value,
  error,
  placeholder = "",
  inputMode = "text",
  maxLength,
  onChange,
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <label htmlFor={name} className="text-sm font-bold text-slate-700">
          {label}
        </label>

        {maxLength ? (
          <span className="text-xs font-semibold text-slate-400">
            {String(value || "").length}/{maxLength}
          </span>
        ) : null}
      </div>

      <input
        id={name}
        type="text"
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(event) => onChange(name, event.target.value)}
        className={[
          "w-full rounded-xl border bg-white px-3 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2",
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

function ScoreChip({ label, value }) {
  return (
    <div className="rounded-xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/10">
      <p className="text-[10px] font-black uppercase tracking-wide text-teal-100">
        {label}
      </p>
      <p className="mt-1 text-lg font-black leading-none text-white">{value}</p>
    </div>
  );
}

ScoreChip.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

ResultEngagementNudge.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

ResultLookupForm.propTypes = {
  identity: PropTypes.shape({
    username: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
  }).isRequired,
  fieldErrors: PropTypes.shape({
    username: PropTypes.string,
    mobile: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

ResultSummary.propTypes = {
  result: PropTypes.shape({
    attempt: PropTypes.object,
    mockTest: PropTypes.object,
    username: PropTypes.string,
    review: PropTypes.array,
    rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalParticipants: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    percentile: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    leaderboardAvailable: PropTypes.bool,
  }).isRequired,
};

AnswerReviewSection.propTypes = {
  review: PropTypes.arrayOf(PropTypes.object).isRequired,
};

MetricCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  icon: PropTypes.node,
};

MiniResultCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tone: PropTypes.oneOf(["success", "danger", "neutral"]),
};

ReviewCard.propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.shape({
    question: PropTypes.shape({
      _id: PropTypes.string,
      questionText: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          optionText: PropTypes.string,
        }),
      ),
      correctOptionIndex: PropTypes.number,
      explanation: PropTypes.string,
    }),
    userAnswer: PropTypes.shape({
      selectedOptionIndex: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    }),
  }).isRequired,
};

StatusChip.propTypes = {
  label: PropTypes.string.isRequired,
  tone: PropTypes.oneOf(["success", "danger", "neutral"]).isRequired,
};

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  inputMode: PropTypes.string,
  maxLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default MockResultPage;
