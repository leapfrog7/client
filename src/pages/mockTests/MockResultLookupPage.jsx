import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MockParticipantAccess from "./MockParticipantAccess";
import { lookupResults } from "./mockPublicApi";
import { formatDateTime, formatScore } from "../Admin/mocks/mockFormatters";
export default function MockResultLookupPage() {
  const [session, setSession] = useState(null), [results, setResults] = useState([]), [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let cancelled = false; setResults([]); setError("");
    if (!session) return;
    setLoading(true);
    lookupResults().then(response => { if (!cancelled) setResults(response.data); }).catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [session]);
  return <main className="min-h-screen bg-slate-50 p-4"><div className="mx-auto max-w-4xl space-y-5">
    <Link to="/mock-tests" className="underline">Back to Mock Tests</Link>
    <h1 className="text-2xl font-black">Find your submitted attempts</h1>
    <MockParticipantAccess onReady={setSession} />
    {error ? <p role="alert" className="text-red-700">{error}</p> : null}
    {loading ? <p>Loading results...</p> : null}
    {session && !loading && !results.length ? <p>No attempts found for this participant.</p> : null}
    {results.map(result => <article key={result.attemptId} className="rounded-xl border bg-white p-4">
      <h2 className="font-bold">{result.mockTest.title}</h2>
      <p>{result.status.replace(/_/g, " ")} · {result.scoreAvailable ? formatScore(result.score) : "Score pending"} · {formatDateTime(result.submittedAt)}</p>
      <Link className="text-teal-800 underline" to={"/mock-tests/" + (result.isFinal || result.submissionPending ? "result/" : "attempt/") + result.attemptId}>{result.isFinal ? "View Result" : "Resume attempt"}</Link>
    </article>)}
  </div></main>;
}
