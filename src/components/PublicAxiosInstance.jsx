import { SERVER_ORIGIN } from "../util/serverConfig.js";
import axios from "axios";

const PublicAxiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api/v1",
  baseURL: (SERVER_ORIGIN + "/api/v1"),
});

export default PublicAxiosInstance;
