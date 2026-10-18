import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageFeedback from "../../../components/PageFeedback";
import AttemptHistory from "./components/AttemptHistory";
import { pyq, messageFor, newRequestKey, attemptQuery } from "./pyqApi";

export default function TopicwisePYQExplorer() {
  const [search, setSearch] = useSearchParams(), navigate = useNavigate();
  const paperType = search.get("paper") || "Paper II", topic = search.get("topic") || "";
  const yearsValue = search.get("years") || "", years = useMemo(() => yearsValue.split(",").filter(Boolean), [yearsValue]);
  const shuffle = search.get("shuffle") !== "false", limit = search.get("limit") || "all";
  const [catalog, setCatalog] = useState(null), [preview, setPreview] = useState(null), [error, setError] = useState("");
  const [catalogError, setCatalogError] = useState(""), [startError, setStartError] = useState("");
  const [loading, setLoading] = useState(false), [starting, setStarting] = useState(false), [retry, setRetry] = useState(0);
  const startRequest = useRef(null), selectionKey = JSON.stringify({ paperType, topic, yearsValue, limit, shuffle });
  const update = values => {
    const next = new URLSearchParams(search);
    for (const [key, value] of Object.entries(values)) { if (!value) next.delete(key); else next.set(key, value); }
    setSearch(next);
  };
  useEffect(() => {
    const abort = new AbortController(); setCatalogError("");
    pyq.get("/catalog", { signal: abort.signal }).then(setCatalog).catch(e => { if (!abort.signal.aborted) setCatalogError(messageFor(e)); });
    return () => abort.abort();
  }, [retry]);
  const papers = useMemo(() => (catalog?.papers || []).filter(p => p.paperType === paperType), [catalog, paperType]);
  const availableYears = [...new Set(papers.map(p => p.year))].sort().reverse();
  const topics = [...new Set(papers.flatMap(p => p.topics))].sort();
  useEffect(() => {
    setPreview(null); setError(""); setStartError("");
    if (!topic) { setLoading(false); return; }
    const abort = new AbortController(); setLoading(true);
    pyq.get("/selection", { params: { paperType, topic, years: yearsValue }, signal: abort.signal })
      .then(data => { if (!abort.signal.aborted) setPreview({ ...data, key: selectionKey }); })
      .catch(e => { if (!abort.signal.aborted) setError(messageFor(e)); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [paperType, topic, yearsValue, selectionKey, retry]);
  useEffect(() => { startRequest.current = null; }, [selectionKey]);
  const canStart = !!catalog && !catalogError && !loading && !starting && !error && preview?.key === selectionKey && preview.count > 0 && !preview.missingYears.length;
  async function start() {
    if (!canStart || starting) return;
    setStarting(true); setStartError("");
    const requestKey = startRequest.current || newRequestKey(); startRequest.current = requestKey;
    try {
      const a = await pyq.post("/attempts", { kind: "topic", requestKey, paperType, topic, years, shuffle, limit });
      navigate("/pages/quiz/pyq/topic/quiz?" + attemptQuery(a));
    } catch (e) { setStartError(messageFor(e)); }
    finally { setStarting(false); }
  }
  return <div className="mx-auto max-w-6xl space-y-6 p-3 sm:p-6">
    <header className="rounded-2xl bg-indigo-50 p-5"><h1 className="text-2xl font-semibold text-indigo-800">Previous Year Questions — Topicwise</h1>
      <p className="mt-2">Choose your paper, topic and exam years. Practice is saved so you can return later.</p></header>
    <section className="space-y-5 rounded-xl border bg-white p-4 sm:p-6">
      <div><p className="mb-2 font-semibold">Select Paper</p><div className="flex gap-3">{["Paper I", "Paper II"].map(p => <button key={p}
        className={"rounded-lg border px-4 py-2 " + (paperType === p ? "bg-indigo-600 text-white" : "")}
        aria-pressed={paperType === p} onClick={() => update({ paper: p, topic: "", years: "" })}>{p}</button>)}</div></div>
      <div><p className="mb-2 font-semibold">Select One Topic</p><div className="flex flex-wrap gap-2">{topics.map(t => <button key={t}
        className={"rounded-full border px-3 py-2 text-sm " + (topic === t ? "bg-indigo-600 text-white" : "")}
        aria-pressed={topic === t} onClick={() => update({ topic: t })}>{t}</button>)}</div>
        {catalog && !topics.length && <p>No categorized questions are available for this paper.</p>}</div>
      <div><p className="mb-2 font-semibold">Exam years — leave blank for all available papers</p><div className="flex flex-wrap gap-2">{availableYears.map(y => <button key={y}
        className={"rounded-lg border px-3 py-2 text-sm " + (years.includes(y) ? "bg-indigo-600 text-white" : "")}
        aria-pressed={years.includes(y)} onClick={() => update({ years: (years.includes(y) ? years.filter(v => v !== y) : [...years, y]).join(",") })}>{y}</button>)}</div>
        <div className="mt-3 flex gap-4"><button className="underline" onClick={() => update({ years: availableYears.slice(0, 5).join(",") })}>Latest 5 papers</button>
          <button className="underline" onClick={() => update({ years: "" })}>All years</button></div></div>
      <div className="flex flex-wrap items-center gap-5">
        <label>Set size <select aria-label="Set size" value={limit} onChange={e => update({ limit: e.target.value })} className="ml-2 rounded border p-2">
          <option value="all">All matching questions</option><option value="20">20 questions</option><option value="40">40 questions</option></select></label>
        <label><input type="checkbox" checked={shuffle} onChange={e => update({ shuffle: String(e.target.checked) })} /> Shuffle question order</label>
      </div>
      {loading && <p role="status">Counting matching questions...</p>}
      {preview?.key === selectionKey && !loading && <p role="status">Found {preview.count} questions for {topic}.
        {!!preview.missingYears.length && <span className="text-red-700"> Unavailable years: {preview.missingYears.join(", ")}. Remove these years before starting.</span>}</p>}
      {(error || catalogError) && <p role="alert" className="text-red-700">{error || catalogError} <button className="underline" onClick={() => setRetry(n => n + 1)}>Retry selection</button></p>}
      {startError && <p role="alert" className="text-red-700">{startError} You can retry starting with the same selection.</p>}
      {!catalog && !catalogError && <p>Loading available papers...</p>}
      <button className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white disabled:opacity-40" disabled={!canStart} onClick={start}>
        {starting ? "Starting..." : "Start Topicwise Quiz"}</button>
      <p className="text-sm text-slate-600">Paid members can download questions, their answers and correct answers from completed results, including saved attempt history. Trial users can practice and review online.</p>
    </section>
    <AttemptHistory kind="topic" paperType={paperType} topic={topic} onOpen={a => navigate("/pages/quiz/pyq/topic/quiz?" + attemptQuery(a))} />
    <PageFeedback pageSlug="/PYQ Topic" />
  </div>;
}
