import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Results from "./Results";
import PaperListTable from "./components/PaperListTable";
import AttemptHistory from "./components/AttemptHistory";
import PYQAttemptView from "./components/PYQAttemptView";
import { getUserIdFromToken } from "../../../util/decodeJWT";
import { pyq, messageFor, newRequestKey, attemptQuery } from "./pyqApi";
export default function Exam() {
  const [search] = useSearchParams(), navigate = useNavigate(), id = search.get("attempt");
  const [papers, setPapers] = useState([]), [error, setError] = useState(""), [busy, setBusy] = useState(false), [legacy, setLegacy] = useState(null);
  const [refresh, setRefresh] = useState(0), requestKeys = useRef(new Map()), mounted = useRef(true);
  const fetchPapers = useCallback(async () => { try { const data = await pyq.get("/available-papers"); if (mounted.current) setPapers(data); }
    catch (e) { if (mounted.current) setError(messageFor(e)); } }, []);
  useEffect(() => { mounted.current = true; if (!id) fetchPapers(); return () => { mounted.current = false; }; }, [id, fetchPapers]);
  const open = a => { setLegacy(null); navigate(a.kind === "topic" ? "/pages/quiz/pyq/topic/quiz?" + attemptQuery(a) : "?attempt=" + a._id); };
  async function start(paper, resume = false) {
    if (busy) return; setBusy(true); setError("");
    try {
      if (resume && paper.activeAttemptId) return open({ _id: paper.activeAttemptId });
      if (resume) return open(await pyq.post("/import-legacy/" + paper._id, {}));
      const requestKey = requestKeys.current.get(paper._id) || newRequestKey(); requestKeys.current.set(paper._id, requestKey);
      const next = await pyq.post("/attempts", { kind: "paper", paperId: paper._id, requestKey });
      requestKeys.current.delete(paper._id); open(next);
    } catch (e) { setError(messageFor(e)); } finally { setBusy(false); }
  }
  async function view(paper) {
    if (paper.latestAttemptId) return open({ _id: paper.latestAttemptId });
    setError("");
    try { setLegacy(await pyq.get("/latest-result/" + getUserIdFromToken() + "/" + paper._id)); }
    catch (e) { setError(messageFor(e)); }
  }
  const exit = () => { setLegacy(null); navigate("/pages/quiz/previousYear/Exam"); setRefresh(n => n + 1); fetchPapers(); };
  if (id) return <PYQAttemptView key={id} id={id} onExit={exit} onOpen={open} />;
  if (legacy) return <Results questions={legacy.paper.questions} evaluatedResponses={legacy.result.evaluatedResponses} score={legacy.result.score}
    remainingTime={legacy.result.remainingTime} usedSeconds={legacy.result.usedSeconds ?? null} durationSeconds={7200}
    contextCaption={[legacy.paper.paperType, legacy.paper.year].join(" · ")} submittedAt={legacy.result.submittedAt} onGoHome={exit} resultKind="paper" exportPath={"/latest-result/" + getUserIdFromToken() + "/" + legacy.paper._id + "/export"} />;
  return <div className="p-2 sm:p-6">
    {error && <p role="alert" className="my-3 rounded border border-red-300 p-3">{error} <button className="underline" onClick={() => { setError(""); fetchPapers(); }}>Retry papers</button></p>}
    {busy && <p role="status">Opening saved practice...</p>}
    <fieldset disabled={busy} className="min-w-0"><PaperListTable filteredPapers={papers} onStart={p => start(p)} onResume={p => start(p, true)}
      onViewResult={view} onResetTimer={async paperId => {
        try { await pyq.post("/exam-sessions/" + getUserIdFromToken() + "/" + paperId + "/reset-timer", {}); await fetchPapers(); setRefresh(n => n + 1); }
        catch (e) { setError(messageFor(e)); }
      }} /></fieldset>
    <AttemptHistory kind="paper" refresh={refresh} onOpen={open} />
  </div>;
}
