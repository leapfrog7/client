import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UserManagement from "./UserManagement";
import MCQManagement from "./MCQ_Management";
import RevenueManagement from "./RevenueManagement";
import AobrManagement from "./AobrManagement";

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
    <div className="p-2 bg-gray-100 min-h-screen">
      <h1 className="text-2xl lg:text-3xl font-bold mb-6 px-4">
        Admin Dashboard
      </h1>
      <div className="mb-6 border-b border-gray-300">
        <nav className="bg-white shadow-md py-2 px-1">
          <div className="max-w-full mx-auto px-0 lg:px-8">
            <div className="flex justify-center items-center h-16 text-center overflow-auto pb-4">
              <Link
                to="users"
                className={`text-sm md:text-base px-2 py-2 transition duration-300 ease-in-out ${
                  activeTab.includes("users")
                    ? "border-b-2 border-blue-500 text-blue-500 font-semibold bg-blue-50 rounded-md"
                    : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("users")}
              >
                User Management
              </Link>
              <Link
                to="mcqs"
                className={`text-sm md:text-base px-2 py-2 transition duration-300 ease-in-out ${
                  activeTab.includes("mcqs")
                    ? "border-b-2 border-blue-500 text-blue-500 font-semibold bg-blue-50 rounded-md"
                    : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("mcqs")}
              >
                MCQ Management
              </Link>
              <Link
                to="revenue"
                className={`text-sm md:text-base px-2 py-2 transition duration-300 ease-in-out ${
                  activeTab.includes("revenue")
                    ? "border-b-2 border-blue-500 text-blue-500 font-semibold bg-blue-50 rounded-md"
                    : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("revenue")}
              >
                Revenue Management
              </Link>
              <Link
                to="aobr"
                className={`text-sm md:text-base px-4 py-2 ${
                  activeTab.includes("ministry-work-allocation")
                    ? "border-b-2 border-blue-500 text-blue-500 font-semibold bg-blue-50 rounded-md"
                    : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("ministry-work-allocation")}
              >
                AoBR Management
              </Link>
            </div>
          </div>
        </nav>
      </div>
      <div className="mt-6">
        <Routes>
          <Route path="users" element={<UserManagement />} />
          <Route path="mcqs" element={<MCQManagement />} />
          <Route path="revenue" element={<RevenueManagement />} />
          <Route path="aobr" element={<AobrManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
