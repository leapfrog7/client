import { useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { currentToken, expireSession, notifySessionChanged, readSession, safeReturnUrl, SESSION_CHANGED, TRIAL_ENDED } from "../auth/session";

const isPaidPath = path => ["/pages/quiz/paper-", "/pages/quiz/previousYear/", "/pages/quiz/pyq/", "/pages/current_affairs"].some(prefix => path.toLowerCase().startsWith(prefix.toLowerCase()));
const isProtected = path => !/^\/pages\/quiz\/SampleQuiz\/?$/i.test(path) && ["/pages/quiz/", "/pages/current_affairs", "/adminDashboard", "/admin/", "/pages/tools/task-tracker"].some(prefix => path.startsWith(prefix));
export default function AuthExpiryHandler({access, refreshAccess, onTrialEnded, verifySession}) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = safeReturnUrl(location.pathname + location.search + location.hash);
  useEffect(() => {
    let expiryTimer;
    function check() {
      clearTimeout(expiryTimer);
      const token = currentToken(), user = readSession(token);
      if (token && !user) {expireSession(token); return;}
      if (!user) return;
      // A single timer for the entire app, including tabs resumed from sleep.
      expiryTimer = setTimeout(check, Math.min(user.exp * 1000 - Date.now(), 2147483647));
      refreshAccess();
    }
    function expired() {
      if (isProtected(location.pathname)) navigate("/pages/token-expired?returnUrl=" + encodeURIComponent(returnUrl), {replace:true});
    }
    function storage(event) {
      if (event.key !== "jwtToken" && event.key !== null) return;
      if (!currentToken()) window.dispatchEvent(new Event("auth:expiring"));
      notifySessionChanged();
      verifySession();
      if (!currentToken() && isProtected(location.pathname)) navigate("/pages/NotLoggedIn?returnUrl=" + encodeURIComponent(returnUrl), {replace:true});
      check();
    }
    function focused() {if (document.visibilityState === "visible") check();}
    function forbidden() {if (isProtected(location.pathname)) navigate("/pages/Unauthorized", {replace:true});}
    window.addEventListener("auth:expired", expired);
    window.addEventListener(SESSION_CHANGED, check);
    window.addEventListener("auth:forbidden", forbidden);
    window.addEventListener("storage", storage);
    window.addEventListener("focus", focused);
    document.addEventListener("visibilitychange", focused);
    check();
    return () => {
      clearTimeout(expiryTimer);
      window.removeEventListener("auth:expired", expired);
      window.removeEventListener(SESSION_CHANGED, check);
      window.removeEventListener("auth:forbidden", forbidden);
      window.removeEventListener("storage", storage);
      window.removeEventListener("focus", focused);
      document.removeEventListener("visibilitychange", focused);
    };
  }, [navigate, location.pathname, returnUrl, refreshAccess, verifySession]);

  useEffect(() => {
    function trialEnded() {
      window.dispatchEvent(new Event("auth:expiring"));
      onTrialEnded();
      if (isPaidPath(location.pathname)) navigate("/pages/trial-ended?returnUrl=" + encodeURIComponent(returnUrl), {replace:true});
    }
    window.addEventListener(TRIAL_ENDED, trialEnded);
    let timer;
    if (access.tier === "trial_active" && access.trialExpiresAt) {
      const remaining = new Date(access.trialExpiresAt).getTime() - Date.now();
      if (Number.isFinite(remaining)) timer = setTimeout(trialEnded, Math.max(0, Math.min(remaining, 2147483647)));
    } else if (access.tier === "trial_expired" && isPaidPath(location.pathname)) {
      navigate("/pages/trial-ended?returnUrl=" + encodeURIComponent(returnUrl), {replace:true});
    }
    return () => {clearTimeout(timer); window.removeEventListener(TRIAL_ENDED, trialEnded);};
  }, [access.tier, access.trialExpiresAt, onTrialEnded, location.pathname, returnUrl, navigate]);
  return null;
}
AuthExpiryHandler.propTypes = {
  access: PropTypes.object.isRequired, refreshAccess: PropTypes.func.isRequired,
  onTrialEnded: PropTypes.func.isRequired, verifySession: PropTypes.func.isRequired,
};
