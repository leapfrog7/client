import { SERVER_ORIGIN } from "../../../util/serverConfig.js";

export function pibApiError(error) {
  const status = error.response?.status;
  const body = error.response?.data;
  if (status === 404 && (typeof body === "string" || (!body?.msg && !body?.message))) {
    return "PIB Import is not available on the selected backend (" + SERVER_ORIGIN + "). Use the updated local backend and restart the frontend after changing VITE_SERVER_ORIGIN.";
  }
  if (typeof body?.msg === "string") return body.msg;
  if (typeof body?.message === "string") return body.message;
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") return "The backend request timed out. Reload the saved inbox before retrying.";
  if (!error.response) return "Cannot reach the selected backend (" + SERVER_ORIGIN + "). Check that it is running, then retry.";
  if (status === 429) return "Too many requests. Please wait before retrying.";
  return "The backend returned an error (" + (status || "unknown") + "). Please retry.";
}
