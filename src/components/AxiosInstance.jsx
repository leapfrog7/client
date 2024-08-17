import axios from "axios";

// Create an instance of axios
const AxiosInstance = axios.create({
  baseURL: "https://server-v4dy.onrender.com/api/v1/prevYearQuiz",
});

//const BASE_URL = "https://server-v4dy.onrender.com/api/v1/"; //This is the Server Base URL
// baseURL: "http://localhost:5000/api/v1/prevYearQuiz",
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
