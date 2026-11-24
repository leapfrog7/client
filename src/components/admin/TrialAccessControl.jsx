import { useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { SERVER_ORIGIN } from "../../util/serverConfig";

export default function TrialAccessControl({ user, requestConfig, onApproved, disabled = false }) {
  const inFlight = useRef(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  if (user.paymentMade || user.userType === "Admin") return null;
  const hasRecord = Boolean(user.trialStartedAt || user.trialExpiresAt);

  async function approve() {
    if (inFlight.current || disabled || hasRecord) return;
    inFlight.current = true;
    if (!window.confirm("Enable a 24-hour trial for " + (user.name || "this account") +
      "? It starts now. This does not grant paid access, and this action cannot extend a used trial.")) {
      inFlight.current = false;
      return;
    }
    setPending(true); setMessage(""); setFailed(false);
    try {
      const response = await axios.patch(
        SERVER_ORIGIN + "/api/v1/userManagement/" + user._id + "/trial-access",
        { grant: true }, { ...requestConfig, timeout: 20000 },
      );
      const granted = response.data?.user;
      if (granted?._id !== user._id || !granted.trialStartedAt || !granted.trialExpiresAt)
        throw new Error("Unconfirmed trial response");
      onApproved(granted);
      setMessage(response.data.msg || "The 24-hour trial is enabled.");
    } catch (error) {
      setFailed(true);
      setMessage(error.response?.data?.msg ||
        "Trial approval could not be confirmed. Retry safely; an existing trial will not be extended.");
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }
  return (
    <div className="mt-2 max-w-xs text-sm">
      {hasRecord ? (
        <p className="break-words text-slate-700">
          {user.trialExpiresAt
            ? "Trial expiry: " + new Date(user.trialExpiresAt).toLocaleString("en-IN")
            : "Trial already recorded"}
        </p>
      ) : (
        <button type="button" disabled={pending || disabled} aria-busy={pending} onClick={approve}
          className="min-h-11 rounded-md border border-slate-400 bg-white px-3 py-2 font-medium text-slate-900 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? "Enabling trial..." : "Enable 24-hour trial"}
        </button>
      )}
      {message && <p role={failed ? "alert" : "status"} className="mt-2 break-words text-slate-700">{message}</p>}
    </div>
  );
}
TrialAccessControl.propTypes = {
  user: PropTypes.object.isRequired, requestConfig: PropTypes.object.isRequired,
  onApproved: PropTypes.func.isRequired, disabled: PropTypes.bool,
};

