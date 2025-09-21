import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { FiAward, FiTarget, FiClock, FiPieChart } from "react-icons/fi";

const FULL_DURATION = 2 * 60 * 60; // 2h in seconds

const formatTime = (sec) => {
  const s = Math.max(0, Number(sec ?? 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return `${h}h ${m}m ${r}s`;
};

// Small stat card component for a consistent elegant look
function StatCard({ icon, title, value, subtitle, children }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-indigo-50 shadow-sm ring-1 ring-indigo-100">
      {/* Accent blob */}
      <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-indigo-100 opacity-50" />
      <div className="p-4 md:p-5 flex items-start gap-3">
        <div className="shrink-0 mt-1 grid place-items-center h-10 w-10 rounded-xl bg-indigo-600/10 text-indigo-700">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 leading-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.node.isRequired, // e.g. <FiAward />
  title: PropTypes.string.isRequired, // "Score"
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // "72.50" or 72.5
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node, // optional extra content (e.g. progress bar)
};

StatCard.defaultProps = {
  subtitle: null,
  children: null,
};

const EMPTY = Object.freeze([]);

export default function Results({
  questions,
  evaluatedResponses,
  score,
  remainingTime,
  onGoHome,
}) {
  const safeQuestions = useMemo(
    () => (Array.isArray(questions) ? questions : EMPTY),
    [questions]
  );

  const safeResponses = useMemo(
    () => (Array.isArray(evaluatedResponses) ? evaluatedResponses : EMPTY),
    [evaluatedResponses]
  );

  // 🔒 Freeze remainingTime at first render of Results
  const [frozenRemaining] = useState(() =>
    Number(remainingTime ?? FULL_DURATION)
  );
  const timeTaken = useMemo(
    () => Math.max(0, FULL_DURATION - frozenRemaining),
    [frozenRemaining]
  );

  // Quick index
  const qById = useMemo(
    () => new Map(safeQuestions.map((q) => [String(q?._id), q])),
    [safeQuestions]
  );

  // Metrics
  const { correct, wrong, unanswered, attempted, accuracy } = useMemo(() => {
    const c = safeResponses.filter((r) => r?.isCorrect).length;
    const w = safeResponses.filter(
      (r) => r?.userAnswer && !r?.isCorrect
    ).length;
    const totalUnanswered = Math.max(0, safeQuestions.length - (c + w));
    const a = c + w;
    const acc = a ? Math.round((c / a) * 100) : 0;
    return {
      correct: c,
      wrong: w,
      unanswered: totalUnanswered,
      attempted: a,
      accuracy: acc,
    };
  }, [safeResponses, safeQuestions.length]);

  // Filter bar
  const [filter, setFilter] = useState("all"); // all | wrong | unanswered | correct
  const filtered = useMemo(() => {
    switch (filter) {
      case "wrong":
        return safeResponses.filter((r) => r?.userAnswer && !r?.isCorrect);
      case "correct":
        return safeResponses.filter((r) => r?.userAnswer && r?.isCorrect);
      case "unanswered":
        return safeResponses.filter((r) => !r?.userAnswer);
      default:
        return safeResponses;
    }
  }, [safeResponses, filter]);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Quiz Results</h2>

      {/* Elegant summary cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<FiAward />}
          title="Score"
          value={Number(score || 0).toFixed(2)}
          subtitle="+1.25 for correct · −0.33 for wrong"
        />

        <StatCard
          icon={<FiTarget />}
          title="Accuracy"
          value={`${accuracy}%`}
          subtitle={`${correct} correct • ${attempted} attempted`}
        >
          {/* Progress bar */}
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
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
          subtitle={`${Math.round(
            (timeTaken / FULL_DURATION) * 100
          )}% of allotted`}
        />

        <StatCard
          icon={<FiPieChart />}
          title="Breakup"
          value={`${safeQuestions.length} questions`}
        >
          <div className="mt-2 h-2 w-full flex rounded-full overflow-hidden bg-gray-200">
            <div
              className="h-full bg-green-500"
              style={{
                width: `${
                  (correct / Math.max(1, safeQuestions.length)) * 100
                }%`,
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
              className="h-full bg-gray-400"
              style={{
                width: `${
                  (unanswered / Math.max(1, safeQuestions.length)) * 100
                }%`,
              }}
              title="Unanswered"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            <span className="text-green-600 font-semibold">
              {correct} Correct
            </span>
            {" · "}
            <span className="text-red-600 font-semibold">{wrong} Wrong</span>
            {" · "}
            <span className="text-gray-600 font-semibold">
              {unanswered} Unanswered
            </span>
          </p>
        </StatCard>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {["all", "wrong", "unanswered", "correct"].map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-3 py-1 rounded-full border text-sm capitalize transition ${
              filter === k
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Detailed list */}
      <div className="space-y-4">
        {filtered.map((r, i) => {
          const q = qById.get(String(r?.questionId));
          const isUnanswered = !r?.userAnswer;
          const isCorrect = !!r?.isCorrect;

          return (
            <details
              key={String(r?.questionId) || i}
              className={`rounded-xl shadow-sm ring-1 ${
                isUnanswered
                  ? "bg-gray-50 ring-gray-200"
                  : isCorrect
                  ? "bg-green-50 ring-green-100"
                  : "bg-red-50 ring-red-100"
              }`}
            >
              <summary className="cursor-pointer p-4 flex items-start justify-between">
                <div className="pr-4">
                  <h3 className="font-semibold mb-1">
                    Q{i + 1}. {q ? q.questionText : "Question text not found"}
                  </h3>
                  <p className="text-sm">
                    <span className="font-semibold">Your Answer:</span>{" "}
                    <span
                      className={
                        isUnanswered
                          ? "text-gray-800"
                          : isCorrect
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {r?.userAnswer || "Unanswered"}
                    </span>
                    {" · "}
                    <span className="font-semibold">Correct:</span>{" "}
                    <span className="text-green-700">
                      {r?.correctAnswer || "—"}
                    </span>
                  </p>
                </div>
                <span
                  className={`mt-1 shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
                    isUnanswered
                      ? "bg-gray-300 text-gray-900"
                      : isCorrect
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {isUnanswered
                    ? "Unanswered"
                    : isCorrect
                    ? "Correct"
                    : "Wrong"}
                </span>
              </summary>

              {/* Expanded detail */}
              <div className="px-4 pb-4 pt-2 text-sm">
                {Array.isArray(q?.options) && (
                  <ul className="mt-2 grid sm:grid-cols-2 gap-2">
                    {q.options.map((opt, idx) => {
                      const chosen = r?.userAnswer === opt;
                      const correctOpt = r?.correctAnswer === opt;
                      return (
                        <li
                          key={idx}
                          className={`p-2 border rounded ${
                            correctOpt
                              ? "border-green-500 bg-green-50"
                              : chosen
                              ? "border-red-400 bg-red-50"
                              : "bg-white"
                          }`}
                        >
                          {opt}
                        </li>
                      );
                    })}
                  </ul>
                )}
                {q?.explanation && (
                  <p className="bg-white rounded p-3 border mt-3">
                    <span className="font-semibold">Explanation:</span>{" "}
                    {q.explanation}
                  </p>
                )}
              </div>
            </details>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        {/* {typeof onRetake === "function" && (
          <button
            className="px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            onClick={onRetake}
          >
            Retake This Paper
          </button>
        )} */}
        <button
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          onClick={onGoHome}
        >
          Go to Home
        </button>
        <button
          className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-black"
          onClick={() => window.print()}
        >
          Download as PDF
        </button>
      </div>
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
        PropTypes.oneOfType([PropTypes.string, PropTypes.object])
      ),
      explanation: PropTypes.string,
      topic: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    })
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
    })
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
