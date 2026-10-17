import axios from "axios";
import { installAuthInterceptor } from "./auth/session";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./registerSW";
import { HelmetProvider } from "react-helmet-async";

installAuthInterceptor(axios);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <HelmetProvider>
    <App />
  </HelmetProvider>
  // </React.StrictMode>,
);
