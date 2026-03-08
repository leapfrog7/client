import { Link, useLocation } from "react-router-dom";
import {
  FaSignInAlt,
  FaUserPlus,
  // FaRegNewspaper,
  FaBookOpen,
  FaTasks,
  FaFilePdf,
  FaCalculator,
  FaHome,
} from "react-icons/fa";

const NotLoggedIn = () => {
  const location = useLocation();
  const returnUrl =
    location.state?.from ||
    new URLSearchParams(location.search).get("returnUrl") ||
    "/";

  const features = [
    {
      Icon: FaBookOpen,
      title: "MCQ Practice (Paper I & II)",
      desc: "Topic-wise quizzes with progress tracking.",
    },
    // {
    //   Icon: FaRegNewspaper,
    //   title: "Monthly Current Affairs",
    //   desc: "Exam-oriented CA with filters and bookmarks.",
    // },
    {
      Icon: FaTasks,
      title: "Task Tracker",
      desc: "Stay on top of office and study tasks in one place.",
    },
    {
      Icon: FaCalculator,
      title: "CGHS Utilities",
      desc: "Free access to latest CGHS Rates and empanelled CGHS Units",
    },
    {
      Icon: FaFilePdf,
      title: "PDF Utility",
      desc: "Free access and secure PDF tools built for privacy and ease.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-blue-800 via-indigo-700 to-cyan-600" />

        <div className="p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-2xl">🔒</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              You’re not logged in
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              Please sign in to access this page and continue your preparation.
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl
                         bg-gradient-to-r from-blue-800 to-indigo-900
                         px-5 py-3 text-white font-semibold shadow-sm
                         hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
                         transition"
            >
              <FaSignInAlt />
              Login
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl
                         border border-slate-200 bg-white px-5 py-3
                         text-slate-800 font-semibold
                         hover:bg-slate-50 transition"
            >
              <FaUserPlus />
              Create account
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl
                         border border-slate-200 bg-white px-5 py-3
                         text-slate-700 font-semibold
                         hover:bg-slate-50 transition"
            >
              <FaHome />
              Go Home
            </Link>
          </div>

          {/* Features */}
          <div className="mt-8">
            <h3 className="text-sm font-bold tracking-wide text-slate-700 text-center">
              What you unlock after subscribing and login
            </h3>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                      <Icon className="text-slate-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900">
                        {title}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">{desc}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Extra nudge card */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:col-span-2 lg:col-span-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center">
                    <FaBookOpen className="text-blue-800" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-blue-900">
                      Your progress stays saved
                    </div>
                    <div className="mt-1 text-sm text-blue-800">
                      Login helps you bookmark important content, track
                      progress, and continue seamlessly across devices.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 text-center text-xs text-slate-500">
            UnderSigned • Secure login for personalized features
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotLoggedIn;
