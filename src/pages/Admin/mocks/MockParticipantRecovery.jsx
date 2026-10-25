import { useState } from "react";
import { issueMockRecovery } from "./mockAdminApi";
export default function MockParticipantRecovery() {
  const [mobile, setMobile] = useState(""), [verified, setVerified] = useState(false);
  const [result, setResult] = useState(null), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  async function issue(event) {
    event.preventDefault(); setError(""); setResult(null); setBusy(true);
    try { setResult({ ...(await issueMockRecovery({ mobile, identityVerified: verified })).data, mobile }); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return <details className="rounded-xl border bg-white p-4">
    <summary className="cursor-pointer font-bold">Participant access recovery</summary>
    <p className="my-3 text-sm">For earlier name/mobile records or forgotten mock passwords. Verify identity privately before issuing a code. This preserves historical attempts. Never issue a code on mobile-number knowledge alone.</p>
    <form onSubmit={issue} className="space-y-3">
      <label className="block" htmlFor="mock-recovery-mobile">Participant mobile<input id="mock-recovery-mobile" type="tel" inputMode="numeric" autoComplete="off" disabled={busy} className="mt-2 block min-h-11 w-full max-w-xs rounded border p-2" value={mobile} onChange={e => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setVerified(false); setResult(null); setError(""); }} required pattern="[6-9][0-9]{9}" /></label>
      <label className="flex items-center gap-2"><input type="checkbox" disabled={busy} checked={verified} onChange={e => setVerified(e.target.checked)} />I have verified this participant&apos;s identity.</label>
      <button disabled={!verified || busy} className="rounded bg-teal-700 p-3 text-white disabled:opacity-50">{busy ? "Issuing..." : "Issue single-use recovery code"}</button>
    </form>
    {error ? <p role="alert" className="mt-3 text-red-700">{error}</p> : null}
    {result ? <div className="mt-3 rounded bg-amber-50 p-3">
      <p>Recovery for {result.mobile}. Share privately. Valid for 24 hours, one use. Participant chooses Recover access and sets a new mock password. Existing mock sessions are revoked when used.</p>
      <code className="my-3 block break-all select-all">{result.code}</code>
      <button type="button" className="underline" onClick={() => setResult(null)}>Hide code</button>
    </div> : null}
  </details>;
}
