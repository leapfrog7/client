import PropTypes from "prop-types";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { MdPreview } from "react-icons/md";
import { useMemo } from "react";

export default function QuizResults({
  quizData,
  selectedAnswers,
  finalScore,
  serverResult,
  serverComparison,
  filterView,
  setFilterView,
  flagged,
  showExplanation,
  onToggleExplanation,
  onReviewQuestion,
  onReviewAgain,
  onTakeAnotherQuiz,
}) {
  const totalQuestions = quizData.length;
  const scorePercent = useMemo(() => {
    if (!totalQuestions) return 0;
    return Math.round((finalScore / totalQuestions) * 100);
  }, [finalScore, totalQuestions]);

  const wrongCount = useMemo(() => {
    return quizData.reduce((count, q, i) => {
      return selectedAnswers[i] !== q.correctAnswer ? count + 1 : count;
    }, 0);
  }, [quizData, selectedAnswers]);

  const flaggedCount = useMemo(() => {
    return quizData.reduce((count, q) => {
      return flagged.has(String(q._id)) ? count + 1 : count;
    }, 0);
  }, [quizData, flagged]);

  const filteredResultsIndexes =
    filterView === "all"
      ? quizData.map((_, i) => i)
      : filterView === "wrong"
        ? quizData.reduce((acc, q, i) => {
            if (selectedAnswers[i] !== q.correctAnswer) acc.push(i);
            return acc;
          }, [])
        : quizData.reduce((acc, q, i) => {
            if (flagged.has(String(q._id))) acc.push(i);
            return acc;
          }, []);

  const scoreTone =
    scorePercent >= 70
      ? {
          wrap: "bg-emerald-50 border-emerald-200",
          pill: "bg-emerald-100 text-emerald-800",
          text: "text-emerald-800",
        }
      : scorePercent >= 40
        ? {
            wrap: "bg-amber-50 border-amber-200",
            pill: "bg-amber-100 text-amber-800",
            text: "text-amber-800",
          }
        : {
            wrap: "bg-rose-50 border-rose-200",
            pill: "bg-rose-100 text-rose-800",
            text: "text-rose-800",
          };

  const insightText = useMemo(() => {
    if (!serverComparison || serverComparison?.avgBefore == null) {
      if (scorePercent >= 70) {
        return "Strong attempt. Keep revising weak areas so this level becomes consistent.";
      }
      if (scorePercent >= 40) {
        return "A workable attempt. Review wrong answers carefully to improve retention.";
      }
      return "This attempt needs revision. Focus first on wrong answers and then reattempt the topic.";
    }

    const delta = Number(serverComparison?.deltaFromAvgBefore || 0);

    if (delta > 0) {
      return "You performed better than your previous average. That is a positive sign of improvement.";
    }
    if (delta < 0) {
      return "This attempt was below your previous average. Reviewing mistakes now will help recover quickly.";
    }
    return "This attempt is in line with your previous average. A focused review can help push it higher.";
  }, [serverComparison, scorePercent]);

  return (
    <div className=" my-4 bg-white shadow-sm sm:p-6">
      <div className=" p-4 shadow-sm sm:p-5 mb-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Quiz Results
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Review your performance, compare with your previous average, and
              revisit weak questions.
            </p>
          </div>

          <div
            className={`inline-flex self-start rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm ${scoreTone.pill}`}
          >
            {scorePercent}% Score
          </div>
        </div>

        <div className={`mt-4 rounded-lg border px-4 py-4 ${scoreTone.wrap}`}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Your Result</p>
              <p
                className={`mt-1 text-lg font-bold sm:text-xl ${scoreTone.text}`}
              >
                🎯 {finalScore} / {totalQuestions}
              </p>
            </div>

            <div className="text-sm text-slate-600">
              <span className="font-medium">{wrongCount}</span> wrong or
              unattempted
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-700">{insightText}</p>
        </div>
      </div>

      {serverResult && (
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div
            className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
            title="Percentage score in this submission"
            aria-label="This attempt percentage"
          >
            <div className="text-[11px] font-medium text-slate-500 sm:text-xs">
              This attempt
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-lg font-semibold text-slate-900 sm:text-xl">
                {serverResult.percent}%
              </div>
              <div className="text-[11px] text-slate-500 sm:text-xs">
                ({serverResult.correct}/{serverResult.total})
              </div>
            </div>
          </div>

          <div
            className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
            title="Average of your previous attempts on this topic"
            aria-label="Your average percentage from previous attempts"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] font-medium text-slate-500 sm:text-xs">
                Your average
                <span className="ml-1 hidden sm:inline">(previous)</span>
              </div>

              <span
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-600 sm:text-[11px]"
                title="Number of previous attempts counted in the average"
              >
                {serverComparison?.attemptsBefore ?? 0}×
              </span>
            </div>

            <div className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
              {serverComparison?.avgBefore == null
                ? "—"
                : `${Number(serverComparison.avgBefore).toFixed(1)}%`}
            </div>

            {serverComparison?.avgBefore == null && (
              <div className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                Your average will appear after your next attempt.
              </div>
            )}
          </div>

          <div
            className={`rounded-lg border p-3 shadow-sm sm:p-4 ${
              serverComparison?.avgBefore == null
                ? "border-slate-200 bg-slate-50"
                : serverComparison?.deltaFromAvgBefore > 0
                  ? "border-emerald-200 bg-emerald-50"
                  : serverComparison?.deltaFromAvgBefore < 0
                    ? "border-rose-200 bg-rose-50"
                    : "border-slate-200 bg-slate-50"
            }`}
            title="How this attempt compares to your previous average"
            aria-label="Change versus average"
          >
            <div className="text-[11px] font-medium text-slate-500 sm:text-xs">
              Change vs average
            </div>

            <div className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
              {serverComparison?.avgBefore == null ? (
                <span className="text-slate-700">No past data</span>
              ) : (
                <>
                  {serverComparison.deltaFromAvgBefore > 0
                    ? "▲"
                    : serverComparison.deltaFromAvgBefore < 0
                      ? "▼"
                      : "—"}{" "}
                  {Math.abs(
                    Number(serverComparison.deltaFromAvgBefore || 0),
                  ).toFixed(1)}
                  %
                </>
              )}
            </div>

            {serverComparison?.avgBefore != null && (
              <div className="mt-1 text-[11px] text-slate-600 sm:text-xs">
                {serverComparison.deltaFromAvgBefore > 0
                  ? "Up from your average"
                  : serverComparison.deltaFromAvgBefore < 0
                    ? "Down from your average"
                    : "Same as your average"}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[
          { key: "all", label: `All (${totalQuestions})` },
          { key: "wrong", label: `Wrong (${wrongCount})` },
          { key: "flagged", label: `Flagged (${flaggedCount})` },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterView(f.key)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              filterView === f.key
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredResultsIndexes.map((index) => {
          const question = quizData[index];
          const userAns = selectedAnswers[index];
          const correct = userAns === question.correctAnswer;
          const isFlagged = flagged.has(String(question._id));

          return (
            <div
              key={String(question._id)}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      Question {index + 1}
                    </span>

                    {correct ? (
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        Correct
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
                        Needs Review
                      </span>
                    )}

                    {isFlagged && (
                      <span className="inline-flex rounded-full bg-pink-100 px-2.5 py-1 text-[11px] font-semibold text-pink-700">
                        Flagged
                      </span>
                    )}
                  </div>

                  <p className="font-semibold  text-sm leading-6 text-slate-800">
                    {question.questionText}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div
                  className={`rounded-xl border px-3 py-3 ${
                    correct
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-rose-200 bg-rose-50"
                  }`}
                >
                  <p className="text-xs font-medium text-slate-500">
                    Your Answer
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      correct ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {userAns || "Not Attempted"}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3">
                  <p className="text-xs font-medium text-slate-500">
                    Correct Answer
                  </p>
                  <p className="mt-1  text-sm font-semibold text-emerald-800">
                    {question.correctAnswer}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onToggleExplanation(index)}
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:from-blue-500 hover:to-cyan-500"
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

                <button
                  onClick={() => onReviewQuestion(index)}
                  className="text-sm font-medium text-blue-700 underline underline-offset-2"
                >
                  Review this question
                </button>
              </div>

              {showExplanation[index] && (
                <div className="mt-3 rounded-xl border-l-4 border-blue-400 bg-blue-50 p-3 shadow-inner">
                  <p className="leading-relaxed whitespace-pre-line text-slate-700">
                    <strong className="text-blue-700">Explanation:</strong>{" "}
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          onClick={onReviewAgain}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-indigo-600 hover:to-blue-500"
        >
          <MdPreview className="text-xl" />
          <span>Review Again</span>
        </button>

        <button
          onClick={onTakeAnotherQuiz}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-rose-500 hover:to-pink-500"
        >
          <IoReload className="text-xl" />
          <span>Take Another Quiz</span>
        </button>
      </div>
    </div>
  );
}

QuizResults.propTypes = {
  quizData: PropTypes.array.isRequired,
  selectedAnswers: PropTypes.object.isRequired,
  finalScore: PropTypes.number.isRequired,
  serverResult: PropTypes.object,
  serverComparison: PropTypes.object,
  filterView: PropTypes.string.isRequired,
  setFilterView: PropTypes.func.isRequired,
  flagged: PropTypes.instanceOf(Set).isRequired,
  showExplanation: PropTypes.object.isRequired,
  onToggleExplanation: PropTypes.func.isRequired,
  onReviewQuestion: PropTypes.func.isRequired,
  onReviewAgain: PropTypes.func.isRequired,
  onTakeAnotherQuiz: PropTypes.func.isRequired,
};
