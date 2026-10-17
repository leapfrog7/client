// Shared API origin. Production keeps the existing hosted backend.
export const SERVER_ORIGIN = (import.meta.env.VITE_SERVER_ORIGIN || "https://server-v4dy.onrender.com").replace(/\/+$/, "");
export const API_BASE_URL = SERVER_ORIGIN + "/api/v1";
