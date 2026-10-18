import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingState from "../../components/mocks/LoadingState";
import MockInfoCard from "../../components/mocks/MockInfoCard";
import MockParticipantAccess from "./MockParticipantAccess";
import { getPublicMockTestById, startOrResumeAttempt } from "./mockPublicApi";
export default function MockTestStartPage() {
  const { mockTestId } = useParams(), navigate = useNavigate();
  const [mockTest, setMockTest] = useState(null), [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true), [starting, setStarting] = useState(false), [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPublicMockTestById(mockTestId).then(response => { if (!cancelled) setMockTest(response.data); })
      .catch(err => { if (!cancelled) setError(err.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [mockTestId]);
  async function start() {
    setStarting(true); setError("");
    try {
      const response = await startOrResumeAttempt(mockTestId), attempt = response.data.attempt;
      navigate("/mock-tests/" + (attempt.isFinal ? "result/" : "attempt/") + attempt._id);
    } catch (err) { setError(err.message); }
    finally { setStarting(false); }
  }
  return <main className="min-h-screen bg-slate-50 px-3 py-6"><div className="mx-auto max-w-4xl space-y-5">
    <Link to="/mock-tests" className="underline">Back to Mock Tests</Link>
    <h1 className="text-2xl font-black">Start or resume your mock test</h1>
    {loading ? <LoadingState message="Loading mock test..." /> : <MockInfoCard mockTest={mockTest} />}
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6">
      The test window is open for 36 hours. Once you start, your {mockTest?.durationMinutes || 30}-minute timer runs continuously, including while you leave, close the page or reconnect. You can recover the same attempt.
      {mockTest?.instructions ? <p className="mt-2 whitespace-pre-wrap">{mockTest.instructions}</p> : null}
    </div>
    <MockParticipantAccess onReady={setSession} />
    {error ? <p role="alert" className="text-red-700">{error}</p> : null}
    <button type="button" onClick={start} disabled={!session || starting || !mockTest || mockTest.computedStatus === "upcoming"}
      className="rounded-xl bg-teal-700 px-5 py-3 font-bold text-white disabled:opacity-50">{starting ? "Starting..." : "Start / Resume Test"}</button>
    <p className="text-sm text-slate-600">One attempt per participant per test. Keep your mock password for later results. A closed test can only recover an existing attempt.</p>
  </div></main>;
}
