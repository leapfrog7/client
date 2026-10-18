import { useEffect, useId, useRef, useState } from "react";
import PropTypes from "prop-types";
import { openMockSession } from "./mockPublicApi";
import { getMockSession, setMockSession, clearMockSession } from "./mockSession";
import { readSession } from "../../auth/session";
const inputClass = "mt-1 block w-full rounded-lg border border-slate-300 p-3 text-slate-900";
export default function MockParticipantAccess({ onReady }) {
  const id = useId();
  const callback = useRef(onReady); callback.current = onReady;
  const [session, setSession] = useState(getMockSession);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ mobile: "", username: "", password: "", confirm: "", code: "" });
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { callback.current(getMockSession()); }, []);
  async function connect(event, member = false) {
    event?.preventDefault(); setError("");
    if (!member && mode !== "login" && form.password !== form.confirm) return setError("Passwords do not match.");
    setBusy(true);
    try {
      const response = await openMockSession(member ? { mode: "member" } : { mode, mobile: form.mobile, username: form.username, code: form.code,
          passwordBase64: btoa(Array.from(new TextEncoder().encode(form.password), byte => String.fromCharCode(byte)).join("")) },
        member ? localStorage.getItem("jwtToken") : null);
      setMockSession(response.data, remember);
      setSession(response.data); setForm(prev => ({ ...prev, password: "", confirm: "", code: "" }));
      callback.current(response.data);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  function disconnect() { clearMockSession(); setSession(null); callback.current(null); }
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-lg font-bold">Mock participant</h2>
    <p className="mt-2 text-sm text-slate-600">Free for everyone. No Undersigned membership, payment or active trial is needed. Registered users can use their existing mobile/password. New guests choose a mock password. Your display name appears on the public leaderboard.</p>
    {session ? <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p>Continuing as <strong>{session.account.username}</strong> · {session.account.mobile}</p>
      <button type="button" className="underline" onClick={disconnect}>Use another mobile</button>
    </div> : <>
      <div className="my-4 flex flex-wrap gap-3">
        {[["login", "Returning participant"], ["register", "New participant"], ["recover", "Recover access"]].map(([value, label]) =>
          <button type="button" key={value} aria-pressed={mode === value} disabled={busy} onClick={() => { setMode(value); setError(""); }}
            className={mode === value ? "rounded-lg bg-teal-700 px-3 py-2 text-sm text-white" : "rounded-lg border px-3 py-2 text-sm"}>{label}</button>)}
      </div>
      {readSession() ? <button type="button" disabled={busy} onClick={() => connect(null, true)} className="mb-4 rounded-lg border border-teal-600 p-3 text-teal-800">Continue with my Undersigned account</button> : null}
      <form onSubmit={connect} className="space-y-4">
        <label className="block text-sm font-semibold" htmlFor={id + "-mobile"}>Mobile Number
          <input className={inputClass} id={id + "-mobile"} name="mobile" autoComplete="username" inputMode="numeric" maxLength={10} pattern="[6-9][0-9]{9}" required value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })} />
        </label>
        {mode === "register" ? <label className="block text-sm font-semibold" htmlFor={id + "-name"}>Name
          <input className={inputClass} id={id + "-name"} name="name" autoComplete="name" minLength={2} maxLength={80} required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        </label> : null}
        {mode === "recover" ? <>
          <p className="text-sm text-slate-600">For earlier name/mobile records or a forgotten password, ask the administrator for a private recovery code after verifying your identity. Existing attempts will be kept.</p>
          <label className="block text-sm font-semibold" htmlFor={id + "-code"}>Recovery code
            <input className={inputClass} id={id + "-code"} autoComplete="off" required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.trim() })} />
          </label>
        </> : null}
        <label className="block text-sm font-semibold" htmlFor={id + "-password"}>{mode === "login" ? "Mock password" : "Choose mock password"}
          <input className={inputClass} type="password" id={id + "-password"} name="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "login" ? 1 : 8} maxLength={128} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </label>
        {mode !== "login" ? <label className="block text-sm font-semibold" htmlFor={id + "-confirm"}>Confirm password
          <input className={inputClass} type="password" id={id + "-confirm"} name="confirmPassword" autoComplete="new-password" required value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
        </label> : null}
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />Remember me on this device</label>
        <button type="submit" disabled={busy} className="rounded-lg bg-teal-700 px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? "Please wait..." : mode === "login" ? "Continue" : mode === "register" ? "Set up participant" : "Set password and recover"}</button>
      </form>
    </>}
    {error ? <p role="alert" className="mt-3 text-sm text-red-700">{error}</p> : null}
  </section>;
}
MockParticipantAccess.propTypes = { onReady: PropTypes.func.isRequired };
