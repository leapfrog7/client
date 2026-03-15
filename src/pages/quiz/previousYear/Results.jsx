import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { FiAward, FiTarget, FiClock, FiPieChart } from "react-icons/fi";
import {
  FaHome,
  FaFilePdf,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const FULL_DURATION = 2 * 60 * 60;
const PAGE_SIZE = 12;

const formatTime = (sec) => {
  const s = Math.max(0, Number(sec ?? 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return `${h}h ${m}m ${r}s`;
};

function StatCard({ icon, title, value, subtitle, children }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-sm ring-1 ring-slate-200">
      <div className="p-3 sm:p-4 flex items-start gap-3">
        <div className="shrink-0 mt-0.5 grid place-items-center h-9 w-9 rounded-xl bg-indigo-600/10 text-indigo-700">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 leading-tight mt-0.5">
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
};

StatCard.defaultProps = {
  subtitle: null,
  children: null,
};

const EMPTY = Object.freeze([]);

const isAnswered = (r) => {
  if (!r) return false;
  const ua = r.userAnswer;
  if (ua === null || ua === undefined) return false;
  if (typeof ua === "string" && ua.trim() === "") return false;
  return true;
};

export default function Results({
  questions,
  evaluatedResponses,
  score,
  remainingTime,
  onGoHome,
  onRetake,
}) {
  const safeQuestions = useMemo(
    () => (Array.isArray(questions) ? questions : EMPTY),
    [questions],
  );

  const safeResponses = useMemo(
    () => (Array.isArray(evaluatedResponses) ? evaluatedResponses : EMPTY),
    [evaluatedResponses],
  );

  const frozenRemaining = useMemo(
    () => Number(remainingTime ?? FULL_DURATION),
    [remainingTime],
  );

  const timeTaken = useMemo(
    () => Math.max(0, FULL_DURATION - frozenRemaining),
    [frozenRemaining],
  );

  const qById = useMemo(
    () =>
      new Map(
        safeQuestions.map((q, idx) => [String(q?._id), { ...q, __index: idx }]),
      ),
    [safeQuestions],
  );

  const respByQid = useMemo(() => {
    const m = new Map();
    for (const r of safeResponses) {
      m.set(String(r?.questionId), r);
    }
    return m;
  }, [safeResponses]);

  const fullResponses = useMemo(() => {
    return safeQuestions.map((q, idx) => {
      const qid = String(q?._id);
      const found = respByQid.get(qid);
      if (found) return { ...found, __index: idx };
      return {
        questionId: qid,
        userAnswer: null,
        isCorrect: false,
        correctAnswer: q?.correctAnswer,
        __synthetic: true,
        __index: idx,
      };
    });
  }, [safeQuestions, respByQid]);

  const { correct, wrong, unanswered, attempted, accuracy } = useMemo(() => {
    const c = fullResponses.filter((r) => isAnswered(r) && r.isCorrect).length;
    const w = fullResponses.filter((r) => isAnswered(r) && !r.isCorrect).length;
    const a = c + w;
    const totalUnanswered = Math.max(0, safeQuestions.length - a);
    const acc = a ? Math.round((c / a) * 100) : 0;
    return {
      correct: c,
      wrong: w,
      unanswered: totalUnanswered,
      attempted: a,
      accuracy: acc,
    };
  }, [fullResponses, safeQuestions.length]);

  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  const filtered = useMemo(() => {
    switch (filter) {
      case "wrong":
        return fullResponses.filter((r) => isAnswered(r) && !r.isCorrect);
      case "correct":
        return fullResponses.filter((r) => isAnswered(r) && r.isCorrect);
      case "unanswered":
        return fullResponses.filter((r) => !isAnswered(r));
      default:
        return fullResponses;
    }
  }, [fullResponses, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const scorePercent = useMemo(() => {
    if (!safeQuestions.length) return 0;
    return Math.round((correct / safeQuestions.length) * 100);
  }, [correct, safeQuestions.length]);

  const insightText = useMemo(() => {
    if (scorePercent >= 75) {
      return "Strong attempt. Focus on the few mistakes and maintain consistency.";
    }
    if (scorePercent >= 50) {
      return "A decent attempt. Reviewing wrong and unattempted questions will improve your next score.";
    }
    return "This paper needs a careful review. Start with wrong answers, then revisit unattempted questions.";
  }, [scorePercent]);

  const handleFilterChange = (nextFilter) => {
    setFilter(nextFilter);
    setPage(1);
  };

  const handleDownloadPDF = async () => {
    setIsPrinting(true);

    setTimeout(() => {
      window.print();

      setTimeout(() => {
        setIsPrinting(false);
      }, 300);
    }, 250);
  };

  return (
    <div className="px-4 md:px-12 mt-4 sm:mt-6">
      {/* Top actions */}
      <div className="mb-4 text-center md:text-left flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Quiz Results
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Review your performance and revisit weak areas.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
            onClick={onGoHome}
          >
            <FaHome className="text-sm" />
            See All PYQs
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-black"
            onClick={handleDownloadPDF}
          >
            <FaFilePdf className="text-sm" />
            Save/Print Results
          </button>

          {typeof onRetake === "function" && (
            <button
              className="hidden rounded-xl bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-pink-700"
              onClick={onRetake}
            >
              Retake
            </button>
          )}
        </div>
      </div>

      {/* Summary hero */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-gradient-to-tl from-yellow-50 via-white to-rose-50 p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Your Score: {Number(score || 0).toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {correct} correct · {wrong} wrong · {unanswered} unanswered
            </p>
          </div>

          <div
            className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-semibold ${
              scorePercent >= 75
                ? "bg-emerald-100 text-emerald-700"
                : scorePercent >= 50
                  ? "bg-amber-100 text-amber-700"
                  : "bg-rose-100 text-rose-700"
            }`}
          >
            {scorePercent}% correct
          </div>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-700">{insightText}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-5">
        <StatCard
          icon={<FiAward />}
          title="Score"
          value={Number(score || 0).toFixed(2)}
          subtitle="+1.25 correct · −0.33 wrong"
        />

        <StatCard
          icon={<FiTarget />}
          title="Accuracy"
          value={`${accuracy}%`}
          subtitle={`${correct} correct · ${attempted} attempted`}
        >
          <div className="mt-2 h-2 w-full rounded-full overflow-hidden bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-600"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </StatCard>

        <StatCard
          icon={<FiClock />}
          title="Time Taken"
          value={formatTime(timeTaken)}
          subtitle={`${Math.round((timeTaken / FULL_DURATION) * 100)}% of allotted`}
        />

        <StatCard
          icon={<FiPieChart />}
          title="Breakup"
          value={`${safeQuestions.length} questions`}
        >
          <div className="mt-2 h-2 w-full flex rounded-full overflow-hidden bg-slate-200">
            <div
              className="h-full bg-green-500"
              style={{
                width: `${(correct / Math.max(1, safeQuestions.length)) * 100}%`,
              }}
              title="Correct"
            />
            <div
              className="h-full bg-red-500"
              style={{
                width: `${(wrong / Math.max(1, safeQuestions.length)) * 100}%`,
              }}
              title="Wrong"
            />
            <div
              className="h-full bg-slate-400"
              style={{
                width: `${(unanswered / Math.max(1, safeQuestions.length)) * 100}%`,
              }}
              title="Unanswered"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            <span className="text-green-600 font-semibold">
              {correct} Correct
            </span>
            {" · "}
            <span className="text-red-600 font-semibold">{wrong} Wrong</span>
            {" · "}
            <span className="text-slate-600 font-semibold">
              {unanswered} Unanswered
            </span>
          </p>
        </StatCard>
      </div>

      {/* Filter + pagination header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: `All (${fullResponses.length})` },
            { key: "wrong", label: `Wrong (${wrong})` },
            { key: "unanswered", label: `Unanswered (${unanswered})` },
            { key: "correct", label: `Correct (${correct})` },
          ].map((k) => (
            <button
              key={k.key}
              onClick={() => handleFilterChange(k.key)}
              className={`px-3 py-1.5 rounded-full border text-xs sm:text-sm font-medium capitalize transition ${
                filter === k.key
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <FaChevronLeft />
            </button>

            <span className="text-xs sm:text-sm font-medium text-slate-600">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Detailed list */}
      <div className="space-y-3">
        {(isPrinting ? filtered : paginated).map((r) => {
          const q = qById.get(String(r?.questionId));
          const unansweredRow = !isAnswered(r);
          const correctRow = !!r?.isCorrect;
          const questionNumber = (q?.__index ?? r?.__index ?? 0) + 1;

          return (
            <details
              key={String(r?.questionId)}
              className={`rounded-xl shadow-sm ring-1 ${
                unansweredRow
                  ? "bg-slate-50 ring-slate-200"
                  : correctRow
                    ? "bg-green-50 ring-green-100"
                    : "bg-rose-50 ring-rose-100"
              }`}
            >
              <summary className="cursor-pointer p-3 sm:p-4 flex items-start justify-between gap-3">
                <div className="min-w-0 pr-2">
                  <h3 className="font-semibold text-sm sm:text-base text-slate-800 leading-6">
                    Q{questionNumber}.{" "}
                    {q ? q.questionText : "Question text not found"}
                  </h3>

                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-5">
                    <span className="font-semibold">Your Answer:</span>{" "}
                    <span
                      className={
                        unansweredRow
                          ? "text-slate-700"
                          : correctRow
                            ? "text-green-700"
                            : "text-rose-700"
                      }
                    >
                      {unansweredRow ? "Unanswered" : String(r?.userAnswer)}
                    </span>
                    {" · "}
                    <span className="font-semibold">Correct:</span>{" "}
                    <span className="text-green-700">
                      {r?.correctAnswer ?? q?.correctAnswer ?? "—"}
                    </span>
                  </p>
                </div>

                <span
                  className={`mt-0.5 shrink-0 rounded-full px-2 py-1 text-[10px] sm:text-xs font-semibold ${
                    unansweredRow
                      ? "bg-slate-300 text-slate-900"
                      : correctRow
                        ? "bg-green-600 text-white"
                        : "bg-rose-600 text-white"
                  }`}
                >
                  {unansweredRow
                    ? "Unanswered"
                    : correctRow
                      ? "Correct"
                      : "Wrong"}
                </span>
              </summary>

              <div className="px-3 pb-3 pt-1 sm:px-4 sm:pb-4 sm:pt-2 text-sm">
                {Array.isArray(q?.options) && (
                  <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt, idx) => {
                      const chosen = !unansweredRow && r?.userAnswer === opt;
                      const correctOpt =
                        (r?.correctAnswer ?? q?.correctAnswer) === opt;

                      return (
                        <li
                          key={idx}
                          className={`rounded-lg border p-2 text-xs sm:text-sm leading-5 ${
                            correctOpt
                              ? "border-green-500 bg-green-50"
                              : chosen
                                ? "border-rose-400 bg-rose-50"
                                : "bg-white border-slate-200"
                          }`}
                        >
                          {String(opt)}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {q?.explanation && (
                  <p className="mt-3 rounded-lg border bg-white p-3 text-xs sm:text-sm leading-6 text-slate-700">
                    <span className="font-semibold text-slate-800">
                      Explanation:
                    </span>{" "}
                    {q.explanation}
                  </p>
                )}
              </div>
            </details>
          );
        })}
      </div>

      {/* Bottom pagination repeat for convenience */}
      {totalPages > 1 && !isPrinting && (
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            <FaChevronLeft />
          </button>

          <span className="text-xs sm:text-sm font-medium text-slate-600">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

Results.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object,
      ]).isRequired,
      questionText: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      ),
      explanation: PropTypes.string,
      correctAnswer: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object,
      ]),
      topic: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }),
  ),
  evaluatedResponses: PropTypes.arrayOf(
    PropTypes.shape({
      questionId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object,
      ]).isRequired,
      userAnswer: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.object,
      ]),
      isCorrect: PropTypes.bool,
      correctAnswer: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object,
      ]),
    }),
  ),
  score: PropTypes.number,
  remainingTime: PropTypes.number,
  onGoHome: PropTypes.func.isRequired,
  onRetake: PropTypes.func,
};

Results.defaultProps = {
  questions: [],
  evaluatedResponses: [],
  score: 0,
  remainingTime: FULL_DURATION,
  onRetake: undefined,
};
