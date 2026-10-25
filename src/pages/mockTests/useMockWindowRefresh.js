import { useEffect, useRef } from "react";
// One refresh at each known opening/closing boundary, plus a bounded foreground check.
// Uses response-time server anchors; no periodic background polling.
export default function useMockWindowRefresh(tests, response, refresh) {
  const refreshRef = useRef(refresh); refreshRef.current = refresh;
  useEffect(() => {
    if (!response) return;
    const serverNow = Date.parse(response.serverNow) || Date.now();
    const receivedAt = response.requestTiming?.wallReceivedAt ?? Date.now();
    const boundaries = tests.flatMap(test => test.computedStatus === "upcoming" ? [Date.parse(test.startAt)] : test.computedStatus === "active" ? [Date.parse(test.endAt) + 1] : []).filter(Number.isFinite);
    const next = boundaries.length ? Math.min(...boundaries) : Infinity;
    let requested = false, timer;
    const run = () => { if (!requested) { requested = true; refreshRef.current(); } };
    const check = () => {
      const delay = next - serverNow - (Date.now() - receivedAt) + 150;
      if (delay <= 0) run();
      else if (Number.isFinite(delay)) timer = setTimeout(check, Math.min(delay, 2147483647));
    };
    const foreground = () => { if (document.visibilityState === "visible") { clearTimeout(timer); check(); } };
    check(); document.addEventListener("visibilitychange", foreground); window.addEventListener("pageshow", foreground);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", foreground); window.removeEventListener("pageshow", foreground); };
  }, [tests, response]);
}
