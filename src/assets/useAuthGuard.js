// src/hooks/useAuthGuard.js
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function useAuthGuard() {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const expiryTimerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const cleanupExpiryTimer = () => {
      if (expiryTimerRef.current) {
        clearTimeout(expiryTimerRef.current);
        expiryTimerRef.current = null;
      }
    };
    const forceLogout = (path = "/pages/tokenExpired") => {
      cleanupExpiryTimer();
      localStorage.removeItem("jwtToken");
      navigate(path, { replace: true });
    };
    const scheduleExpiry = (expSec) => {
      const msLeft = Math.max(0, expSec * 1000 - Date.now());
      cleanupExpiryTimer();
      expiryTimerRef.current = setTimeout(
        () => forceLogout("/pages/tokenExpired"),
        msLeft
      );
    };

    const checkAuth = () => {
      const token = localStorage.getItem("jwtToken");
      const go = (path) => (navigate(path, { replace: true }), false);
      if (!token) return go("/pages/NotLoggedIn");

      try {
        const d = jwtDecode(token);
        const exp = Number(d?.exp);
        const uid = d?.userId;
        const now = Math.floor(Date.now() / 1000);
        if (!Number.isFinite(exp) || exp <= now)
          return forceLogout("/pages/tokenExpired");
        if (!uid) return forceLogout("/pages/NotLoggedIn");
        if (userId !== uid) setUserId(uid);
        scheduleExpiry(exp);
        return true;
      } catch {
        return forceLogout("/pages/NotLoggedIn");
      }
    };

    checkAuth();
    intervalRef.current = setInterval(checkAuth, 60 * 1000);

    const onVisibility = () =>
      document.visibilityState === "visible" && checkAuth();
    const onFocus = () => checkAuth();
    const onStorage = (e) => e.key === "jwtToken" && checkAuth();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
      cleanupExpiryTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, userId]);

  return userId;
}
