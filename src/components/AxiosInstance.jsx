// import axios from "axios";

// // Create an instance of axios
// const AxiosInstance = axios.create({
//   baseURL: "https://server-v4dy.onrender.com/api/v1/prevYearQuiz",
// });

// //const BASE_URL = "https://server-v4dy.onrender.com/api/v1/"; //This is the Server Base URL
// // baseURL: "http://localhost:5000/api/v1/prevYearQuiz",
// // Add a request interceptor
// AxiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("jwtToken");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default AxiosInstance;

import axios from "axios";

// ✅ Use the API root, NOT a module path
const AxiosInstance = axios.create({
  baseURL: "https://server-v4dy.onrender.com/api/v1",
  // baseURL: "http://localhost:5000/api/v1",
});

// ✅ Attach token on every request
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Catch expired/invalid token responses centrally
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // Clear token so UI can react
      localStorage.removeItem("jwtToken");

      // Broadcast a global event (Step 2 will listen to this)
      window.dispatchEvent(
        new CustomEvent("auth:expired", {
          detail: {
            status,
            url: error?.config?.url,
            method: error?.config?.method,
          },
        }),
      );
    }

    return Promise.reject(error);
  },
);

export default AxiosInstance;
