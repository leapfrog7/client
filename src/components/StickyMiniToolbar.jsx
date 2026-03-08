import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import SignOutButton from "./SignOutButton";
import SignInButton from "./SignInButton";

// const getInitials = (name = "") => {
//   const parts = name.trim().split(/\s+/).filter(Boolean);
//   if (!parts.length) return "U";
//   const first = parts[0][0] || "U";
//   const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
//   return (first + last).toUpperCase();
// };

// accessStatus: "free" | "trial" | "paid" | "admin"
const statusMeta = (status) => {
  const s = String(status || "free").toLowerCase();

  if (s === "admin")
    return {
      label: "Admin",
      dot: "bg-purple-600",
      ring: "ring-purple-200",
    };

  if (s === "ordinary")
    return {
      label: "Paid access",
      dot: "bg-emerald-500",
      ring: "ring-emerald-200",
    };

  if (s === "trial")
    return {
      label: "Trial access",
      dot: "bg-amber-500",
      ring: "ring-amber-200",
    };

  return {
    label: "Free access",
    dot: "bg-slate-400",
    ring: "ring-slate-200",
  };
};

export default function StickyMiniToolbar({
  isLoggedIn,
  username,
  accessStatus, // ✅ "free" | "trial" | "paid" | "admin"
  verifyClientToken,
}) {
  if (!isLoggedIn) return null; // ✅ hide completely when logged out
  // const initials = getInitials(username);
  const st = statusMeta(accessStatus);

  return (
    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-2 flex items-center justify-between gap-3">
        {/* Left: Avatar + single-line greeting */}
        <div className="min-w-0 flex items-center gap-2">
          {isLoggedIn ? (
            <div className="min-w-0 flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 truncate">
                Hi, {username || "User"}
              </span>

              {/* ✅ Icon-only status */}
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full ring-2 ${st.ring}`}
                title={st.label}
                aria-label={st.label}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${st.dot}`} />
              </span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-slate-900 truncate">
              UnderSigned
              <span className="text-slate-500 font-normal hidden sm:inline">
                {" "}
                • Login to save progress
              </span>
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/"
            className="inline-flex items-center justify-center h-10 w-10 rounded-xl
                       border border-slate-200 bg-white text-slate-700
                       hover:bg-slate-50 transition"
            title="Home"
            aria-label="Go to Home"
          >
            <FaHome className="text-lg" />
          </Link>

          {isLoggedIn ? (
            <SignOutButton
              verifyToken={verifyClientToken}
              isLoggedIn={isLoggedIn}
            />
          ) : (
            <SignInButton verifyToken={verifyClientToken} />
          )}
        </div>
      </div>
    </div>
  );
}

StickyMiniToolbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string,
  accessStatus: PropTypes.oneOf(["free", "trial", "paid", "admin"]),
  verifyClientToken: PropTypes.func.isRequired,
};
