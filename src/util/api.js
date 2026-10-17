import { SERVER_ORIGIN } from "./serverConfig.js";
// src/utils/api.js
export const BASE_URL = (SERVER_ORIGIN + "/api/v1");
// export const BASE_URL = "http://localhost:5000/api/v1";

export const authHeaders = () => {
  const t = localStorage.getItem("jwtToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
};
