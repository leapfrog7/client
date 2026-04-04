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

import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InstallAppButton from "./components/InstallAppButton";
import AuthExpiryHandler from "./components/AuthExpiryHandler";

// Components and Pages
import Login from "./components/Login";
import Register from "./pages/Register";
import Pension from "./pages/quiz/Pension";
import SignInChip from "./components/SignInChip";

import Home from "./pages/Home";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Logo from "./components/Logo";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Subscribe from "./pages/Subscribe";
import SampleQuiz from "./pages/quiz/SampleQuiz";
import StickyMiniToolbar from "./components/StickyMiniToolbar";
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
import Allowances from "./pages/quiz/Allowances";
import ParliamentaryProcedure from "./pages/quiz/ParliamentaryProcedure";
import AoBR from "./pages/quiz/AoBR";
import AddQuestionsForm from "./pages/quiz/AddQuestionsForm";
import About from "./pages/About";
import AddMDO from "./pages/quiz/AddMDO";
import AoBR_Full from "./pages/AoBR_Full";
import AoBR_Lookup from "./pages/AoBR_Lookup";
import PreviousYearQuiz from "./pages/quiz/previousYear/Exam";
import TopicwisePYQExplorer from "./pages/quiz/previousYear/TopicwisePYQExplorer";
import TopicwisePYQQuiz from "./pages/quiz/previousYear/TopicwisePYQQuiz";
import EmailOtpReset from "./pages/EmailOtpReset";
import CurrentAffairs from "./pages/currentAffairs/CurrentAffairs";

import AdminDashboard from "./pages/Admin/AdminDashboard";
const UserManagement = lazy(() => import("./pages/Admin/UserManagement"));
const MCQManagement = lazy(() => import("./pages/Admin/MCQ_Management"));
const RevenueManagement = lazy(() => import("./pages/Admin/RevenueManagement"));
const AobrManagement = lazy(() => import("./pages/Admin/AobrManagement"));
const FeedbackManagement = lazy(
  () => import("./pages/Admin/QuestionFeedbackManagement"),
);
const CghsUnitManagement = lazy(
  () => import("./pages/Admin/CghsUnitManagement"),
);
const CghsRateManagement = lazy(
  () => import("./pages/Admin/CghsRateManagement"),
);
const ResourceManagement = lazy(
  () => import("./pages/Admin/ResourceManagement"),
);
const GeneralFeedbackManagement = lazy(
  () => import("./pages/Admin/GeneralFeedbackManagement"),
);
const IdeaManagement = lazy(() => import("./pages/Admin/IdeaManagement"));
const SectionEditor = lazy(() => import("./pages/Admin/SectionEditor"));
const PrevYear = lazy(() => import("./pages/Admin/PrevYear"));
const DraftingRoutes = lazy(
  () => import("./pages/Tools/drafting/DraftingRoutes"),
);

import { FiMenu } from "react-icons/fi";

import AdminPage from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";
import NotLoggedIn from "./pages/NotLoggedIn";
import TokenExpired from "./pages/TokenExpired";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FRPage from "./pages/quiz/FR";

// Public Pages
import CghsUnitPublic from "./pages/Tools/CghsUnitPublic";
import CghsRatesPublic from "./pages/Tools/CghsRatesPublic";
import PayMatrix from "./pages/Tools/PayMatrix";
import NpsEstimator from "./pages/Tools/NpsEstimator";
import PublicResources from "./pages/PublicResources";
import ResourceDetail from "./pages/ResourceDetail";
import PrintEstimate from "./pages/Tools/PrintEstimate";
import PDFUtility from "./pages/Tools/PDFUtility";
import TaskTrackerHome from "./pages/Tools/taskTracker/TaskTrackerHome";
import ShareTaskView from "./pages/Tools/taskTracker/TaskShareView";

const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// const BASE_URL = "http://localhost:5000/api/v1";

const DEFAULT_USER_STATS = {
  paperI: [
    {
      title: "Constitution",
      progress: "0",
      path: "/pages/quiz/paper-i/Constitution",
    },
    { title: "RTI Act", progress: "0", path: "/pages/quiz/paper-i/rti-act" },
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
      path: "/pages/quiz/paper-ii/conduct-rules",
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
    {
      title: "Allowances",
      progress: "0",
      path: "/pages/quiz/paper-ii/allowances",
    },
  ],
};

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isPaymentMade, setIsPaymentMade] = useState(false);
  const [userType, setUserType] = useState("ordinary");
  const [userStats, setUserStats] = useState(DEFAULT_USER_STATS);
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState("");

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const resetSessionState = useCallback(() => {
    setIsLoggedIn(false);
    setUsername("");
    setIsPaymentMade(false);
    setUserId("");
    setUserType("ordinary");
    setUserStats(DEFAULT_USER_STATS);
  }, []);

  const verifyClientToken = useCallback(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      resetSessionState();
      setAuthReady(true);
      return false;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (!decodedToken?.exp || decodedToken.exp < currentTime) {
        localStorage.removeItem("jwtToken");
        resetSessionState();
        setAuthReady(true);
        return false;
      }

      setIsLoggedIn(true);
      setUserId(decodedToken?.userId || "");
      setUsername(decodedToken?.name || "");
      setUserType(decodedToken?.userType || "ordinary");
      setIsPaymentMade(Boolean(decodedToken?.paymentMade));
      setAuthReady(true);
      return true;
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("jwtToken");
      resetSessionState();
      setAuthReady(true);
      return false;
    }
  }, [resetSessionState]);

  useEffect(() => {
    verifyClientToken();
  }, [verifyClientToken]);

  const fetchUserStats = useCallback(async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !isLoggedIn) return;

    try {
      const response = await axios.get(`${BASE_URL}/quiz/getUserStats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserStats(response.data || DEFAULT_USER_STATS);
    } catch (err) {
      console.error("Failed to fetch user stats", err);

      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("jwtToken");
        resetSessionState();
      }
    }
  }, [isLoggedIn, resetSessionState]);

  const accessStatus =
    String(userType).toLowerCase() === "admin"
      ? "admin"
      : isPaymentMade
        ? "paid"
        : "free";

  if (!authReady) {
    return null;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen mx-auto overflow-hidden">
        <nav className="bg-customBlue p-4">
          <div className="container mx-auto md:w-11/12 flex justify-between items-center">
            <div className="z-40 flex items-center space-x-4">
              <Logo />
              <NavBar />
            </div>

            <div className="flex items-center gap-3">
              {!isLoggedIn ? <SignInChip /> : null}

              <button
                className="text-white lg:hidden md:hidden"
                onClick={toggleSidebar}
                aria-label="Open menu"
                title="Menu"
              >
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </nav>

        <ToastContainer position="bottom-center" />

        <StickyMiniToolbar
          isLoggedIn={isLoggedIn}
          username={username}
          accessStatus={accessStatus}
          isPaymentMade={isPaymentMade}
          verifyClientToken={verifyClientToken}
        />

        <AuthExpiryHandler />

        <div className="flex-grow min-h-screen">
          <Routes>
            <Route path="/admin/addMDO" element={<AddMDO />} />

            <Route
              path="/"
              element={
                <Home
                  isLoggedIn={isLoggedIn}
                  username={username}
                  userId={userId}
                  isPaymentMade={isPaymentMade}
                  fetchUserStats={fetchUserStats}
                  userStats={userStats}
                  setUserStats={setUserStats}
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
            <Route path="/pages/token-expired" element={<TokenExpired />} />
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
                    userStats.paperII[3].attemptedQuestions,
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
                    userStats.paperII[2].attemptedQuestions,
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
                    userStats.paperII[5].attemptedQuestions,
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
                    userStats.paperII[7].attemptedQuestions,
                  )}
                />
              }
            />
            <Route
              path="/pages/quiz/paper-ii/nps-rules"
              element={
                <NPSRules
                  progress={userStats.paperII[8].progress}
                  quizAttempted={String(
                    userStats.paperII[8].attemptedQuestions,
                  )}
                />
              }
            />
            <Route
              path="/pages/quiz/paper-ii/allowances"
              element={
                <Allowances
                  progress={userStats.paperII[9].progress}
                  quizAttempted={String(
                    userStats.paperII[9].attemptedQuestions,
                  )}
                />
              }
            />
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
                    userStats.paperII[0].attemptedQuestions,
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
                    userStats.paperII[1].attemptedQuestions,
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
                    userStats.paperII[4].attemptedQuestions,
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
                    userStats.paperII[6].attemptedQuestions,
                  )}
                />
              }
            />

            <Route path="/pages/current_affairs" element={<CurrentAffairs />} />
            <Route
              path="/pages/quiz/addQuestions"
              element={<AddQuestionsForm />}
            />

            <Route
              path="/pages/quiz/previousYear/Exam"
              element={<PreviousYearQuiz />}
            />
            <Route
              path="/pages/quiz/pyq/topic"
              element={<TopicwisePYQExplorer />}
            />
            <Route
              path="/pages/quiz/pyq/topic/quiz"
              element={<TopicwisePYQQuiz />}
            />

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
            <Route
              path="/pages/tools/task-tracker"
              element={<TaskTrackerHome />}
            />
            <Route
              path="/pages/tools/task-tracker/share/:token"
              element={<ShareTaskView />}
            />

            <Route
              path="/pages/tools/drafting/*"
              element={<DraftingRoutes />}
            />
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
