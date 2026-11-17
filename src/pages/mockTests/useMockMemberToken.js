import { useSyncExternalStore } from "react";
import { currentToken, readSession, SESSION_CHANGED } from "../../auth/session";
const snapshot = () => (readSession() ? currentToken() : "");
function subscribe(listener) {
  let timer;
  const changed = () => {
    clearTimeout(timer);
    const member = readSession();
    if (member)
      timer = setTimeout(
        changed,
        Math.min(2147483647, Math.max(1, member.exp * 1000 - Date.now() + 1)),
      );
    listener();
  };
  const storage = (event) => {
    if (event.key === "jwtToken" || event.key === null) changed();
  };
  window.addEventListener(SESSION_CHANGED, changed);
  window.addEventListener("storage", storage);
  changed();
  return () => {
    clearTimeout(timer);
    window.removeEventListener(SESSION_CHANGED, changed);
    window.removeEventListener("storage", storage);
  };
}
export default function useMockMemberToken() {
  return useSyncExternalStore(subscribe, snapshot, () => "");
}
