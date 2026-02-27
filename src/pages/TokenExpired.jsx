import { Link, useLocation } from "react-router-dom";
import { FaSignInAlt, FaHome } from "react-icons/fa";

const TokenExpired = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const returnUrl = params.get("returnUrl") || "/";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

        <div className="p-6 sm:p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-2xl">⏳</span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Session Expired
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Your session has expired. Please log in again to continue.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl
                         bg-gradient-to-r from-blue-800 to-indigo-900
                         px-4 py-3 text-white font-semibold shadow-sm
                         hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
                         transition"
            >
              <FaSignInAlt />
              Login Again
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl
                         border border-slate-200 bg-white px-4 py-3
                         text-slate-700 font-semibold
                         hover:bg-slate-50 transition"
            >
              <FaHome />
              Go to Home
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Tip: If you were in the middle of something, you’ll be returned to
            the same page after login.
          </p>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-center text-xs text-slate-500">
          UnderSigned • Secure session handling
        </div>
      </div>
    </div>
  );
};

export default TokenExpired;
