import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
// Icons
import {
  FaUsers,
  FaQuestionCircle,
  FaChartBar,
  FaBook,
  FaHistory,
  FaHospital,
  FaRupeeSign,
  FaCommentDots,
} from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";

// -------- Module registry (single source of truth) --------
const MODULES = [
  {
    to: "users",
    title: "User Management",
    desc: "Manage registered users, update profiles, and track subscriptions.",
    Icon: FaUsers,
    color: "text-blue-500",
  },
  {
    to: "mcqs",
    title: "MCQ Management",
    desc: "Create, edit, and organize multiple-choice questions.",
    Icon: FaQuestionCircle,
    color: "text-green-500",
  },
  {
    to: "revenue",
    title: "Revenue Management",
    desc: "Track user payments, subscriptions, and financial insights.",
    Icon: FaChartBar,
    color: "text-yellow-500",
  },
  {
    to: "aobr",
    title: "AoBR Management",
    desc: "Manage AoBR topics and study materials.",
    Icon: FaBook,
    color: "text-purple-500",
  },
  {
    to: "prevYear",
    title: "Previous Years",
    desc: "Access previous year questions and answer sets.",
    Icon: FaHistory,
    color: "text-red-500",
  },
  {
    to: "feedbackMgmt",
    title: "Question Feedback",
    desc: "Review and resolve question-specific feedback.",
    Icon: VscFeedback,
    color: "text-purple-500",
  },
  {
    to: "generalFeedback",
    title: "General Feedback",
    desc: "View app/site feedback not tied to any question.",
    Icon: FaCommentDots,
    color: "text-fuchsia-600",
  },
  {
    to: "cghs",
    title: "CGHS Unit Management",
    desc: "Add and manage CGHS empanelled hospitals and labs.",
    Icon: FaHospital,
    color: "text-cyan-500",
  },
  {
    to: "cghs-rates",
    title: "CGHS Rates Management",
    desc: "Add and manage CGHS rates for procedures, tests, and implants.",
    Icon: FaRupeeSign,
    color: "text-green-500",
  },
  {
    to: "resourceMgmt",
    title: "Resource Management",
    desc: "Add and manage Rules, Acts, Manuals, and Circulars.",
    Icon: FaBook,
    color: "text-indigo-600",
  },
];

// -------- Small header component --------
function AdminHeader() {
  let name = "Admin";
  try {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1] || ""));
      name = payload?.name || name;
    }
  } catch {
    // ignore
  }

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
        Admin Dashboard
      </h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          Signed in as <strong>{name}</strong>
        </span>
        <Link
          to="/"
          className="text-sm text-teal-700 underline hover:no-underline"
        >
          View Site
        </Link>
      </div>
    </div>
  );
}

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  // Robust + case-insensitive + expiry-aware admin check
  useEffect(() => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) return setIsAdmin(false);

      const payload = JSON.parse(atob(token.split(".")[1] || ""));
      const expOk = payload?.exp ? Date.now() < payload.exp * 1000 : true;
      const isRoleAdmin =
        String(payload?.userType || "").toLowerCase() === "admin";

      if (!expOk) {
        localStorage.removeItem("jwtToken");
        return setIsAdmin(false);
      }
      setIsAdmin(Boolean(isRoleAdmin));
    } catch {
      setIsAdmin(false);
    }
  }, []);

  if (!isAdmin) {
    return (
      <div className="p-8 mx-auto flex flex-col text-center gap-4">
        <span className="text-3xl bg-red-100 text-red-800 py-6 px-4 rounded-lg">
          Unauthorized Access
        </span>
        <Link to="/" className="text-blue-600 text-xl underline">
          Go Home
        </Link>
      </div>
    );
  }

  const isAtAdminRoot = /\/admin\/?$/.test(location.pathname);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Optional gradient banner (keep if you like the color) */}
      <div className="bg-gradient-to-r from-green-200 to-teal-500 rounded-lg shadow-md my-4 p-4">
        <h2 className="text-lg lg:text-xl font-semibold text-center text-gray-800 tracking-wider">
          Welcome to the control center
        </h2>
      </div>

      {/* Clean header with context & quick links */}
      <AdminHeader />

      {/* Modules grid */}
      <section aria-label="Admin modules">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-11/12 mx-auto">
          {MODULES.map(({ to, title, desc, Icon, color }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={title}
              className={({ isActive }) =>
                [
                  "group bg-white shadow-lg rounded-lg p-6 text-center transition",
                  "hover:shadow-xl hover:-translate-y-0.5 focus:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
                  isActive ? "ring-2 ring-teal-500 ring-offset-2" : "",
                ].join(" ")
              }
            >
              <Icon
                className={`text-4xl ${color} mx-auto mb-2 group-hover:scale-110 transition-transform`}
              />
              <h3 className="text-base lg:text-xl font-semibold text-gray-800">
                {title}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-2">
                {desc}
              </p>
            </NavLink>
          ))}
        </div>
      </section>

      {/* Child route outlet + helpful placeholder */}
      <div className="mt-8 w-11/12 mx-auto">
        <Outlet />
        {isAtAdminRoot && (
          <div className="bg-white rounded-lg p-8 text-center text-gray-600 border">
            Select a module above to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
