import useMockWindowRefresh from "./useMockWindowRefresh";
import { clearMockSession } from "./mockSession";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingState from "../../components/mocks/LoadingState";
import MockInfoCard from "../../components/mocks/MockInfoCard";
import MockParticipantAccess from "./MockParticipantAccess";
import { getPublicMockTestById, startOrResumeAttempt } from "./mockPublicApi";
export default function MockTestStartPage() {
  const { mockTestId } = useParams(), navigate = useNavigate();
  const [accessKey, setAccessKey] = useState(0), [windowResponse, setWindowResponse] = useState(null);
  const [mockTest, setMockTest] = useState(null), [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true), [starting, setStarting] = useState(false), [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(""); setMockTest(null);
    getPublicMockTestById(mockTestId).then(response => { if (!cancelled) { setMockTest(response.data); setWindowResponse(response); } })
      .catch(err => { if (!cancelled) setError(err.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [mockTestId, refresh]);
  const windowTests = useMemo(() => mockTest ? [mockTest] : [], [mockTest]);
  const [clockNow, setClockNow] = useState(Date.now);
  useEffect(() => { const timer = setInterval(() => setClockNow(Date.now()), 15000); return () => clearInterval(timer); }, []);
  useMockWindowRefresh(windowTests, windowResponse, async () => {
    try { const response = await getPublicMockTestById(mockTestId); setMockTest(response.data); setWindowResponse(response); setError(""); }
    catch (err) { setError(err.message); }
  });
  const windowMinutes = mockTest && windowResponse ? Math.max(0, Math.floor((Date.parse(mockTest.endAt) - ((Date.parse(windowResponse.serverNow) || clockNow) + Math.max(0, clockNow - (windowResponse.requestTiming?.wallStartedAt ?? clockNow)))) / 60000)) : null;
  async function start() {
    setStarting(true); setError("");
    try {
      const response = await startOrResumeAttempt(mockTestId), attempt = response.data.attempt;
      navigate("/mock-tests/" + (attempt.isFinal ? "result/" : "attempt/") + attempt._id);
    } catch (err) { setError(err.message); if (err.code === "MOCK_SESSION_EXPIRING" || err.code === "MOCK_SESSION_REQUIRED") { clearMockSession(); setSession(null); setAccessKey(key => key + 1); } }
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
    {mockTest?.computedStatus === "active" && windowMinutes < mockTest.durationMinutes ? <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm">Late start: the test window closes in about {windowMinutes} minutes. Your attempt ends when the window closes, even if your full {mockTest.durationMinutes} minutes have not elapsed.</p> : null}
    <MockParticipantAccess key={accessKey} onReady={setSession} />
    {error ? <p role="alert" className="text-red-700">{error}</p> : null}
    <button type="button" disabled={loading || starting} onClick={() => setRefresh(value => value + 1)} className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Refresh test status</button>
    <button type="button" onClick={start} disabled={!session || starting || !mockTest || mockTest.computedStatus === "upcoming"}
      className="rounded-xl bg-teal-700 px-5 py-3 font-bold text-white disabled:opacity-50">{starting ? "Starting..." : "Start / Resume Test"}</button>
    <p className="text-sm text-slate-600">One attempt per participant per test. Keep your mock password for later results. A closed test can only recover an existing attempt.</p>
  </div></main>;
}
