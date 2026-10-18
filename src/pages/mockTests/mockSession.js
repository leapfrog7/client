const KEY = "undersigned:mock-session:v1";
export function getMockSession() {
  try {
    const value = JSON.parse(sessionStorage.getItem(KEY) || localStorage.getItem(KEY) || "null");
    if (!value?.token || !value.account?.id) return null;
    const payload = JSON.parse(atob(value.token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp * 1000 > Date.now() ? value : null;
  } catch { return null; }
}
export function setMockSession(value, remember = false) {
  clearMockSession();
  (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(value));
}
export function clearMockSession() {
  localStorage.removeItem(KEY); sessionStorage.removeItem(KEY);
}
function draftKey(accountId, attemptId) { return "undersigned:mock-draft:v1:" + accountId + ":" + attemptId; }
export function readMockDraft(accountId, attemptId) {
  try {
    const value = JSON.parse(localStorage.getItem(draftKey(accountId, attemptId)) || "null");
    return value?.updatedAt > Date.now() - 7 * 86400000 && Array.isArray(value.answers) ? value : null;
  } catch { return null; }
}
export function writeMockDraft(accountId, attemptId, value) {
  try { localStorage.setItem(draftKey(accountId, attemptId), JSON.stringify({ ...value, updatedAt: Date.now() })); return true; }
  catch { return false; }
}
export function clearMockDraft(accountId, attemptId) { try { localStorage.removeItem(draftKey(accountId, attemptId)); } catch { /* storage unavailable */ } }
