import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InstallAppButton from "./components/InstallAppButton";

// import { HelmetProvider } from "react-helmet-async";

// Components and Pages
import Login from "./components/Login";
import Register from "./pages/Register";
import Pension from "./pages/quiz/Pension";
import SignOutButton from "./components/SignOutButton";
import SignInButton from "./components/SignInButton";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Logo from "./components/Logo";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Subscribe from "./pages/Subscribe";
import SampleQuiz from "./pages/quiz/SampleQuiz";
import SharePopup from "./components/SharePopup";
import Constitution from "./pages/quiz/Constitution";
import Conduct from "./pages/quiz/Conduct";
import RTI from "./pages/quiz/RTI";
import OfficeProcedure from "./pages/quiz/OfficeProcedure";
import DFPR_2024 from "./pages/quiz/DFPR_2024";
import CA_Economy from "./pages/quiz/CA_Economy";
import CA_Schemes from "./pages/quiz/CA_Schemes";
import LeaveRules from "./pages/quiz/LeaveRules";
import CCA from "./pages/quiz/CCA";
import GFR from "./pages/quiz/GFR";
import TARules from "./pages/quiz/TARules";
import NPSRules from "./pages/quiz/NPS";

import ParliamentaryProcedure from "./pages/quiz/ParliamentaryProcedure";
import AoBR from "./pages/quiz/AoBR";
import AddQuestionsForm from "./pages/quiz/AddQuestionsForm";
import About from "./pages/About";
import AddMDO from "./pages/quiz/AddMDO";
import AoBR_Full from "./pages/AoBR_Full";
import AoBR_Lookup from "./pages/AoBR_Lookup";
import PreviousYearQuiz from "./pages/quiz/previousYear/Exam";
import EmailOtpReset from "./pages/EmailOtpReset";

import AdminDashboard from "./pages/Admin/AdminDashboard";
const UserManagement = lazy(() => import("./pages/Admin/UserManagement"));
const MCQManagement = lazy(() => import("./pages/Admin/MCQ_Management"));
const RevenueManagement = lazy(() => import("./pages/Admin/RevenueManagement"));
const AobrManagement = lazy(() => import("./pages/Admin/AobrManagement"));
const FeedbackManagement = lazy(() =>
  import("./pages/Admin/QuestionFeedbackManagement")
);
const CghsUnitManagement = lazy(() =>
  import("./pages/Admin/CghsUnitManagement")
);
const CghsRateManagement = lazy(() =>
  import("./pages/Admin/CghsRateManagement")
);
const ResourceManagement = lazy(() =>
  import("./pages/Admin/ResourceManagement")
);
const GeneralFeedbackManagement = lazy(() =>
  import("./pages/Admin/GeneralFeedbackManagement")
); // <-- add this
const IdeaManagement = lazy(() => import("./pages/Admin/IdeaManagement"));
const SectionEditor = lazy(() => import("./pages/Admin/SectionEditor"));
const PrevYear = lazy(() => import("./pages/Admin/PrevYear"));

//Icons
import { FiMenu } from "react-icons/fi"; // For the hamburger menu icon
import { FaHome } from "react-icons/fa";

import AdminPage from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";
import NotLoggedIn from "./pages/NotLoggedIn";
import TokenExpired from "./pages/TokenExpired";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FRPage from "./pages/quiz/FR";

//Public Pages
import CghsUnitPublic from "./pages/Tools/CghsUnitPublic";
import CghsRatesPublic from "./pages/Tools/CghsRatesPublic";
import PayMatrix from "./pages/Tools/PayMatrix";
import NpsEstimator from "./pages/Tools/NpsEstimator";
import PublicResources from "./pages/PublicResources";
import ResourceDetail from "./pages/ResourceDetail";
import PrintEstimate from "./pages/Tools/PrintEstimate";
import PDFUtility from "./pages/Tools/PDFUtility";

const App = () => {
  //States
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isPaymentMade, setIsPaymentMade] = useState(false);
  //This is the state which populates the DashBoard Card. The default is zero
  const [userStats, setUserStats] = useState({
    paperI: [
      {
        title: "Constitution",
        progress: "0",
        path: "/pages/quiz/paper-i/Constitution",
      },
      { title: "RTI Act", progress: "0", path: "/pages/quiz/paper-i/rti-act" },
      // { title: "DFPR", progress: "0", path: "/pages/quiz/paper-i/dfpr" },

      {
        title: "Parliamentary Procedure",
        progress: "0",
        path: "/pages/quiz/paper-i/parliamentary-procedure",
      },
      {
        title: "AoBR",
        progress: "0",
        path: "/pages/quiz/paper-i/AoBR",
      },
      {
        title: "DFPR_2024",
        progress: "0",
        path: "/pages/quiz/paper-i/dfpr-2024",
      },
      {
        title: "Economy",
        progress: "0",
        path: "/pages/quiz/paper-i/CA_Economy",
      },
      {
        title: "Govt. Schemes",
        progress: "0",
        path: "/pages/quiz/paper-i/CA_Schemes",
      },
    ],
    paperII: [
      {
        title: "Leave Rules",
        progress: "0",
        path: "/pages/quiz/paper-ii/leave-rules",
      },
      {
        title: "CCS CCA Rules",
        progress: "0",
        path: "/pages/quiz/paper-ii/ccs-cca-rules",
      },
      {
        title: "Pension Rules",
        progress: "0",
        path: "/pages/quiz/paper-ii/pension-rules",
      },
      {
        title: "Conduct Rules",
        progress: "0",
        path: "/pages/quiz/pages/quiz/paper-ii/conduct-rules",
      },
      { title: "GFR", progress: "0", path: "/pages/quiz/paper-ii/gfr" },
      {
        title: "Office Procedure",
        progress: "0",
        path: "/pages/quiz/paper-ii/csmop",
      },
      {
        title: "FR",
        progress: "0",
        path: "/pages/quiz/paper-ii/fr_sr",
      },
      {
        title: "TA Rules",
        progress: "0",
        path: "/pages/quiz/paper-ii/ta_rules",
      },
      {
        title: "NPS Rules",
        progress: "0",
        path: "/pages/quiz/paper-ii/nps-rules",
      },
    ],
  });

  console.log("Make sure to change the Base URL");

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL
  // const BASE_URL = "http://localhost:5000/api/v1";

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // To check if the user is logged in by looking for a token in local storage
  useEffect(() => {
    verifyClientToken();
  }, []);

  //verify jwtToken if already present
  function verifyClientToken() {
    //console.log("inside verify token");
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        // console.log(decodedToken, currentTime);
        if (decodedToken.exp < currentTime) {
          // Token is expired
          console.log("Token expired");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
          setUsername(decodedToken.name);
          setIsPaymentMade(decodedToken.paymentMade);
          //console.log(decodedToken.userType);
          // console.log(decodedToken.paymentMade);
          // console.log("logged in - " + isLoggedIn);
          //fetchUserStats(decodedToken.userId);
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

  //Fetch user stats from the backend to populate the dashboard progress
  const fetchUserStats = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      if (token) {
        const response = await axios.get(`${BASE_URL}/quiz/getUserStats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserStats(response.data);
        //console.log(response.data);
        // console.log(userStats);
      }
    } catch (err) {
      console.error("Failed to fetch user stats", err);
    }
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
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
        <ToastContainer position="bottom-center" />
        <div
          className={`${
            isLoggedIn
              ? "bg-gradient-to-tl from-amber-50 to-yellow-200"
              : "bg-gradient-to-tl from-amber-50 to-yellow-200"
          } w-full px-6  py-2 flex justify-between items-center mx-auto`}
        >
          {isLoggedIn ? (
            <>
              <span className="text-yellow-700 text-sm md:text-xl font-semibold">{`Welcome, ${username}`}</span>
              <div className="flex items-center gap-3">
                <div className="px-3 py-2 rounded-md bg-yellow-600 hover:bg-yellow-500 text-yellow-100 hover:text-yellow-800">
                  <Link to="/" title="Go to Home">
                    <FaHome className="text-lg   " />{" "}
                  </Link>
                </div>
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
        {/* Share Popup */}
        <SharePopup />
        <div className="flex-grow min-h-screen">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/addMDO" element={<AddMDO />} />

            <Route
              path="/"
              element={
                <Home
                  isLoggedIn={isLoggedIn}
                  username={username}
                  isPaymentMade={isPaymentMade}
                  fetchUserStats={fetchUserStats}
                  userStats={userStats}
                />
              }
            />

            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<EmailOtpReset />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/FAQs" element={<FAQPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route
              path="/login"
              element={<Login verifyToken={verifyClientToken} />}
            />
            <Route
              path="/adminPage"
              element={<AdminPage verifyToken={verifyClientToken} />}
            />
            <Route path="/pages/Unauthorized" element={<Unauthorized />} />
            <Route path="/pages/NotLoggedIn" element={<NotLoggedIn />} />
            <Route path="/pages/TokenExpired" element={<TokenExpired />} />
            <Route path="/pages/aobr/complete" element={<AoBR_Full />} />
            <Route path="/pages/aobr/lookup" element={<AoBR_Lookup />} />

            <Route path="/pages/quiz/SampleQuiz" element={<SampleQuiz />} />

            <Route
              path="/pages/quiz/paper-I/Constitution"
              element={
                <Constitution
                  progress={userStats.paperI[0].progress}
                  quizAttempted={String(userStats.paperI[0].attemptedQuestions)}
                />
              }
            />
            <Route
              path="/pages/quiz/paper-ii/conduct-rules"
              element={
                <Conduct
                  progress={userStats.paperII[3].progress}
                  quizAttempted={String(
                    userStats.paperII[3].attemptedQuestions
                  )}
                />
              }
            />
            <Route
              path="/pages/quiz/paper-i/rti-act"
              element={
                <RTI
                  progress={userStats.paperI[1].progress}
                  quizAttempted={String(userStats.paperI[1].attemptedQuestions)}
                />
              }
            />
            <Route
              path="/pages/quiz/paper-ii/pension-rules"
              element={
                <Pension
                  progress={userStats.paperII[2].progress}
                  quizAttempted={String(
                    userStats.paperII[2].attemptedQuestions
                  )}
                />
              }
            />
            <Route
              path="/pages/quiz/paper-ii/csmop"
              element={
                <OfficeProcedure
                  progress={userStats.paperII[5].progress}
                  quizAttempted={String(
                    userStats.paperII[5].attemptedQuestions
                  )}
                />
              }
            />
            <Route
              path="/pages/quiz/paper-ii/ta_rules"
              element={
                <TARules
                  progress={userStats.paperII[7].progress}
                  quizAttempted={String(
                    userStats.paperII[7].attemptedQuestions
                  )}
                />
              }
            />
            <Route
              path="/pages/quiz/paper-ii/nps-rules"
              element={
                <NPSRules
                  progress={userStats.paperII[7].progress}
                  quizAttempted={String(
                    userStats.paperII[7].attemptedQuestions
                  )}
                />
              }
            />
            {/* <Route
              path="/pages/quiz/paper-i/dfpr"
              element={
                <DFPR
                  progress={userStats.paperI[2].progress}
                  quizAttempted={String(userStats.paperI[2].attemptedQuestions)}
                />
              }
            /> */}

            <Route
              path="/pages/quiz/paper-i/dfpr-2024"
              element={
                <DFPR_2024
                  progress={userStats.paperI[4].progress}
                  quizAttempted={String(userStats.paperI[4].attemptedQuestions)}
                />
              }
            />

            <Route
              path="/pages/quiz/paper-i/CA_Economy"
              element={
                <CA_Economy
                  progress={userStats.paperI[5].progress}
                  quizAttempted={String(userStats.paperI[5].attemptedQuestions)}
                />
              }
            />
            <Route
              path="/pages/quiz/paper-i/CA_Schemes"
              element={
                <CA_Schemes
                  progress={userStats.paperI[6].progress}
                  quizAttempted={String(userStats.paperI[6].attemptedQuestions)}
                />
              }
            />

            <Route
              path="/pages/quiz/paper-ii/leave-rules"
              element={
                <LeaveRules
                  progress={userStats.paperII[0].progress}
                  quizAttempted={String(
                    userStats.paperII[0].attemptedQuestions
                  )}
                />
              }
            />

            <Route path="/pages/quiz/paper-ii/frtest" element={<FRPage />} />

            <Route
              path="/pages/quiz/paper-i/parliamentary-procedure"
              element={
                <ParliamentaryProcedure
                  progress={userStats.paperI[2].progress}
                  quizAttempted={String(userStats.paperI[2].attemptedQuestions)}
                />
              }
            />
            <Route
              path="/pages/quiz/paper-i/AoBR"
              element={
                <AoBR
                  progress={userStats.paperI[3].progress}
                  quizAttempted={String(userStats.paperI[3].attemptedQuestions)}
                />
              }
            />
            <Route
              path="/pages/quiz/paper-ii/ccs-cca-rules"
              element={
                <CCA
                  progress={userStats.paperII[1].progress}
                  quizAttempted={String(
                    userStats.paperII[1].attemptedQuestions
                  )}
                />
              }
            />
            <Route
              path="/pages/quiz/paper-ii/gfr"
              element={
                <GFR
                  progress={userStats.paperII[4].progress}
                  quizAttempted={String(
                    userStats.paperII[4].attemptedQuestions
                  )}
                />
              }
            />
            <Route
              path="/pages/quiz/paper-ii/fr_sr"
              element={
                <FRPage
                  progress={userStats.paperII[6].progress}
                  quizAttempted={String(
                    userStats.paperII[6].attemptedQuestions
                  )}
                />
              }
            />

            <Route
              path="/pages/quiz/addQuestions"
              element={<AddQuestionsForm />}
            />

            <Route
              path="/pages/quiz/previousYear/Exam"
              element={<PreviousYearQuiz />}
            />

            {/* Admin Routes */}
            <Route path="/adminDashboard" element={<AdminDashboard />}>
              <Route
                path="users"
                element={
                  <Suspense fallback={<div className="p-6">Loading…</div>}>
                    <UserManagement />
                  </Suspense>
                }
              />
              <Route
                path="mcqs"
                element={
                  <Suspense fallback={<div className="p-6">Loading…</div>}>
                    <MCQManagement />
                  </Suspense>
                }
              />
              <Route
                path="revenue"
                element={
                  <Suspense fallback={<div className="p-6">Loading…</div>}>
                    <RevenueManagement />
                  </Suspense>
                }
              />
              <Route
                path="aobr"
                element={
                  <Suspense fallback={<div className="p-6">Loading…</div>}>
                    <AobrManagement />
                  </Suspense>
                }
              />
              <Route
                path="prevYear"
                element={
                  <Suspense fallback={<div className="p-6">Loading…</div>}>
                    <PrevYear />
                  </Suspense>
                }
              />
              <Route
                path="feedbackMgmt"
                element={
                  <Suspense fallback={<div className="p-6">Loading…</div>}>
                    <FeedbackManagement />
                  </Suspense>
                }
              />
              <Route
                path="generalFeedback"
                element={
                  <Suspense fallback={<div className="p-6">Loading…</div>}>
                    <GeneralFeedbackManagement />
                  </Suspense>
                }
              />
              <Route
                path="cghs"
                element={
                  <Suspense fallback={<div className="p-6">Loading…</div>}>
                    <CghsUnitManagement />
                  </Suspense>
                }
              />
              <Route
                path="cghs-rates"
                element={
                  <Suspense fallback={<div className="p-6">Loading…</div>}>
                    <CghsRateManagement />
                  </Suspense>
                }
              />
              <Route
                path="resourceMgmt"
                element={
                  <Suspense fallback={<div className="p-6">Loading…</div>}>
                    <ResourceManagement />
                  </Suspense>
                }
              />
              <Route
                path="resourceMgmt/:slug/sections"
                element={
                  <Suspense fallback={<div className="p-6">Loading…</div>}>
                    <SectionEditor />
                  </Suspense>
                }
              />
              <Route
                path="ideasMgmt"
                element={
                  <Suspense fallback={<div className="p-6">Loading…</div>}>
                    <IdeaManagement />
                  </Suspense>
                }
              />
            </Route>

            {/* <Route
              path="/AdminDashboard/userManagement"
              element={<UserManagement />}
            />
            <Route
              path="/AdminDashboard/mcqManagement"
              element={<MCQ_Management />}
            /> */}

            {/* Public Routes */}
            <Route
              path="/pages/public/cghs-units"
              element={<CghsUnitPublic />}
            />

            <Route
              path="/pages/public/cghs-rates"
              element={<CghsRatesPublic />}
            />
            <Route
              path="/pages/public/7thCPC-paymatrix"
              element={<PayMatrix />}
            />
            <Route path="/pages/public/nps-or-ups" element={<NpsEstimator />} />
            <Route
              path="/pages/public/resources"
              element={<PublicResources />}
            />
            <Route
              path="/pages/public/resources/:slug"
              element={<ResourceDetail />}
            />

            <Route path="/print-estimate" element={<PrintEstimate />} />
            <Route path="/pages/public/pdf-utility" element={<PDFUtility />} />

            {/* <Route path="*" element={<Navigate to="/pages/public/resources" />} /> */}
          </Routes>
        </div>
        <InstallAppButton />
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

// To add a new dashboard tile -
/*Files to be changed- 

on FrontEnd - App.jsx (add the Route and edit userStats), 
Make a file with the topic to show on the Route created above. 
In the Tabs file, the topic Name should match the dbTitle. 
Maps the Name and DbTitle in TopicHeading.jsx
Update the userStat in the App.jsx as well

On server-
edit the file userStats.js
edit the file */
