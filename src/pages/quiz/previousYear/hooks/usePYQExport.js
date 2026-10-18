import { useCallback, useEffect, useRef, useState } from "react";
import { currentToken, SESSION_CHANGED } from "../../../../auth/session";
import { pyq } from "../pyqApi";

export default function usePYQExport(exportPath) {
  const [access, setAccess] = useState(null), [accessError, setAccessError] = useState("");
  const alive = useRef(false), latestRequest = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++latestRequest.current, token = currentToken();
    if (!exportPath || !token) { setAccess(false); return; }
    try {
      const data = await pyq.get("/export-access");
      if (alive.current && request === latestRequest.current && currentToken() === token) {
        setAccess(data.canExport === true); setAccessError("");
      }
    } catch {
      if (alive.current && request === latestRequest.current && currentToken() === token) {
        setAccess(false); setAccessError("Download access could not be checked. Please retry.");
      }
    }
  }, [exportPath]);
  useEffect(() => {
    alive.current = true; setAccess(null); refresh();
    window.addEventListener("focus", refresh); window.addEventListener(SESSION_CHANGED, refresh);
    return () => {
      alive.current = false;
      window.removeEventListener("focus", refresh); window.removeEventListener(SESSION_CHANGED, refresh);
    };
  }, [refresh]);
  const authorize = useCallback(async () => {
    const token = currentToken();
    if (!token || !exportPath) throw new Error("Export is unavailable.");
    // A feature denial must stay on the result screen, not trigger the global403 redirect.
    const data = await pyq.post(exportPath, {}, { validateStatus: status => status >= 200 && status < 300 || status === 403 });
    if (!alive.current || currentToken() !== token) throw new Error("Session changed. Please reopen your result.");
    if (data.code === "PYQ_EXPORT_PAID_ONLY") {
      setAccess(false); setAccessError(""); throw new Error(data.message);
    }
    if (data.code) throw new Error(data.message || "Export is unavailable.");
    setAccess(true); setAccessError(""); return data;
  }, [exportPath]);
  return { canExport: access === true, denied: access === false && !accessError, accessError, refresh, authorize };
}
