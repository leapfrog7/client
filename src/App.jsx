import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Components and Pages
import Login from "./components/Login";
import Register from "./pages/Register";
import Pension from "./pages/quiz/Pension";
import SignOutButton from "./components/SignOutButton";
import SignInButton from "./components/SignInButton";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Logo from "./components/Logo";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Constitution from "./pages/quiz/Constitution";
import Conduct from "./pages/quiz/Conduct";
import RTI from "./pages/quiz/RTI";
import OfficeProcedure from "./pages/quiz/OfficeProcedure";
import DFPR from "./pages/quiz/DFPR";
import LeaveRules from "./pages/quiz/LeaveRules";
import CCA from "./pages/quiz/CCA";
import GFR from "./pages/quiz/GFR";
import ParliamentaryProcedure from "./pages/quiz/ParliamentaryProcedure";
import AddQuestionsForm from "./pages/quiz/AddQuestionsForm";
//Icons
import { FiMenu } from "react-icons/fi"; // For the hamburger menu icon

const App = () => {
  //States
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // To check if the user is logged in by looking for a token in local storage
  useEffect(() => {
    verifyClientToken();
  }, []);

  //verify jwtToken if already present
  function verifyClientToken() {
    console.log("inside verify token");
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        console.log(decodedToken, currentTime);
        if (decodedToken.exp < currentTime) {
          // Token is expired
          console.log("Token expired");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
          setUsername(decodedToken.name);
          console.log("logged in - " + isLoggedIn);
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen w-full overflow-hidden">
        <nav className="bg-customBlue p-4">
          <div className="container mx-auto md:w-11/12 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Logo />

              <NavBar />
            </div>

            <button
              className="text-white lg:hidden md:hidden"
              onClick={toggleSidebar}
            >
              <FiMenu size={24} />
            </button>
          </div>
        </nav>

        <div
          className={`${
            isLoggedIn ? "bg-gradient-to-tl from-amber-50 to-yellow-200" : ""
          } w-full px-6 md:w-10/12 py-2 flex justify-between items-center mx-auto`}
        >
          {isLoggedIn ? (
            <>
              <span className="text-yellow-700 text-sm md:text-xl font-semibold">{`Welcome, ${username}`}</span>
              <div>
                <SignOutButton
                  verifyToken={verifyClientToken}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            </>
          ) : (
            <>
              <span></span>
              <SignInButton verifyToken={verifyClientToken} />
            </>
          )}
        </div>

        <div className="flex-grow min-h-screen">
          <Routes>
            <Route
              path="/"
              element={<Home isLoggedIn={isLoggedIn} username={username} />}
            />
            <Route path="/about" element={<h1>About page</h1>} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/login"
              element={<Login verifyToken={verifyClientToken} />}
            />
            <Route path="/pages/quiz/paper-II/Pension" element={<Pension />} />
            <Route
              path="/pages/quiz/paper-I/Constitution"
              element={<Constitution />}
            />
            <Route
              path="/pages/quiz/paper-ii/conduct-rules"
              element={<Conduct />}
            />
            <Route path="/pages/quiz/paper-i/rti-act" element={<RTI />} />
            <Route
              path="/pages/quiz/paper-ii/pension-rules"
              element={<Pension />}
            />
            <Route
              path="/pages/quiz/paper-ii/csmop"
              element={<OfficeProcedure />}
            />
            <Route path="/pages/quiz/paper-i/dfpr" element={<DFPR />} />
            <Route
              path="/pages/quiz/paper-ii/leave-rules"
              element={<LeaveRules />}
            />
            <Route
              path="/pages/quiz/paper-i/parliamentary-procedure"
              element={<ParliamentaryProcedure />}
            />
            <Route
              path="/pages/quiz/paper-ii/ccs-cca-rules"
              element={<CCA />}
            />
            <Route path="/pages/quiz/paper-ii/gfr" element={<GFR />} />
            <Route
              path="/pages/quiz/addQuestions"
              element={<AddQuestionsForm />}
            />
          </Routes>
        </div>
        <Footer />
      </div>

      <SideBar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isLoggedIn={isLoggedIn}
        verifyToken={verifyClientToken}
      />
    </BrowserRouter>
  );
};

export default App;
