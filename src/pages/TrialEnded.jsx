import { useState } from "react";
import PropTypes from "prop-types";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AccountActivationNotice from "../components/AccountActivationNotice";
import { readSession, safeReturnUrl } from "../auth/session";

export default function TrialEnded({refreshAccess}) {
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  const navigate = useNavigate(), location = useLocation();
  async function checkActivation() {
    setBusy(true); setMessage("");
    const result = await refreshAccess(true);
    setBusy(false);
    if (result?.tier === "paid") navigate(safeReturnUrl(new URLSearchParams(location.search).get("returnUrl")),{replace:true});
    else setMessage(result ? "Activation is still pending. You remain signed in and can continue using free tools." : "Could not check activation right now. Please retry.");
  }
  if (!readSession()) return <Navigate replace to={"/login?returnUrl=" + encodeURIComponent(safeReturnUrl(new URLSearchParams(location.search).get("returnUrl")))} />;
  return <main className="mx-auto max-w-6xl p-4">
    <h1 className="mt-6 text-2xl font-bold">Your 24-hour trial has ended</h1>
    <p className="my-3">You are still signed in. Activate your account to continue with paid content. Signing in again does not restart the trial.</p>
    <button className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50" disabled={busy} onClick={checkActivation}>{busy ? "Checking..." : "Check activation status"}</button>
    <Link className="ml-4 underline" to="/">Home and free tools</Link>
    {message && <p role="status" className="my-3">{message}</p>}
    <AccountActivationNotice />
  </main>;
}
TrialEnded.propTypes = {refreshAccess:PropTypes.func.isRequired};
