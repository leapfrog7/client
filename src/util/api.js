// src/utils/api.js
export const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// export const BASE_URL = "http://localhost:5000/api/v1";

export const authHeaders = () => {
  const t = localStorage.getItem("jwtToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
};
