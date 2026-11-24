import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AccountActivationNotice from "../components/AccountActivationNotice";
import TrialApprovalNotice from "../components/TrialApprovalNotice";
import { readSession, safeReturnUrl } from "../auth/session";

export default function TrialEnded({ refreshAccess }) {
  const [busy, setBusy] = useState(false);
  const [tier, setTier] = useState("resolving");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(), location = useLocation();
  const returnUrl = safeReturnUrl(new URLSearchParams(location.search).get("returnUrl"));
  const signedIn = Boolean(readSession());
  const checkActivation = useCallback(async () => {
    if (!signedIn) return;
    setBusy(true); setMessage("");
    try {
      const result = await refreshAccess(true);
      if (result?.tier === "paid" || result?.tier === "trial_active") {
        navigate(returnUrl, { replace: true });
      } else if (result?.tier === "trial_not_started" || result?.tier === "trial_expired") {
        setTier(result.tier);
        setMessage("Access is still pending. You remain signed in and can use free tools.");
      } else {
        setMessage("Could not check access right now. Please retry.");
      }
    } catch {
      setMessage("Could not check access right now. Please retry.");
    } finally {
      setBusy(false);
    }
  }, [signedIn, refreshAccess, navigate, returnUrl]);
  useEffect(() => { void checkActivation(); }, [checkActivation]);
  if (!signedIn)
    return <Navigate replace to={"/login?returnUrl=" + encodeURIComponent(returnUrl)} />;
  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mt-6 text-2xl font-bold">
        {tier === "trial_not_started" ? "Trial access requires approval" :
          tier === "trial_expired" ? "Your 24-hour trial has ended" : "Your study access"}
      </h1>
      <p className="my-3">
        You are still signed in. {tier === "trial_not_started"
          ? "You can request a trial below or continue using free tools."
          : tier === "trial_expired"
            ? "Signing in again does not restart the trial. Paid activation remains available."
            : "Check your current access below."}
      </p>
      {tier === "trial_not_started" && <TrialApprovalNotice compact />}
      <button type="button" className="mt-4 min-h-11 rounded-md bg-[#16075a] px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50" disabled={busy} onClick={checkActivation}>
        {busy ? "Checking..." : "Check activation status"}
      </button>
      <Link className="ml-4 inline-block py-3 underline" to="/">Home and free tools</Link>
      {message && <p role="status" className="my-3">{message}</p>}
      <AccountActivationNotice />
    </main>
  );
}
TrialEnded.propTypes = { refreshAccess: PropTypes.func.isRequired };

