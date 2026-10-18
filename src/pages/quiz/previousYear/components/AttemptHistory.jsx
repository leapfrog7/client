import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { pyq, messageFor } from "../pyqApi";
export default function AttemptHistory({ kind, paperType, topic, onOpen, refresh = 0 }) {
  const [page, setPage] = useState(1), [data, setData] = useState(null), [error, setError] = useState(""), [retry, setRetry] = useState(0);
  useEffect(() => setPage(1), [kind, paperType, topic]);
  useEffect(() => {
    const abort = new AbortController(); setError(""); setData(null);
    pyq.get("/attempts", { params: { kind, paperType: paperType || undefined, topic: topic || undefined, page }, signal: abort.signal })
      .then(setData).catch(e => { if (!abort.signal.aborted) setError(messageFor(e)); });
    return () => abort.abort();
  }, [kind, paperType, topic, page, refresh, retry]);
  return <section className="mt-8 rounded-xl border bg-white p-4 sm:p-6">
    <h2 className="text-xl font-semibold text-slate-800">My PYQ attempts</h2>
    <p className="my-2 text-sm text-slate-600">Compare dated scores and accuracy, or resume unfinished practice. Submitted attempts are kept separately.</p>
    {error && <p role="alert">{error} <button className="underline" onClick={() => setRetry(n => n + 1)}>Retry history</button></p>}
    {!data && !error && <p>Loading attempts...</p>}
    {data?.items.length === 0 && <p className="text-sm text-slate-600">No saved attempts for these filters yet.</p>}
    <div className="space-y-3">{data?.items.map(a => <div key={a._id} className="flex flex-wrap items-center justify-between gap-3 border-t py-3">
      <div><p className="font-semibold">{a.paperType} · {a.topic || "Full paper"} · {a.years.join(", ")}</p>
        <p className="text-sm text-slate-600">{new Date(a.submittedAt || a.createdAt).toLocaleString()} · {a.status === "submitted" ?
          "Score " + a.result.score.toFixed(2) + " · Accuracy " + Math.round(a.result.accuracy) + "% · " + a.result.answered + "/" + a.result.total + " answered" : a.status === "active" ? "In progress" : "Reset"}</p></div>
      {a.status !== "abandoned" && <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white" onClick={() => onOpen(a)}>{a.status === "active" ? "Resume attempt" : "Review result"}</button>}
    </div>)}</div>
    {data && data.pages > 1 && <div className="mt-3 flex justify-center gap-3">
      <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous attempts</button><span>{page} / {data.pages}</span>
      <button disabled={page === data.pages} onClick={() => setPage(p => p + 1)}>More attempts</button>
    </div>}
  </section>;
}
AttemptHistory.propTypes = { kind: PropTypes.string.isRequired, paperType: PropTypes.string, topic: PropTypes.string, onOpen: PropTypes.func.isRequired, refresh: PropTypes.number };
