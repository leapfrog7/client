import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Add your protected areas here (prefix match is simplest)
const PROTECTED_PREFIXES = [
  "/pages/current_affairs",
  "/pages/quiz/", // adjust to your actual route

  // add other protected modules
];

const isProtectedPath = (pathname) =>
  PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

export default function AuthExpiryHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => {
      // Only interrupt if user is currently inside a protected section
      if (!isProtectedPath(location.pathname)) return;

      const returnUrl = `${location.pathname}${location.search || ""}`;
      navigate(
        `/pages/token-expired?returnUrl=${encodeURIComponent(returnUrl)}`,
        {
          replace: true,
        },
      );
    };

    window.addEventListener("auth:expired", handler);
    return () => window.removeEventListener("auth:expired", handler);
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    const onExpired = () => {
      if (!isProtectedPath(location.pathname)) return;
      const returnUrl = `${location.pathname}${location.search || ""}`;
      navigate(
        `/pages/token-expired?returnUrl=${encodeURIComponent(returnUrl)}`,
        { replace: true },
      );
    };

    const onForbidden = () => {
      // only redirect if they're in protected/admin areas (your choice)
      navigate("/pages/Unauthorized", { replace: true });
    };

    window.addEventListener("auth:expired", onExpired);
    window.addEventListener("auth:forbidden", onForbidden);

    return () => {
      window.removeEventListener("auth:expired", onExpired);
      window.removeEventListener("auth:forbidden", onForbidden);
    };
  }, [location.pathname, location.search, navigate]);

  return null;
}
