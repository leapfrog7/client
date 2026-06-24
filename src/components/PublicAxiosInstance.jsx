import axios from "axios";

const PublicAxiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api/v1",
  baseURL: "https://server-v4dy.onrender.com/api/v1",
});

export default PublicAxiosInstance;
