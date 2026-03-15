import axios from "axios";

export const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// export const BASE_URL = "http://localhost:5000/api/v1";

export const TOKEN = () => localStorage.getItem("jwtToken");

export const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );

export const isAxiosCanceled = (err) => axios.isCancel(err);

export const clampPercent = (value) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
};
