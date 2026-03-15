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

const Section = ({ children, className = "" }) => {
  return <section className={`mt-5 sm:mt-6 ${className}`}>{children}</section>;
};

Section.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const SoftStatusPanel = ({ children }) => {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white/90 px-4 py-5 text-center shadow-sm backdrop-blur">
      {children}
    </div>
  );
};

SoftStatusPanel.propTypes = {
  children: PropTypes.node,
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

  return (
    <div className="w-full bg-white">
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

      <main className="mx-auto flex w-full max-w-7xl flex-col px-3 pb-8 pt-3 sm:px-4 lg:px-6 lg:pt-4">
        {accessTier === "resolving" && (
          <Section className="mt-3 sm:mt-4">
            <SoftStatusPanel>
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
                <p className="text-sm font-medium text-slate-700 sm:text-base">
                  Setting up your access…
                </p>
                <p className="max-w-xl text-xs text-slate-500 sm:text-sm">
                  Please hold on while we prepare the right view for your
                  account.
                </p>
              </div>
            </SoftStatusPanel>
          </Section>
        )}

        {showUnpaidLoggedIn && (
          <>
            <Section className="mt-3 sm:mt-4">
              <AccountActivationNotice />
            </Section>

            <Section>
              <QuickLinksCarousel />
            </Section>

            <Section>
              <CTA isLoggedIn={isLoggedIn} />
            </Section>

            <Section>
              <PricingSection />
            </Section>

            <Section>
              <QuizDetails />
            </Section>
          </>
        )}

        {showGuest && (
          <>
            <Section className="mt-2 sm:mt-3">
              <CTA isLoggedIn={false} />
            </Section>

            <Section>
              <QuickLinksCarousel />
            </Section>

            <Section>
              <NewCarousel />
            </Section>

            <Section>
              <PricingSection />
            </Section>

            <Section>
              <QuizDetails />
            </Section>

            <Section className="mb-2">
              <div className="overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-slate-50 p-5 shadow-sm">
                <div className="mx-auto max-w-2xl text-center">
                  <p className="text-base font-semibold text-slate-800 sm:text-lg">
                    Still have questions?
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Visit our{" "}
                    <Link
                      to="/faqs"
                      className="font-semibold text-cyan-700 underline decoration-cyan-300 underline-offset-4 transition hover:text-cyan-900"
                    >
                      FAQs
                    </Link>{" "}
                    to understand the platform, access, and key features more
                    clearly.
                  </p>
                </div>
              </div>
            </Section>
          </>
        )}

        {showDashboard && (
          <>
            {accessTier === "trial" && trialEndsAt && (
              <Section className="mt-3">
                <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 px-4 py-4 shadow-sm">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-amber-900 sm:text-base">
                        Free trial active
                      </p>
                      <p className="mt-1 text-xs text-amber-800 sm:text-sm">
                        Your trial access is currently active and will end on{" "}
                        <span className="font-semibold">
                          {formatTrialDate(trialEndsAt)}
                        </span>
                        .
                      </p>
                    </div>

                    <div className="mt-2 self-start rounded-full bg-white px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200 sm:mt-0">
                      Trial access
                    </div>
                  </div>
                </div>
              </Section>
            )}

            <Section className="mt-3 sm:mt-4">
              <Dashboard
                userStats={userStats}
                userId={userId}
                onStatsUpdate={setUserStats}
              />
            </Section>

            <Section>
              <PrevYearCTA />
            </Section>
          </>
        )}

        {!showGuest &&
          !showUnpaidLoggedIn &&
          !showDashboard &&
          accessTier !== "resolving" && (
            <Section className="mt-3 sm:mt-4">
              <SoftStatusPanel>
                <p className="text-sm font-medium text-slate-700 sm:text-base">
                  We could not determine your access state.
                </p>
                <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                  Please refresh the page and try again.
                </p>
              </SoftStatusPanel>
            </Section>
          )}
      </main>
    </div>
  );
};

Home.propTypes = {
  isLoggedIn: PropTypes.bool,
  userId: PropTypes.string,
  isPaymentMade: PropTypes.bool,
  fetchUserStats: PropTypes.func,
  userStats: PropTypes.object,
  setUserStats: PropTypes.func,
};

export default Home;
