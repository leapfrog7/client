import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageFeedback from "../../../components/PageFeedback";
// import useAuthGuard from "../../../../src/assets/useAuthGuard";

// const BASE_URL = "http://localhost:5000/api/v1/";
const BASE_URL = "https://server-v4dy.onrender.com/api/v1/";

// Keep these aligned with your admin’s hardcoded list
const TOPIC_OPTIONS = {
  "Paper I": [
    "Constitution",
    "AoBR",
    "RTI Act",

    "Parliamentary Procedure",
    "Current Affairs",
    "General Studies",
    "Economy",
    "Govt Schemes",
  ],
  "Paper II": [
    "FR-SR",
    "Leave Rules",
    "Pension Rules",
    "CCA Rules",
    "Conduct Rules",
    "LTC Rules",
    "Office Procedure (CSMOP)",
    "Travelling Allowance",
    "GFR",
    "NPS",
    "DFPR",
    "Misc. Allowances",
    "Parliamentary Procedure",
    "Others",
  ],
};

// Use the same labels you use on admin (order preserved)
const ALL_YEARS = ["2016-17", "2018", "2019-20", "2021-22", "2023", "2024"];

function useQueryStateSync() {
  const [search, setSearch] = useSearchParams();
  const get = (key, fallback) => search.get(key) ?? fallback;
  const set = (updates) => {
    const sp = new URLSearchParams(search);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") sp.delete(k);
      else sp.set(k, v);
    });
    setSearch(sp, { replace: true });
  };
  return { get, set };
}

export default function TopicwisePYQExplorer() {
  const navigate = useNavigate();
  const { get, set } = useQueryStateSync();
  // useAuthGuard();

  // URL-backed state (so links are shareable)
  const [paperType, setPaperType] = useState(get("paper") || "Paper II");
  const [topic, setTopic] = useState(get("topic") || "");
  const [selectedYears, setSelectedYears] = useState(
    (get("years") || "").split(",").filter(Boolean)
  );
  const [shuffle, setShuffle] = useState(get("shuffle") !== "false"); // default true
  const [loading, setLoading] = useState(false);
  const [previewCount, setPreviewCount] = useState(0);
  const [previewSample, setPreviewSample] = useState([]); // small peek of items
  const [error, setError] = useState("");

  // keep query in sync when user changes anything
  useEffect(() => {
    set({
      paper: paperType,
      topic: topic || undefined,
      years: selectedYears.length ? selectedYears.join(",") : undefined,
      shuffle: String(shuffle),
    });
  }, [paperType, topic, selectedYears, shuffle]);

  const getAuthConfig = () => {
    const token = localStorage.getItem("jwtToken");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // if your server requires auth, unauthenticated users will still get 401
  };

  // Helper: fetch questions for a year+paper
  const fetchQuestionsForYear = async (year) => {
    const resp = await axios.get(
      `${BASE_URL}prevYearManagement/questions/${year}/${encodeURIComponent(
        paperType
      )}`,
      getAuthConfig()
    );
    return Array.isArray(resp.data) ? resp.data : [];
  };

  // Merge + filter client-side (fast enough for your scale)
  const computePreview = async () => {
    setError("");
    if (!topic) {
      setPreviewCount(0);
      setPreviewSample([]);
      return;
    }
    const years = selectedYears.length ? selectedYears : ALL_YEARS;
    setLoading(true);
    try {
      const all = (await Promise.all(years.map(fetchQuestionsForYear))).flat();
      const filtered = all.filter((q) => q.topicCategory === topic);
      // Dedupe by _id (safety)
      const seen = new Set();
      const deduped = [];
      for (const q of filtered) {
        if (!seen.has(q._id)) {
          seen.add(q._id);
          deduped.push(q);
        }
      }
      setPreviewCount(deduped.length);
      setPreviewSample(deduped.slice(0, 3)); // show a tiny peek
    } catch (e) {
      console.error(e);
      if (e?.response?.status === 401) {
        setError("You need to sign in to load questions.");
      } else {
        setError("Failed to load preview. Please try again.");
      }
      setPreviewCount(0);
      setPreviewSample([]);
    }
    setLoading(false);
  };

  // Recompute preview whenever inputs change
  useEffect(() => {
    computePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperType, topic, selectedYears]);

  const toggleYear = (y) => {
    setSelectedYears((prev) =>
      prev.includes(y) ? prev.filter((v) => v !== y) : [...prev, y]
    );
  };

  const selectLastFive = () => {
    // For your labels, treat "last five" as the most recent 5 items in ALL_YEARS order
    const last5 = ALL_YEARS.slice(-5);
    setSelectedYears(last5);
  };

  const clearYears = () => setSelectedYears([]);

  const canStart = !!topic && previewCount > 0;

  const startQuiz = () => {
    // Navigate with current selections; quiz page will fetch questions again (so direct links work)
    navigate(
      `/pages/quiz/pyq/topic/quiz?paper=${encodeURIComponent(
        paperType
      )}&topic=${encodeURIComponent(topic)}&years=${encodeURIComponent(
        selectedYears.join(",")
      )}&shuffle=${shuffle ? "true" : "false"}`
    );
  };

  const topicOptions = useMemo(
    () => TOPIC_OPTIONS[paperType] || [],
    [paperType]
  );

  return (
    <div className=" w-full md:w-11/12 mx-auto p-6">
      {/* Hero / Context */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-100 to-indigo-200 text-gray-600 shadow-lg">
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-indigo-700">
            Previous Year Questions — Topicwise
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl text-base">
            Select paper, topic, and years to generate a focused, full-length
            practice set.
          </p>

          {/* Quick chips (context) */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="px-2.5 py-1 rounded-full bg-indigo-700 text-white backdrop-blur ring-1 ring-white/20 ">
              Paper:&nbsp;<b>{paperType}</b>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-700 text-white backdrop-blur ring-1 ring-white/20">
              Topic:&nbsp;<b>{topic || "—"}</b>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-700 text-white backdrop-blur ring-1 ring-white/20">
              Years:&nbsp;
              <b>{selectedYears.length ? selectedYears.join(", ") : "All"}</b>
            </span>
          </div>
        </div>

        {/* subtle decorative blobs */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Builder Card */}
      <div className=" w-full mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Controls */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl shadow p-6 space-y-6">
            {/* Paper & Topic */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {/* Paper */}
              <div>
                <label className="block mb-1 font-bold text-gray-800">
                  Select Paper
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Paper I", "Paper II"].map((p) => {
                    const active = p === paperType;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setPaperType(p);
                          setTopic("");
                        }}
                        className={`px-3 py-2 rounded-lg border text-sm transition ${
                          active
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Switch papers to see relevant topics.
                </p>
              </div>

              {/* Topic */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold bg-blue-50 rounded-md p-2 text-gray-800">
                  Select One Topic
                </label>
                <div className="relative hidden">
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full appearance-none p-3 pr-10 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">— Select Topic —</option>
                    {topicOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▾
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {/* Quick topic chips to encourage exploration */}
                  {topicOptions.slice(0, 14).map((t) => {
                    const active = topic === t;
                    return (
                      <button
                        key={`chip-${t}`}
                        type="button"
                        onClick={() => setTopic(t)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition ${
                          active
                            ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Years */}
            <div>
              <div className="flex items-center justify-between font-semibold mb-2 bg-blue-50 rounded-md p-2">
                <label className="block mb-2 font-semibold text-gray-800">
                  Years (optional)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectLastFive}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
                    title="Pick the most recent five sets"
                  >
                    Last 5 years
                  </button>
                  <button
                    type="button"
                    onClick={clearYears}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {ALL_YEARS.map((y) => {
                  const active = selectedYears.includes(y);
                  return (
                    <button
                      type="button"
                      key={y}
                      onClick={() => toggleYear(y)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                        active
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Leave blank to include <b>all available years</b>.
              </p>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={shuffle}
                  onChange={(e) => setShuffle(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Shuffle question order
              </label>
              {/* lightweight tip */}
              <span className="text-xs text-gray-500">
                Tip: Shuffle to avoid memorizing positions.
              </span>
            </div>

            {/* Preview & CTA */}
            <div className="border-t pt-4">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : topic ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 text-indigo-700 px-3 py-1.5 ring-1 ring-indigo-200">
                      <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
                      <span className="text-sm">
                        Found <b>{previewCount}</b> question
                        {previewCount === 1 ? "" : "s"} for <b>{topic}</b>{" "}
                        {selectedYears.length ? (
                          <>
                            in <em>{selectedYears.join(", ")}</em>
                          </>
                        ) : (
                          <>across all years</>
                        )}
                        .
                      </span>
                    </div>
                  </div>

                  {!!previewSample.length && (
                    <div className="rounded-lg bg-gray-50 p-3 hidden">
                      <p className="text-xs text-gray-500 mb-2">
                        Sample preview:
                      </p>
                      <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                        {previewSample.map((q) => (
                          <li key={q._id} className="line-clamp-2">
                            {q.questionText}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">
                  Choose a topic to preview matching PYQs.
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={startQuiz}
                  disabled={!canStart}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm transition ${
                    canStart
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-gray-200 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <span>Start Topicwise Quiz</span>
                  {canStart && (
                    <span className="px-2 py-0.5 text-xs rounded bg-emerald-50 text-emerald-700">
                      {previewCount}
                    </span>
                  )}
                </button>

                {/* Secondary CTA: learning-oriented copy */}
                <span className="text-sm text-gray-500">
                  You’ll attempt the full set in a focused, single-question view
                  with explanations after submission.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Side panel: Value framing / Guidance */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow p-6 space-y-4 sticky top-6 hidden">
            <h3 className="font-semibold text-gray-900">Why PYQs matter</h3>
            <p className="text-sm text-gray-600">
              Patterns repeat. Practising topicwise helps you internalize
              question styles, eliminate surprises, and improve time management.
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                Targeted practice by syllabus theme.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                Optional year filters to focus on recency.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                Shuffle to avoid positional bias.
              </li>
            </ul>
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">
                Pro tip: Start with last 5 years, then broaden.
              </p>
            </div>
          </div>
        </aside>
      </div>
      <PageFeedback pageSlug="/PYQ Topic" />
    </div>
  );
}
