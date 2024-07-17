import axios from "axios";

// Create an instance of axios
const AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1/prevYearQuiz",
});

// Add a request interceptor
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosInstance;
