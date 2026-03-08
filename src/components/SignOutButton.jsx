import { useNavigate } from "react-router-dom";
import { PiSignOutLight } from "react-icons/pi";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

const SignOutButton = ({ verifyToken }) => {
  const navigate = useNavigate();

  let isAdmin = false;
  const token = localStorage.getItem("jwtToken");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = String(decoded?.userType || "").toLowerCase() === "admin"; // ✅ FIX
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    verifyToken?.();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <button
          onClick={() => navigate("/adminDashboard")}
          className="
            inline-flex items-center justify-center
            h-10 px-3 rounded-xl
            border border-purple-200 bg-purple-50 text-purple-800
            hover:bg-purple-100 transition
            focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2
          "
          title="Admin dashboard"
          aria-label="Admin dashboard"
        >
          <span className="text-sm font-semibold hidden sm:inline">Admin</span>
          <span className="sm:hidden text-base">👨‍💼</span>
        </button>
      )}

      <button
        onClick={handleSignOut}
        className="
          inline-flex items-center justify-center gap-2
          h-10 px-3 rounded-xl
          border border-slate-200 bg-white text-slate-700
          hover:bg-slate-50 transition
          focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2
        "
        title="Sign out"
        aria-label="Sign out"
      >
        <PiSignOutLight className="text-xl" />
        <span className="hidden sm:inline text-sm font-semibold">Sign out</span>
      </button>
    </div>
  );
};

SignOutButton.propTypes = {
  verifyToken: PropTypes.func,
};

export default SignOutButton;
