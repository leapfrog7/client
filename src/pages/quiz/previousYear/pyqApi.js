import axios from "../../../components/AxiosInstance";
export const pyq = {
  get: (path, config) => axios.get("/prevYearQuiz" + path, { timeout: 20000, ...config }).then(r => r.data),
  post: (path, data, config) => axios.post("/prevYearQuiz" + path, data, { timeout: 20000, ...config }).then(r => r.data),
};
export const messageFor = error => error?.response?.data?.message || "The request could not be confirmed. Your answers are retained. Please retry.";
export const newRequestKey = () => crypto.randomUUID();

export const attemptQuery = a => new URLSearchParams({attempt:a._id, paper:a.paperType, topic:a.topic || "", years:a.years.join(",")}).toString();
