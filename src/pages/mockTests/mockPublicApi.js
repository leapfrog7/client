import axios from "axios";
import { SERVER_ORIGIN } from "../../util/serverConfig";
import { getMockSession } from "./mockSession";
// Deliberately separate from site auth interceptors: mock failures never expire membership.
const client = axios.create({ baseURL: SERVER_ORIGIN + "/api/v1", timeout: 8000 });
export async function mockRequest(method, url, data, options = {}) {
  try {
    const session = getMockSession();
    const response = await client.request({ method, url, data, ...options,
      headers: { ...(session ? { "X-Mock-Session": session.token } : {}), ...options.headers } });
    return response.data;
  } catch (error) {
    throw Object.assign(new Error(error.response?.data?.message || "Connection interrupted. Your submission is not confirmed; please retry."), {
      status: error.response?.status || 0, code: error.response?.data?.code || "",
      data: error.response?.data, isNetworkError: !error.response,
    });
  }
}
export const openMockSession = (payload, token) => mockRequest("post", "/mocks/attempts/session", payload,
  { headers: token ? { Authorization: "Bearer " + token } : {} });
export const getPublicMockTests = () => mockRequest("get", "/mocks/tests");
export const getPublicMockTestById = id => mockRequest("get", "/mocks/tests/" + id);
export const startOrResumeAttempt = id => mockRequest("post", "/mocks/attempts/" + id + "/start", {});
export const resumeAttemptById = id => mockRequest("post", "/mocks/attempts/" + id + "/resume", {});
export const saveAttemptAnswers = (id, answers, metadata = {}) => mockRequest("patch", "/mocks/attempts/" + id + "/save", { answers, ...metadata }, { timeout: 4000 });
export const pauseAttempt = (id, answers, metadata = {}) => mockRequest("patch", "/mocks/attempts/" + id + "/pause", { answers, ...metadata }, { timeout: 4000 });
export const submitAttempt = (id, answers, metadata = {}) => mockRequest("post", "/mocks/attempts/" + id + "/submit", { answers, ...metadata });
export const lookupResults = () => mockRequest("post", "/mocks/attempts/results/lookup", {});
export const getAttemptResult = id => mockRequest("post", "/mocks/attempts/" + id + "/result", {});
export const getLeaderboard = (id, params = {}) => mockRequest("get", "/mocks/attempts/" + id + "/leaderboard", undefined, { params });
