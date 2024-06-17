import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UserManagement from "./UserManagement";
import MCQManagement from "./MCQ_Management";
import RevenueManagement from "./RevenueManagement";

const AdminDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.userType === "Admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (!isAdmin) {
    return (
      <div className="p-8 mx-auto flex flex-col text-center gap-4 ">
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-6 border-b border-gray-300">
        <nav className="flex space-x-4 items-center justify-center text-center">
          <Link
            to="users"
            className={`px-4 py-2 ${
              activeTab.includes("users")
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("users")}
          >
            User Management
          </Link>
          <Link
            to="mcqs"
            className={`px-4 py-2 ${
              activeTab.includes("mcqs")
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("mcqs")}
          >
            MCQ Management
          </Link>
          <Link
            to="revenue"
            className={`px-4 py-2 ${
              activeTab.includes("revenue")
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("revenue")}
          >
            Revenue Management
          </Link>
        </nav>
      </div>
      <div className="mt-6">
        <Routes>
          <Route path="users" element={<UserManagement />} />
          <Route path="mcqs" element={<MCQManagement />} />
          <Route path="revenue" element={<RevenueManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
