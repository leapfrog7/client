import { jwtDecode } from "jwt-decode";
import { SERVER_ORIGIN } from "../util/serverConfig";

let expiredInThisTab = false;
export function wasSessionExpired() { return expiredInThisTab; }
export const SESSION_CHANGED = "auth:session-changed";
export const TRIAL_ENDED = "auth:trial-ended";
export function currentToken() { return localStorage.getItem("jwtToken"); }
export function safeReturnUrl(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin || /^\/(?:login|pages\/(?:token-expired|tokenExpired|NotLoggedIn|trial-ended))(?:\/|$)/i.test(url.pathname)) return "/";
    return url.pathname + url.search + url.hash;
  } catch { return "/"; }
}
export function readSession(token = currentToken()) {
  try {
    const user = jwtDecode(token);
    return user.userId && Number.isFinite(user.exp) && user.exp * 1000 > Date.now() ? user : null;
  } catch { return null; }
}
export function expireSession(expectedToken = currentToken()) {
  if (!expectedToken || currentToken() !== expectedToken) return;
  expiredInThisTab = true;
  // Synchronously let active editors save a local draft before navigation unmounts them.
  window.dispatchEvent(new Event("auth:expiring"));
  localStorage.removeItem("jwtToken");
  window.dispatchEvent(new Event(SESSION_CHANGED));
  window.dispatchEvent(new Event("auth:expired"));
}
export function notifySessionChanged() {
  if (readSession()) expiredInThisTab = false;
  window.dispatchEvent(new Event(SESSION_CHANGED));
}
export function handleAuthFailure(status, data, url, authorization) {
  try {
    if (new URL(url, SERVER_ORIGIN).origin !== SERVER_ORIGIN) return;
  } catch { return; }
  const token = typeof authorization === "string" && authorization.startsWith("Bearer ") ? authorization.slice(7) : null;
  // A failed login/public request, or a late response from an old session, cannot sign out a newer login.
  if (!token || token !== currentToken()) return;
  if (status === 401) expireSession(token);
  else if (status === 402 && data?.code === "TRIAL_ENDED") window.dispatchEvent(new Event(TRIAL_ENDED));
  else if (status === 403) window.dispatchEvent(new Event("auth:forbidden"));
}
export function installAuthInterceptor(client) {
  return client.interceptors.response.use(response => response, error => {
    const config = error.config || {};
    const url = new URL(config.url || "", config.baseURL || SERVER_ORIGIN).href;
    handleAuthFailure(error.response?.status, error.response?.data, url,
      config.headers?.get?.("Authorization") || config.headers?.Authorization || config.headers?.authorization);
    return Promise.reject(error);
  });
}

export async function authFetch(url, options = {}) {
  const response = await fetch(url, options);
  if ([401, 402, 403].includes(response.status)) {
    let data = null;
    try {data = await response.clone().json();} catch { /* Non-JSON auth failures still terminate the correct session. */ }
    handleAuthFailure(response.status, data, String(url), new Headers(options.headers).get("Authorization"));
  }
  return response;
}
