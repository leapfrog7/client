import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UserManagement from "./UserManagement";
import MCQManagement from "./MCQ_Management";
import RevenueManagement from "./RevenueManagement";
import AobrManagement from "./AobrManagement";
import FeedbackManagement from "./FeedbackManagement";
import VisitorManagement from "./VisitorManagement";
import { VscFeedback } from "react-icons/vsc";
import PrevYear from "./PrevYear";
import {
  FaUsers,
  FaQuestionCircle,
  FaChartBar,
  FaBook,
  FaHistory,
  FaEye,
} from "react-icons/fa"; // ✅ Import icons

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.userType === "Admin");
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, []);

  if (!isAdmin) {
    return (
      <div className="p-8 mx-auto flex flex-col text-center gap-4">
        <span className="text-3xl bg-red-100 text-red-800 py-6">
          Unauthorized Access
        </span>
        <a href="/" className="text-blue-500 text-xl">
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-gradient-to-r from-green-200 to-teal-500 rounded-lg shadow-md my-4 p-4">
        <h1 className="text-xl lg:text-2xl font-bold text-center text-gray-800 tracking-wider">
          Admin Dashboard
        </h1>
      </div>

      {/* Dashboard Navigation as Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-11/12 mx-auto">
        {/* User Management */}
        <Link
          to="users"
          className="group bg-white shadow-lg rounded-lg p-6 text-center hover:bg-blue-50 transition-all duration-300 ease-in-out"
        >
          <FaUsers className="text-4xl text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h2 className="text-base lg:text-xl font-semibold text-gray-800">
            User Management
          </h2>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-2">
            Manage registered users, update profiles, and track subscriptions.
          </p>
        </Link>

        {/* MCQ Management */}
        <Link
          to="mcqs"
          className="group bg-white shadow-lg rounded-lg p-6 text-center hover:bg-green-50 transition-all duration-300 ease-in-out"
        >
          <FaQuestionCircle className="text-4xl text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h2 className="text-base lg:text-xl font-semibold text-gray-800">
            MCQ Management
          </h2>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-2">
            Create, edit, and organize multiple-choice questions.
          </p>
        </Link>

        {/* Revenue Management */}
        <Link
          to="revenue"
          className="group bg-white shadow-lg rounded-lg p-6 text-center hover:bg-yellow-50 transition-all duration-300 ease-in-out"
        >
          <FaChartBar className="text-4xl text-yellow-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h2 className="text-base lg:text-xl font-semibold text-gray-800">
            Revenue Management
          </h2>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-2">
            Track user payments, subscriptions, and financial insights.
          </p>
        </Link>

        {/* AoBR Management */}
        <Link
          to="aobr"
          className="group bg-white shadow-lg rounded-lg p-6 text-center hover:bg-purple-50 transition-all duration-300 ease-in-out"
        >
          <FaBook className="text-4xl text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h2 className="text-base lg:text-xl font-semibold text-gray-800">
            AoBR Management
          </h2>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-2">
            Manage AoBR topics and study materials.
          </p>
        </Link>

        {/* Previous Years */}
        <Link
          to="prevYear"
          className="group bg-white shadow-lg rounded-lg p-6 text-center hover:bg-red-50 transition-all duration-300 ease-in-out"
        >
          <FaHistory className="text-4xl text-red-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h2 className="text-base lg:text-xl font-semibold text-gray-800">
            Previous Years
          </h2>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-2">
            Access previous year questions and answer sets.
          </p>
        </Link>

        {/* Feedback management  */}
        <Link
          to="feedbackMgmt"
          className="group bg-white shadow-lg rounded-lg p-6 text-center hover:bg-purple-50 transition-all duration-300 ease-in-out"
        >
          <VscFeedback className="text-4xl text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h2 className="text-base lg:text-xl font-semibold text-gray-800">
            Feedback Management
          </h2>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-2">
            Manage all your feedbacks.
          </p>
        </Link>

        {/* Visitor management  */}
        <Link
          to="visitorManagement"
          className="group bg-white shadow-lg rounded-lg p-6 text-center hover:bg-indigo-50 transition-all duration-300 ease-in-out"
        >
          <FaEye className="text-4xl text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h2 className="text-base lg:text-xl font-semibold text-gray-800">
            Visitor Management
          </h2>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-2">
            View and analyze visitor activity.
          </p>
        </Link>
      </div>
      <div className="text-5xl text-black mx-auto text-center border border-gray-400 w-11/12 mt-8">
        <h2></h2>
      </div>
      {/* Routes Section */}
      <div className="mt-8">
        <Routes>
          <Route path="users" element={<UserManagement />} />
          <Route path="mcqs" element={<MCQManagement />} />
          <Route path="revenue" element={<RevenueManagement />} />
          <Route path="aobr" element={<AobrManagement />} />
          <Route path="prevYear" element={<PrevYear />} />
          <Route path="feedbackMgmt" element={<FeedbackManagement />} />
          <Route path="visitorManagement" element={<VisitorManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
