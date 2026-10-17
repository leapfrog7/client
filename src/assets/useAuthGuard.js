import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { currentToken, readSession, safeReturnUrl, SESSION_CHANGED, wasSessionExpired } from "../auth/session";

export default function useAuthGuard() {
  const [userId, setUserId] = useState(() => readSession()?.userId || "");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    function check() {
      const session = readSession();
      setUserId(session?.userId || "");
      if (!session) {
        const destination = (currentToken() || wasSessionExpired()) ? "/pages/token-expired" : "/pages/NotLoggedIn";
        navigate(destination + "?returnUrl=" + encodeURIComponent(safeReturnUrl(location.pathname + location.search + location.hash)), {replace:true});
      }
    }
    check();
    window.addEventListener(SESSION_CHANGED, check);
    return () => window.removeEventListener(SESSION_CHANGED, check);
  }, [navigate, location.pathname, location.search, location.hash]);
  return userId;
}
