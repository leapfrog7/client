import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
// import useAuthGuard from "../../../assets/useAuthGuard"

// const BASE_URL = "http://localhost:5000/api/v1/";
const BASE_URL = "https://server-v4dy.onrender.com/api/v1/";
const ALL_YEARS = ["2016-17", "2018", "2019-20", "2021-22", "2023", "2024"];

const getAuthConfig = () => {
  const token = localStorage.getItem("jwtToken");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TopicwisePYQQuiz() {
  const navigate = useNavigate();
  const [search] = useSearchParams();

  const paperType = search.get("paper") || "Paper II";
  const topic = search.get("topic") || "";
  const yearsParam = (search.get("years") || "").split(",").filter(Boolean);
  const shuffle = (search.get("shuffle") || "true") !== "false";
  const years = yearsParam.length ? yearsParam : ALL_YEARS;

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [order, setOrder] = useState([]); // array of indexes into questions
  const [currentIndex, setCurrentIndex] = useState(0); // index into "order" array
  const [answers, setAnswers] = useState({}); // questionId -> selected option
  const [revealed, setRevealed] = useState({}); // questionId -> boolean (show answer)
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch & build the full question set
  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      try {
        const perYear = await Promise.all(
          years.map((y) =>
            axios.get(
              `${BASE_URL}prevYearManagement/questions/${y}/${encodeURIComponent(
                paperType
              )}`,
              getAuthConfig()
            )
          )
        );
        const all = perYear.flatMap((r) =>
          Array.isArray(r.data) ? r.data : []
        );
        const filtered = all.filter((q) => q.topicCategory === topic);

        // dedupe by _id (safety)
        const seen = new Set();
        const deduped = [];
        for (const q of filtered) {
          if (!seen.has(q._id)) {
            seen.add(q._id);
            deduped.push(q);
          }
        }

        const idxs = deduped.map((_, i) => i);
        const finalOrder = shuffle ? shuffleArray(idxs) : idxs;

        if (!cancelled) {
          setQuestions(deduped);
          setOrder(finalOrder);
          setCurrentIndex(0);
          setAnswers({});
          setRevealed({});
          setSubmitted(false);
          setScore(0);
        }
      } catch (e) {
        console.error(e);
        if (e?.response?.status === 401 && !cancelled) {
          alert("Please sign in to take this quiz.");
        }
      }
      if (!cancelled) setLoading(false);
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperType, topic, yearsParam.join(","), shuffle]);

  const total = questions.length;
  const activeQ = useMemo(() => {
    if (!total || !order.length) return null;
    const qIndex = order[currentIndex] ?? 0;
    return questions[qIndex];
  }, [questions, order, currentIndex, total]);

  const selectAnswer = (qid, opt) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: opt }));
  };

  const toggleReveal = (qid) => {
    setRevealed((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const goPrev = () => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  };

  const goNext = () => {
    setCurrentIndex((i) => Math.min(order.length - 1, i + 1));
  };

  const jumpTo = (n) => {
    if (n >= 0 && n < order.length) setCurrentIndex(n);
  };

  const computeScore = () => {
    let s = 0;
    for (const q of questions) {
      const ans = answers[q._id];
      if (!ans || ans === "") continue; // unattempted
      if (ans === q.correctAnswer) s += 1.25;
      else s -= 1 / 3;
    }
    return s;
  };

  const onSubmit = () => {
    const s = computeScore();
    setScore(s);
    setSubmitted(true);
    // Optionally scroll to results area
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onBack = () => {
    navigate(
      `/pages/quiz/pyq/topic?paper=${encodeURIComponent(
        paperType
      )}&topic=${encodeURIComponent(topic)}&years=${encodeURIComponent(
        yearsParam.join(",")
      )}&shuffle=${shuffle ? "true" : "false"}`
    );
  };

  const correctCount = useMemo(() => {
    if (!submitted) return 0;
    return questions.reduce(
      (acc, q) => acc + (answers[q._id] === q.correctAnswer ? 1 : 0),
      0
    );
  }, [submitted, answers, questions]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700">Loading quiz…</p>
        </div>
      </div>
    );
  }

  if (!topic || total === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="mb-4 text-gray-700">
            No questions found for the selected filters. Try different years or
            another topic.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Topic Selection
          </button>
        </div>
      </div>
    );
  }

  // Status helpers for grid styling
  const statusOf = (q) => {
    if (!submitted) {
      return answers[q._id] ? "attempted" : "unattempted";
    }
    return answers[q._id] === q.correctAnswer
      ? "correct"
      : answers[q._id]
      ? "wrong"
      : "unattempted";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Context header + Results (after submit) */}
      <div className="bg-slate-50 rounded-lg shadow p-5">
        <div className="text-center mb-4">
          <span className="text-xl md:text-2xl font-semibold text-indigo-700">
            Previous Year Questions
          </span>
        </div>
        <div className="flex flex-col items-center justify-around gap-2 md:gap-3 rounded-xl  md:p-4">
          <div className="flex gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <span className="text-gray-600">Paper:</span> {paperType}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="text-gray-600">Topic:</span> {topic}
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-100">
            <span className="text-gray-600">Years:</span> {years.join(", ")}
          </span>

          <div className="flex gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium bg-sky-50 text-sky-700 border border-sky-100">
              <span className="text-gray-600">Total Question:</span> {total}
            </span>

            <div className="ml-auto">
              <button
                onClick={onBack}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition"
              >
                Change Filters
              </button>
            </div>
          </div>
        </div>
        {submitted && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm font-medium">
            {/* Score Card (Green/Success Color) */}
            <div className="flex flex-col items-start px-3 py-3 md:px-5 rounded-xl bg-green-50 border border-green-300 shadow-md">
              <span className="text-sm text-green-700 uppercase tracking-wider">
                Total
              </span>
              <strong className="text-base md:text-xl font-bold text-green-800 mt-0.5">
                {score.toFixed(2)}
              </strong>
            </div>

            {/* Correct Count Card (Primary/Indigo Color) */}
            <div className="flex flex-col items-start px-3 py-3 md:px-5 rounded-xl bg-indigo-50 border border-indigo-300 shadow-md">
              <span className="text-sm text-indigo-700 uppercase tracking-wider">
                Correct
              </span>
              <strong className="text-sm md:text-xl font-bold text-indigo-800 mt-0.5">
                {correctCount}{" "}
                <span className="text-base font-normal">/ {total}</span>
              </strong>
            </div>

            {/* Accuracy Card (Neutral/Gray Color) */}
            <div className="flex flex-col items-start px-3 py-3 md:px-5 rounded-xl bg-gray-50 border border-gray-300 shadow-md">
              <span className="text-sm text-gray-700 uppercase tracking-wider">
                Accuracy
              </span>
              <strong className="text-base md:text-xl font-bold text-gray-800 mt-0.5">
                {total ? Math.round((correctCount / total) * 100) : 0}%
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Active Question Card (single-question view) */}
      {activeQ && (
        <section className="relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
          {/* subtle top accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500" />

          <div className="p-5 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <h2 className="text-base md:text-xl font-semibold text-gray-700 leading-snug whitespace-pre-line">
                <span className="text-indigo-600">Q{currentIndex + 1}</span>.{" "}
                {activeQ.questionText}
              </h2>
              <div className="flex items-center gap-3 self-end md:self-auto">
                <span className="text-xs text-gray-500 bg-indigo-50 rounded-full px-4 py-2">
                  Q {currentIndex + 1} / {total}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      ((currentIndex + 1) / Math.max(1, total)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Options */}
            <div className="text-sm md:text-base mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeQ.options.map((opt, i) => {
                const qid = activeQ._id;
                const chosen = answers[qid] ?? "";
                const isSelected = chosen === opt;

                // Show evaluation ONLY if:
                // - user toggled Show Answer for this question, OR
                // - quiz is submitted AND this question was ATTEMPTED
                const attempted = !!answers[qid];
                const showEvaluation =
                  revealed[qid] || (submitted && attempted);

                const isCorrectOpt =
                  showEvaluation && opt === activeQ.correctAnswer;
                const isWrongSel =
                  showEvaluation && isSelected && opt !== activeQ.correctAnswer;

                // Build classes with clear precedence:
                // 1) evaluation states (green/red) override
                // 2) otherwise, show selected state
                // 3) otherwise, neutral/hover
                const base =
                  "group w-full text-left rounded-xl border p-3 md:p-4 transition";
                let tone = "border-gray-300 bg-white hover:bg-gray-50"; // default

                if (showEvaluation) {
                  if (isCorrectOpt) tone = "border-green-600 bg-green-50";
                  else if (isWrongSel) tone = "border-red-600 bg-red-50";
                  else tone = "border-gray-300 bg-white"; // keep neutrals neutral
                } else if (isSelected) {
                  tone =
                    "border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50";
                }

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={submitted}
                    onClick={() => selectAnswer(qid, opt)}
                    className={`${base} ${tone}`}
                  >
                    <span className="text-gray-900">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div>
              {/* 1. Primary Navigation (Previous/Next) - Grouped and Centered */}
              <div className="mt-8 flex justify-center gap-4">
                {/* Navigation Button Group */}
                <div className="flex gap-4">
                  {/* Previous Button (Secondary/Outline Style) */}
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className={`
          px-6 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out
          ${
            currentIndex === 0
              ? "text-gray-400 border border-gray-200 cursor-not-allowed bg-white"
              : "border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200"
          }
        `}
                  >
                    Previous
                  </button>

                  {/* Next Button (Primary/Solid Style) */}
                  <button
                    onClick={goNext}
                    disabled={currentIndex === order.length - 1}
                    className={`
          px-8 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out
          ${
            currentIndex === order.length - 1
              ? "bg-indigo-300 text-white cursor-not-allowed opacity-80" // Lighter disabled indigo
              : "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-lg shadow-indigo-500/30" // Stronger hover/shadow effect
          }
        `}
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* 2. Reveal / Explanation Section - Separated and Enhanced */}
              <div className="mt-8 flex flex-col gap-4 border-t pt-6 border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Show/Hide Button (Promoted to a more distinct, secondary action) */}
                  <button
                    type="button"
                    onClick={() => toggleReveal(activeQ._id)}
                    className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 text-sm font-medium transition-colors"
                  >
                    {revealed[activeQ._id] ? "Hide Answer" : "Show Answer"}
                  </button>

                  {/* Correct Answer Display (Only when revealed or submitted) */}
                  {(revealed[activeQ._id] ||
                    (submitted && !!answers[activeQ._id])) && (
                    <span className="text-base font-medium text-gray-800 bg-green-50 px-3 py-1 rounded-md border border-green-300">
                      Correct Answer:{" "}
                      <strong className="text-green-700">
                        {activeQ.correctAnswer}
                      </strong>
                    </span>
                  )}
                </div>

                {/* Explanation Box (More visually appealing) */}
                {(revealed[activeQ._id] ||
                  (submitted && !!answers[activeQ._id])) &&
                  activeQ.explanation && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 hidden">
                      <strong className="text-blue-900 font-semibold block mb-1">
                        Detailed Explanation:
                      </strong>
                      {activeQ.explanation}
                    </div>
                  )}
              </div>

              {/* 3. Submit/Score Display - Clear Call-to-Action or Summary */}
              <div className="mt-8 mx-auto text-center">
                {!submitted ? (
                  <button
                    onClick={onSubmit}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 rounded-lg bg-emerald-700 text-white text-base md:text-xl font-semibold hover:bg-emerald-700 shadow-md shadow-emerald-500/40 transition-all duration-200"
                  >
                    <span>Submit Quiz & Get Score</span>
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 text-base font-semibold">
                    {/* Score Card */}
                    <span className="px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800">
                      Total Score:{" "}
                      <strong className="text-xl">{score.toFixed(2)}</strong>
                    </span>
                    {/* Correct Count Card */}
                    <span className="px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-300 text-indigo-800">
                      Correct:{" "}
                      <strong className="text-lg">{correctCount}</strong> /{" "}
                      {order.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Question grid */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold p-2 bg-blue-50 rounded-md text-gray-600">
            Question Grid
          </h3>
          {/* {!submitted ? (
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Quiz
            </button>
          ) : (
            <span className="text-sm text-green-700 font-medium">
              Submitted
            </span>
          )} */}
        </div>
        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
          {order.map((idx, n) => {
            const q = questions[idx];
            const status = statusOf(q);
            const isActive = n === currentIndex;

            const base = "text-sm px-2 py-1 rounded border transition";
            const palette = isActive
              ? "border-blue-700 bg-blue-700 text-white"
              : status === "correct"
              ? "border-green-600 bg-green-50 text-green-700"
              : status === "wrong"
              ? "border-red-600 bg-red-50 text-red-700"
              : status === "attempted"
              ? "border-yellow-500 bg-yellow-50 text-yellow-700"
              : "border-gray-300 bg-white text-gray-700";

            return (
              <button
                key={q._id}
                className={`${base} ${palette}`}
                onClick={() => jumpTo(n)}
              >
                {n + 1}
              </button>
            );
          })}
        </div>
        {!submitted && (
          <p className="text-xs text-gray-500 mt-2">
            Colors: attempted (yellow), correct (green), wrong (red). Active
            question is blue. Submit to see correct/wrong status.
          </p>
        )}
      </div>
    </div>
  );
}
