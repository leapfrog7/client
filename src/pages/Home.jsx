// import { useEffect, useState } from "react";
// // import useAuthGuard from "../assets/useAuthGuard";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import PropTypes from "prop-types";
// import { Helmet } from "react-helmet-async";

// import Dashboard from "../components/Dashboard";
// import QuizDetails from "../components/QuizDetails";
// import PricingSection from "../components/PricingSection";
// import AccountActivationNotice from "../components/AccountActivationNotice";
// import NewCarousel from "../components/NewCarousel";
// import CTA from "../components/CTA";
// import QuickLinksCarousel from "../components/QuickLinksCarousel";
// import PrevYearCTA from "../pages/quiz/previousYear/PrevYearCTA";

// // Prefer env, fallback to your prod base
// const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// // Local (toggle when needed)
// // const BASE_URL = "http://localhost:5000/api/v1";

// const authHeaders = () => {
//   const t = localStorage.getItem("jwtToken");
//   return t ? { Authorization: `Bearer ${t}` } : {};
// };

// const Home = ({
//   isLoggedIn,
//   username,
//   isPaymentMade,
//   fetchUserStats,
//   userStats,
// }) => {
//   const [isTrialActive, setIsTrialActive] = useState(false);
//   const [trialEndsAt, setTrialEndsAt] = useState(null);
//   // useAuthGuard(); // <- handles all redirects/expiry
//   useEffect(() => {
//     fetchUserStats();
//   }, [fetchUserStats]);

//   useEffect(() => {
//     if (!isLoggedIn) {
//       setIsTrialActive(false);
//       setTrialEndsAt(null);
//       return;
//     }
//     let mounted = true;
//     axios
//       .get(`${BASE_URL}/auth/access`, { headers: authHeaders() })
//       .then(({ data }) => {
//         if (!mounted) return;
//         const active = data?.tier === "trial_active";
//         setIsTrialActive(active);
//         setTrialEndsAt(active ? data?.trialExpiresAt : null);
//       })
//       .catch(() => {
//         if (!mounted) return;
//         setIsTrialActive(false);
//         setTrialEndsAt(null);
//       });
//     return () => {
//       mounted = false;
//     };
//   }, [isLoggedIn]);

//   const showPaidOrTrial = isLoggedIn && (isPaymentMade || isTrialActive);
//   const showUpsellBlocks = isLoggedIn
//     ? !(isPaymentMade || isTrialActive)
//     : true;

//   return (
//     <div className="bg-white flex flex-col w-full xl:w-4/5 mx-auto">
//       <Helmet>
//         {/* Primary */}
//         <title>
//           UnderSigned — LDCE (SO/PS) MCQs, Govt Rules Directory, CGHS Tools &
//           PDF Utilities
//         </title>
//         <meta
//           name="description"
//           content="UnderSigned helps Central Government employees prepare for LDCE (SO/PS) with MCQ test series and provides free productivity tools—CGHS rates & units, a searchable Govt Rules/Acts directory, and privacy-first PDF utilities."
//         />
//         <link rel="canonical" href="https://undersigned.in/" />

//         {/* Indexing */}
//         <meta
//           name="robots"
//           content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
//         />

//         {/* Theme */}
//         <meta name="theme-color" content="#1e40af" />

//         {/* Open Graph (no images) */}
//         <meta property="og:type" content="website" />
//         <meta property="og:site_name" content="UnderSigned" />
//         <meta
//           property="og:title"
//           content="UnderSigned — Prepare Smartly for LDCE (SO/PS) + Govt Tools"
//         />
//         <meta
//           property="og:description"
//           content="LDCE (SO/PS) MCQ test series for Central Govt employees + free tools: CGHS rates & units, searchable Govt Rules/Acts directory, and client-side PDF utilities."
//         />
//         <meta property="og:url" content="https://undersigned.in/" />

//         {/* Twitter (no images) */}
//         <meta name="twitter:card" content="summary" />
//         <meta
//           name="twitter:title"
//           content="UnderSigned — LDCE (SO/PS) MCQs + Govt Tools"
//         />
//         <meta
//           name="twitter:description"
//           content="Prepare for LDCE (SO/PS) with MCQs and use free govt productivity tools: CGHS, Rules/Acts directory, and PDF utilities."
//         />

//         {/* Structured Data */}
//         <script type="application/ld+json">{`
//   {
//     "@context": "https://schema.org",
//     "@graph": [
//       {
//         "@type": "WebSite",
//         "@id": "https://undersigned.in/#website",
//         "name": "UnderSigned",
//         "url": "https://undersigned.in",
//         "inLanguage": "en-IN"
//       },
//       {
//         "@type": "WebPage",
//         "@id": "https://undersigned.in/#webpage",
//         "url": "https://undersigned.in/",
//         "name": "UnderSigned — LDCE (SO/PS) MCQs, Govt Rules Directory, CGHS Tools & PDF Utilities",
//         "description": "UnderSigned helps Central Government employees prepare for LDCE (SO/PS) with MCQ test series and offers free tools like CGHS rates & units, a searchable Govt Rules/Acts directory, and privacy-first PDF utilities.",
//         "isPartOf": { "@id": "https://undersigned.in/#website" }
//       }
//     ]
//   }
//   `}</script>
//       </Helmet>

//       {/* Account activation / payment notice (hidden during trial) */}
//       {isLoggedIn && !isPaymentMade && !isTrialActive && (
//         <AccountActivationNotice />
//       )}

//       {/* Upsell sections (hidden for paid or trial users) */}
//       {showUpsellBlocks && (
//         <>
//           <div className="flex flex-col lg:flex-row mx-auto justify-center">
//             <CTA />
//           </div>

//           <div className="mt-2">
//             <PricingSection />
//           </div>

//           <div className="mt-2">
//             <QuickLinksCarousel />
//           </div>
//         </>
//       )}

//       {/* Public carousel when logged out */}
//       {!isLoggedIn && (
//         <div className="mx-auto w-full overflow-y-auto mt-2">
//           <NewCarousel />
//         </div>
//       )}

//       {/* Public quiz details (hide for paid or trial users) */}
//       {showUpsellBlocks && (
//         <div className="mt-2">
//           <QuizDetails />
//         </div>
//       )}

//       {/* Dashboard for paid or trial users */}
//       {showPaidOrTrial && (
//         <div>
//           {/* Optional trial banner */}
//           {isTrialActive && trialEndsAt && (
//             <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-md px-3 py-2 my-3">
//               Free trial active — ends at{" "}
//               <span className="font-semibold">
//                 {new Date(trialEndsAt).toLocaleString()}
//               </span>
//             </div>
//           )}

//           <Dashboard userStats={userStats} username={username} />

//           {/* PYQ: Yearwise + Topicwise */}
//           <PrevYearCTA />
//         </div>
//       )}

//       {/* Footer FAQ when logged out */}
//       {!isLoggedIn && (
//         <div className="bg-gradient-to-r from-teal-50 to-gray-100 mb-8 my-4 p-4 rounded-lg shadow-md text-center">
//           <p className="text-base lg:text-lg font-semibold text-gray-800">
//             Still have questions?
//           </p>
//           <p className="text-sm text-gray-600 mt-2">
//             Check out our{" "}
//             <Link
//               to="/faqs"
//               className="text-cyan-600 hover:text-cyan-800 font-bold underline transition duration-300"
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

// Home.propTypes = {
//   isLoggedIn: PropTypes.bool,
//   username: PropTypes.string,
//   isPaymentMade: PropTypes.bool,
//   fetchUserStats: PropTypes.func,
//   userStats: PropTypes.object,
// };

// export default Home;
import { useEffect, useMemo, useState } from "react";
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

const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// const BASE_URL = "http://localhost:5000/api/v1";

const authHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const formatTrialDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const Home = ({
  isLoggedIn,
  userId,
  isPaymentMade,
  fetchUserStats,
  userStats,
  setUserStats,
}) => {
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState(null);
  const [accessResolved, setAccessResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!isLoggedIn) {
      setIsTrialActive(false);
      setTrialEndsAt(null);
      setAccessResolved(true);
      return;
    }

    setAccessResolved(false);

    axios
      .get(`${BASE_URL}/auth/access`, { headers: authHeaders() })
      .then(({ data }) => {
        if (cancelled) return;

        const active = data?.tier === "trial_active";
        setIsTrialActive(active);
        setTrialEndsAt(active ? data?.trialExpiresAt : null);
        setAccessResolved(true);
      })
      .catch((error) => {
        console.error("Failed to resolve access state:", error);
        if (cancelled) return;

        setIsTrialActive(false);
        setTrialEndsAt(null);
        setAccessResolved(true);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const accessTier = useMemo(() => {
    if (!isLoggedIn) return "guest";
    if (!accessResolved) return "resolving";
    if (isPaymentMade) return "paid";
    if (isTrialActive) return "trial";
    return "unpaid";
  }, [isLoggedIn, accessResolved, isPaymentMade, isTrialActive]);

  useEffect(() => {
    if (accessTier === "paid" || accessTier === "trial") {
      fetchUserStats?.();
    }
  }, [accessTier, fetchUserStats]);

  const showDashboard = accessTier === "paid" || accessTier === "trial";
  const showUnpaidLoggedIn = accessTier === "unpaid";
  const showGuest = accessTier === "guest";
  const showMarketingBlocks = showGuest || showUnpaidLoggedIn;

  return (
    <div className="bg-white flex flex-col w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <Helmet>
        <title>
          UnderSigned — LDCE (SO/PS) MCQs, Govt Rules Directory, CGHS Tools &
          PDF Utilities
        </title>
        <meta
          name="description"
          content="UnderSigned helps Central Government employees prepare for LDCE (SO/PS) with MCQ test series and provides free productivity tools—CGHS rates & units, a searchable Govt Rules/Acts directory, and privacy-first PDF utilities."
        />
        <link rel="canonical" href="https://undersigned.in/" />
        <meta
          name="robots"
          content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
        />
        <meta name="theme-color" content="#1e40af" />

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

        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="UnderSigned — LDCE (SO/PS) MCQs + Govt Tools"
        />
        <meta
          name="twitter:description"
          content="Prepare for LDCE (SO/PS) with MCQs and use free govt productivity tools: CGHS, Rules/Acts directory, and PDF utilities."
        />

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

      {accessTier === "resolving" && (
        <div className="py-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center shadow-sm">
            <p className="text-sm sm:text-base text-slate-700">
              Setting up your access…
            </p>
          </div>
        </div>
      )}

      {showUnpaidLoggedIn && (
        <>
          <AccountActivationNotice />

          <div className="mt-4">
            <QuickLinksCarousel />
          </div>

          <div className="mt-4">
            <CTA isLoggedIn={isLoggedIn} />
          </div>

          <div className="mt-4">
            <PricingSection />
          </div>

          <div className="mt-4">
            <QuizDetails />
          </div>
        </>
      )}

      {showGuest && (
        <>
          <div className="mt-3">
            <CTA isLoggedIn={false} />
          </div>

          <div className="mt-4">
            <QuickLinksCarousel />
          </div>

          <div className="mt-4">
            <NewCarousel />
          </div>

          <div className="mt-4">
            <PricingSection />
          </div>

          <div className="mt-4">
            <QuizDetails />
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-gray-100 mb-8 mt-5 p-4 rounded-lg shadow-md text-center">
            <p className="text-base lg:text-lg font-semibold text-gray-800">
              Still have questions?
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Check out our{" "}
              <Link
                to="/FAQs"
                className="text-cyan-600 hover:text-cyan-800 font-bold underline transition duration-300"
              >
                FAQs
              </Link>{" "}
              for more information.
            </p>
          </div>
        </>
      )}

      {showDashboard && (
        <div className="mt-3">
          {accessTier === "trial" && trialEndsAt && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-3 mb-4 shadow-sm">
              <p className="text-sm sm:text-base">
                <span className="font-semibold">Free trial active</span>
                {" — "}
                ends on{" "}
                <span className="font-semibold">
                  {formatTrialDate(trialEndsAt)}
                </span>
              </p>
            </div>
          )}

          <Dashboard
            userStats={userStats}
            userId={userId}
            onStatsUpdate={setUserStats}
          />

          <div className="mt-4">
            <PrevYearCTA />
          </div>
        </div>
      )}

      {!showMarketingBlocks && !showDashboard && accessTier !== "resolving" && (
        <div className="py-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center shadow-sm">
            <p className="text-sm sm:text-base text-slate-700">
              We could not determine your access state. Please refresh and try
              again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

Home.propTypes = {
  isLoggedIn: PropTypes.bool,
  userId: PropTypes.string,
  isPaymentMade: PropTypes.bool,
  fetchUserStats: PropTypes.func,
  userStats: PropTypes.object,
  setUserStats: PropTypes.object,
};

export default Home;
