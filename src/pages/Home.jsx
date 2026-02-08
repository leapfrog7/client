// import { Link } from "react-router-dom";
// import QuizDetails from "../components/QuizDetails";
// import PricingSection from "../components/PricingSection";
// import Dashboard from "../components/Dashboard";
// import { useEffect } from "react";
// import AccountActivationNotice from "../components/AccountActivationNotice";
// import { Helmet } from "react-helmet-async";

// import NewCarousel from "../components/NewCarousel";
// import CTA from "../components/CTA";

// const Home = ({
//   isLoggedIn,
//   username,
//   isPaymentMade,
//   fetchUserStats,
//   userStats,
// }) => {
//   useEffect(() => {
//     fetchUserStats();
//   }, []);

//   return (
//     <div className="bg-white flex flex-col w-full xl:w-4/5 mx-auto">
//       <Helmet>
//         <title>Home - UnderSigned</title>
//         <link rel="canonical" href="https://undersigned.in/" />
//         <meta
//           name="description"
//           content="Welcome to the home page of UnderSigned. We offer test series in MCQ format for the Limited Departmental Competitive Examination (LDCE) conducted by Union Public Service Commission (UPSC) for promotion to SO or PS grade"
//         />
//         <meta
//           name="keywords"
//           content="UnderSigned, LDCE, Limited Departmental, Section Officer, Test Series, CCS CCA, Pension, Conduct, Leave Rules"
//         />
//         <meta property="og:title" content="UnderSigned| Prepare Smartly" />
//         <meta
//           property="og:description"
//           content="Welcome to the home page of UnderSigned. We offer test series in MCQ format for the Limited Departmental Competitive Examination (LDCE) conducted by Union Public Service Commission (UPSC)"
//         />
//         <meta property="og:type" content="website" />
//       </Helmet>

//       {!isPaymentMade && isLoggedIn && <AccountActivationNotice />}
//       <div
//         className={`flex flex-col lg:flex-row mx-auto justify-center ${
//           isLoggedIn ? (isPaymentMade ? "hidden" : "") : ""
//         }`}
//       ></div>

//       <div
//         className={`flex flex-col lg:flex-row mx-auto justify-center ${
//           isLoggedIn ? (isPaymentMade ? "hidden" : "") : ""
//         }`}
//       >
//         <CTA />
//       </div>
//       <div className={`${isLoggedIn ? (isPaymentMade ? "hidden" : "") : ""}`}>
//         <PricingSection />
//       </div>
//       <div className={`${isLoggedIn ? (isPaymentMade ? "hidden" : "") : ""} `}>
//         <QuickLinksCarousel />
//       </div>

//       <div className="mx-auto w-full overflow-y-auto mt-2">
//         {!isLoggedIn && (
//           <div>
//             <NewCarousel />
//           </div>
//         )}
//       </div>

//       <div className={` ${isLoggedIn ? (isPaymentMade ? "hidden" : "") : ""}`}>
//         <QuizDetails />
//       </div>

//       {/* This is the DashBoard which should appear only when the user is logged In */}
//       {isLoggedIn && isPaymentMade && (
//         <div>
//           <Dashboard userStats={userStats} username={username} />

//           <div className="bg-blue-100 border-l-4 border-blue-600 text-gray-800 px-2 py-4 md:px-6 rounded-md shadow-sm my-6 mx-1 flex items-center justify-between">
//             {/* Text Section */}
//             <div className="flex items-center gap-2 md:gap-4">
//               <p className="text-base lg:text-lg font-medium">
//                 Access{" "}
//                 <span className="font-bold">Previous Year Questions</span> for
//                 SO LDCE{" "}
//                 <span className="animate-pulse text-[10px] md:text-xs text-white bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-1 rounded-full font-semibold shadow-sm">
//                   2024 PYQ added
//                 </span>
//               </p>
//             </div>

//             {/* CTA Link */}
//             <Link
//               to="/pages/quiz/previousYear/Exam"
//               className="text-blue-800 font-bold hover:text-blue-600 transition duration-200 ease-in-out bg-yellow-300 px-4 py-2 md: rounded-md text-sm md:text-base text-center"
//             >
//               Click Here
//             </Link>
//           </div>
//         </div>
//       )}

//       {!isLoggedIn && (
//         <div className="bg-gradient-to-r from-teal-50 to-gray-100 mb-8  my-4 p-4 rounded-lg shadow-md text-center">
//           <p className="text-base lg:text-lg font-semibold text-gray-800">
//             Still have questions?
//           </p>
//           <p className="text-sm text-gray-600 mt-2">
//             Check out our{" "}
//             <Link
//               to="/faqs"
//               className="text-cyan-600 hover:text-cyan-800 font-bold underline transition duration-300 "
//             >
//               FAQs
//             </Link>{" "}
//             for more information.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// import PropTypes from "prop-types";
// import QuickLinksCarousel from "../components/QuickLinksCarousel";

// // import { Carousel } from "react-responsive-carousel";

// Home.propTypes = {
//   isLoggedIn: PropTypes.bool,
//   username: PropTypes.string,
//   isPaymentMade: PropTypes.bool,
//   fetchUserStats: PropTypes.func,
//   userStats: PropTypes.object,
// };

// export default Home;

import { useEffect, useState } from "react";
// import useAuthGuard from "../assets/useAuthGuard";
import { Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

import Dashboard from "../components/Dashboard";
import QuizDetails from "../components/QuizDetails";
import PricingSection from "../components/PricingSection";
import AccountActivationNotice from "../components/AccountActivationNotice";
import NewCarousel from "../components/NewCarousel";
import CTA from "../components/CTA";
import QuickLinksCarousel from "../components/QuickLinksCarousel";
import PrevYearCTA from "../pages/quiz/previousYear/PrevYearCTA";

// Prefer env, fallback to your prod base
const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// Local (toggle when needed)
// const BASE_URL = "http://localhost:5000/api/v1";

const authHeaders = () => {
  const t = localStorage.getItem("jwtToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

const Home = ({
  isLoggedIn,
  username,
  isPaymentMade,
  fetchUserStats,
  userStats,
}) => {
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState(null);
  // useAuthGuard(); // <- handles all redirects/expiry
  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsTrialActive(false);
      setTrialEndsAt(null);
      return;
    }
    let mounted = true;
    axios
      .get(`${BASE_URL}/auth/access`, { headers: authHeaders() })
      .then(({ data }) => {
        if (!mounted) return;
        const active = data?.tier === "trial_active";
        setIsTrialActive(active);
        setTrialEndsAt(active ? data?.trialExpiresAt : null);
      })
      .catch(() => {
        if (!mounted) return;
        setIsTrialActive(false);
        setTrialEndsAt(null);
      });
    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

  const showPaidOrTrial = isLoggedIn && (isPaymentMade || isTrialActive);
  const showUpsellBlocks = isLoggedIn
    ? !(isPaymentMade || isTrialActive)
    : true;

  return (
    <div className="bg-white flex flex-col w-full xl:w-4/5 mx-auto">
      <Helmet>
        {/* Primary */}
        <title>
          UnderSigned — LDCE (SO/PS) MCQs, Govt Rules Directory, CGHS Tools &
          PDF Utilities
        </title>
        <meta
          name="description"
          content="UnderSigned helps Central Government employees prepare for LDCE (SO/PS) with MCQ test series and provides free productivity tools—CGHS rates & units, a searchable Govt Rules/Acts directory, and privacy-first PDF utilities."
        />
        <link rel="canonical" href="https://undersigned.in/" />

        {/* Indexing */}
        <meta
          name="robots"
          content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
        />

        {/* Theme */}
        <meta name="theme-color" content="#1e40af" />

        {/* Open Graph (no images) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UnderSigned" />
        <meta
          property="og:title"
          content="UnderSigned — Prepare Smartly for LDCE (SO/PS) + Govt Tools"
        />
        <meta
          property="og:description"
          content="LDCE (SO/PS) MCQ test series for Central Govt employees + free tools: CGHS rates & units, searchable Govt Rules/Acts directory, and client-side PDF utilities."
        />
        <meta property="og:url" content="https://undersigned.in/" />

        {/* Twitter (no images) */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="UnderSigned — LDCE (SO/PS) MCQs + Govt Tools"
        />
        <meta
          name="twitter:description"
          content="Prepare for LDCE (SO/PS) with MCQs and use free govt productivity tools: CGHS, Rules/Acts directory, and PDF utilities."
        />

        {/* Structured Data */}
        <script type="application/ld+json">{`
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://undersigned.in/#website",
        "name": "UnderSigned",
        "url": "https://undersigned.in",
        "inLanguage": "en-IN"
      },
      {
        "@type": "WebPage",
        "@id": "https://undersigned.in/#webpage",
        "url": "https://undersigned.in/",
        "name": "UnderSigned — LDCE (SO/PS) MCQs, Govt Rules Directory, CGHS Tools & PDF Utilities",
        "description": "UnderSigned helps Central Government employees prepare for LDCE (SO/PS) with MCQ test series and offers free tools like CGHS rates & units, a searchable Govt Rules/Acts directory, and privacy-first PDF utilities.",
        "isPartOf": { "@id": "https://undersigned.in/#website" }
      }
    ]
  }
  `}</script>
      </Helmet>

      {/* Account activation / payment notice (hidden during trial) */}
      {isLoggedIn && !isPaymentMade && !isTrialActive && (
        <AccountActivationNotice />
      )}

      {/* Upsell sections (hidden for paid or trial users) */}
      {showUpsellBlocks && (
        <>
          <div className="flex flex-col lg:flex-row mx-auto justify-center">
            <CTA />
          </div>

          <div className="mt-2">
            <PricingSection />
          </div>

          <div className="mt-2">
            <QuickLinksCarousel />
          </div>
        </>
      )}

      {/* Public carousel when logged out */}
      {!isLoggedIn && (
        <div className="mx-auto w-full overflow-y-auto mt-2">
          <NewCarousel />
        </div>
      )}

      {/* Public quiz details (hide for paid or trial users) */}
      {showUpsellBlocks && (
        <div className="mt-2">
          <QuizDetails />
        </div>
      )}

      {/* Dashboard for paid or trial users */}
      {showPaidOrTrial && (
        <div>
          {/* Optional trial banner */}
          {isTrialActive && trialEndsAt && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-md px-3 py-2 my-3">
              Free trial active — ends at{" "}
              <span className="font-semibold">
                {new Date(trialEndsAt).toLocaleString()}
              </span>
            </div>
          )}

          <Dashboard userStats={userStats} username={username} />

          {/* PYQ: Yearwise + Topicwise */}
          <PrevYearCTA />
        </div>
      )}

      {/* Footer FAQ when logged out */}
      {!isLoggedIn && (
        <div className="bg-gradient-to-r from-teal-50 to-gray-100 mb-8 my-4 p-4 rounded-lg shadow-md text-center">
          <p className="text-base lg:text-lg font-semibold text-gray-800">
            Still have questions?
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Check out our{" "}
            <Link
              to="/faqs"
              className="text-cyan-600 hover:text-cyan-800 font-bold underline transition duration-300"
            >
              FAQs
            </Link>{" "}
            for more information.
          </p>
        </div>
      )}
    </div>
  );
};

Home.propTypes = {
  isLoggedIn: PropTypes.bool,
  username: PropTypes.string,
  isPaymentMade: PropTypes.bool,
  fetchUserStats: PropTypes.func,
  userStats: PropTypes.object,
};

export default Home;
