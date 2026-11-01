// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
// import {
//   FaArrowRight,
//   FaClipboardList,
//   FaClock,
//   FaSearch,
//   FaTrophy,
// } from "react-icons/fa";

// function MockTestPublicCTA({
//   title = "LDCE SO/PS Mock Tests",
//   description = "Attempt timed mock tests, get immediate scores, and view the leaderboard after the test window closes.",
//   compact = false,
// }) {
//   return (
//     <section
//       className={[
//         "overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-50 to white shadow-sm",
//         compact ? "" : "",
//       ].join(" ")}
//     >
//       <div
//         className={[
//           "grid gap-0",
//           compact
//             ? "lg:grid-cols-[minmax(0,1fr)_280px]"
//             : "lg:grid-cols-[minmax(0,1fr)_340px]",
//         ].join(" ")}
//       >
//         <div className={compact ? "p-4 sm:p-5" : "p-5 sm:p-6"}>
//           <div className="flex items-start gap-3">
//             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 shadow-sm">
//               <FaClipboardList />
//             </div>

//             <div className="min-w-0">
//               <p className="text-xs font-black uppercase tracking-wide text-teal-700">
//                 Practice Module
//               </p>

//               <h2
//                 className={[
//                   "mt-1 font-black leading-tight text-teal-800",
//                   compact ? "text-xl" : "text-2xl sm:text-3xl",
//                 ].join(" ")}
//               >
//                 {title}
//               </h2>

//               <p
//                 className={[
//                   "mt-2 max-w-3xl text-sm leading-6 text-slate-600",
//                   compact ? "" : "sm:text-[15px]",
//                 ].join(" ")}
//               >
//                 {description}
//               </p>
//             </div>
//           </div>

//           {!compact ? (
//             <div className="mt-5 grid gap-3 sm:grid-cols-3">
//               <FeatureItem
//                 icon={<FaClock />}
//                 label="Timed attempt"
//                 value="30 minutes"
//               />
//               <FeatureItem
//                 icon={<FaClipboardList />}
//                 label="Pattern"
//                 value="40 questions"
//               />
//               <FeatureItem
//                 icon={<FaTrophy />}
//                 label="Leaderboard"
//                 value="After window closes"
//               />
//             </div>
//           ) : null}
//         </div>

//         <div
//           className={[
//             "border-t border-slate-100 bg-slate-50 p-4 sm:p-5 lg:border-l lg:border-t-0",
//             compact ? "" : "lg:p-6",
//           ].join(" ")}
//         >
//           <div className="flex h-full flex-col justify-center gap-3">
//             <Link
//               to="/mock-tests"
//               className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-teal-800"
//             >
//               <FaClipboardList />
//               View Mock Tests
//               <FaArrowRight className="text-xs" />
//             </Link>

//             <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
//               <Link
//                 to="/mock-tests/results"
//                 className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"
//               >
//                 <FaSearch />
//                 Find Result
//               </Link>

//               <Link
//                 to="/mock-tests"
//                 className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900 shadow-sm hover:bg-amber-100"
//               >
//                 <FaTrophy />
//                 Leaderboard
//               </Link>
//             </div>

//             <p className="text-center text-xs leading-5 text-slate-500">
//               Use the same name and mobile number to resume attempts or view
//               results.
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// MockTestPublicCTA.propTypes = {
//   title: PropTypes.string,
//   description: PropTypes.string,
//   compact: PropTypes.bool,
// };

// function FeatureItem({ icon, label, value }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
//       <div className="flex items-center gap-2 text-teal-700">
//         <span className="text-sm">{icon}</span>
//         <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
//           {label}
//         </p>
//       </div>
//       <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
//     </div>
//   );
// }

// FeatureItem.propTypes = {
//   icon: PropTypes.node.isRequired,
//   label: PropTypes.string.isRequired,
//   value: PropTypes.string.isRequired,
// };

// export default MockTestPublicCTA;
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getPublicMockTests } from "../../pages/mockTests/mockPublicApi";
import { getMockReminder, mockReminderNow } from "../../util/mockReminder";
import {
  FaBell,
  FaWhatsapp,

  // FaRegCalendarAlt,
} from "react-icons/fa";

const MOCK_TEST_SHARE_URL = "https://undersigned.in/mock-tests";

import { formatMockDateTime } from "../../util/mockSchedule";
import { Link } from "react-router-dom";

function MockTestPublicCTA({
  title = "Mock tests for the preparation of LDCE 2026",
  description = "Free timed mock tests for the December 2026 LDCE exam. Check the schedule, practise and review your score.",
  compact = false,
}) {
  const [response, setResponse] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [dismissedKey, setDismissedKey] = useState(() => {
    try {
      return sessionStorage.getItem("undersigned.mockReminder.dismissed") || "";
    } catch {
      return "";
    }
  });
  const refreshRef = useRef(() => {});
  const [now, setNow] = useState(Date.now);
  const clock = mockReminderNow(response, now, performance.now());
  const reminder = getMockReminder(response?.data, clock);
  const active = reminder?.kind === "active";
  const reminderKey = reminder
    ? reminder.kind + ":" + reminder.test.startAt
    : "";
  const dismiss = () => {
    setDismissedKey(reminderKey);
    try {
      sessionStorage.setItem("undersigned.mockReminder.dismissed", reminderKey);
    } catch {
      /* In-memory dismissal still works. */
    }
  };
  useEffect(() => {
    let disposed = false,
      inFlight = false,
      lastChecked = -Infinity;
    const refresh = async (force = false) => {
      if (
        disposed ||
        inFlight ||
        (!force && performance.now() - lastChecked < 300000)
      )
        return;
      inFlight = true;
      lastChecked = performance.now();
      try {
        const result = await getPublicMockTests();
        if (!disposed) {
          setResponse(result);
          setNow(Date.now());
        }
      } catch {
        if (!disposed) {
          setResponse(null);
          setNow(Date.now());
        }
      } finally {
        if (!disposed) setLoaded(true);
        inFlight = false;
      }
    };
    const foreground = () => {
      if (document.visibilityState === "visible") {
        setNow(Date.now());
        refresh();
      }
    };
    refreshRef.current = refresh;
    refresh();
    document.addEventListener("visibilitychange", foreground);
    window.addEventListener("pageshow", foreground);
    return () => {
      disposed = true;
      refreshRef.current = () => {};
      document.removeEventListener("visibilitychange", foreground);
      window.removeEventListener("pageshow", foreground);
    };
  }, []);
  const boundary = reminder?.nextChangeAt;
  useEffect(() => {
    if (!Number.isFinite(boundary)) return;
    const current = mockReminderNow(response, Date.now(), performance.now());
    const timer = window.setTimeout(
      () => {
        setNow(Date.now());
        refreshRef.current(true);
      },
      Math.min(2147483647, Math.max(1, boundary - current + 50)),
    );
    return () => window.clearTimeout(timer);
  }, [boundary, response, now]);
  const dateLabel = reminder
    ? formatMockDateTime(active ? reminder.test.endAt : reminder.test.startAt)
    : "";
  const shareText = active
    ? "A free LDCE mock test is open on UnderSigned. Closes " +
      dateLabel +
      ". Check availability and take the test."
    : reminder
      ? "LDCE mock tests on UnderSigned. Next " +
        (reminder.kind === "scheduled" ? "scheduled" : "announced") +
        " test: " +
        dateLabel +
        ". Check the schedule and availability."
      : "Free LDCE mock practice on UnderSigned. View mock tests, results and the schedule.";
  return (
    <>
      {loaded &&
        reminder &&
        dismissedKey !== reminderKey &&
        createPortal(
          <aside
            aria-label="Mock-test reminder"
            className={
              "fixed bottom-3 left-3 right-3 z-40 flex flex-col gap-2 rounded-xl border p-3 shadow-xl sm:bottom-5 sm:left-auto sm:right-5 sm:w-[26rem] " +
              (active
                ? "border-amber-200 bg-amber-50"
                : "border-teal-200 bg-teal-50")
            }
          >
            <button
              type="button"
              aria-label="Dismiss mock-test reminder"
              onClick={dismiss}
              className="absolute right-1 top-1 inline-flex h-11 w-11 items-center justify-center rounded-lg text-xl text-slate-600 hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
            >
              ×
            </button>
            <div className="flex min-w-0 items-start gap-2.5 pr-9">
              <span
                aria-hidden="true"
                className="relative mt-1.5 flex h-2.5 w-2.5 shrink-0"
              >
                {active && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-60 motion-safe:animate-ping motion-reduce:animate-none" />
                )}
                <span
                  className={
                    "relative inline-flex h-2.5 w-2.5 rounded-full " +
                    (active ? "bg-amber-600" : "bg-teal-600")
                  }
                />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 sm:text-base">
                  {active
                    ? "A free mock test is open now"
                    : reminder.kind === "scheduled"
                      ? "Next scheduled mock test"
                      : "Next announced mock test"}
                </p>
                <p className="mt-0.5 text-xs leading-5 text-slate-700 sm:text-sm">
                  {active ? "Closes " : "Opens "}
                  {dateLabel}.{" "}
                  {reminder.kind === "scheduled"
                    ? "Check availability on the mock-test page."
                    : "Free for everyone."}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
            <Link
              to="/mock-tests"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              {active ? "Take mock test" : "View mock tests"}
            </Link>
<Link to="/mock-tests/results" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-teal-300 bg-white px-2 py-2.5 text-center text-sm font-bold text-teal-800 hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">View my results</Link>
            </div>
          </aside>,
          document.body,
        )}
      <section className="mb-4 md:mb-6 overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-emerald-50 shadow-sm">
        <div className={compact ? "p-4 sm:p-5" : "p-5 sm:p-6"}>
          <div className="flex items-start gap-3 sm:gap-4">
            {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100 sm:h-11 sm:w-11">
            <FaClipboardList />
          </div> */}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-black uppercase tracking-wide text-teal-700">
                  LDCE 2026 Practice
                </p>

                <span className="inline-flex items-center gap-1 rounded-full border border-teal-100 bg-white px-2 py-0.5 text-[11px] font-black text-rose-700 shadow-sm">
                  <FaBell className="text-[10px] " />
                  October–December series
                </span>
              </div>

              <h2
                className={[
                  "mt-1 font-bold leading-tight text-slate-600",
                  compact ? "text-lg sm:text-xl" : "text-xl",
                ].join(" ")}
              >
                🏆 {title}
              </h2>

              <p
                className={[
                  "mt-2 max-w-4xl text-xs leading-6 text-slate-600",
                  compact ? "" : "sm:text-[15px]",
                ].join(" ")}
              >
                {description}
              </p>
              <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-900">
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-amber-700 ring-1 ring-amber-100">
                  {active
                    ? "Closes"
                    : reminder?.kind === "upcoming"
                      ? "Next announced mock"
                      : reminder
                        ? "Next scheduled mock"
                        : "Series completed"}
                </span>

                <span className="font-black">
                  {dateLabel || "View tests and results"}
                </span>

                <Link
                  to="/mock-tests"
                  className="font-black text-teal-700 underline decoration-teal-300 underline-offset-4 hover:text-teal-900"
                >
                  View schedule and mock tests
                </Link>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2"><Link to="/mock-tests" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800">View mock tests</Link><Link to="/mock-tests/results" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-teal-300 bg-white px-2 py-2.5 text-center text-sm font-bold text-teal-800 hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">View my results</Link></div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
                <FeaturePill label="36-hour test window" />
                <FeaturePill label="⏰ 30 min" />
                <FeaturePill label="🧠 40 questions" />
                <FeaturePill label="🎯 Score review" />
                <FeaturePill label="📛 Negative Marking" />
                <FeaturePill label="🏅 Leaderboard with ranking" />
                <FeaturePill label="🎁 Free access for all" />

                {/* <FeaturePill
                icon={<FaRegCalendarAlt />}
                label="Useful near exam"
              /> */}
              </div>
              <div className="mt-4 flex flex-col gap-2 rounded-xl border border-teal-100 bg-white/70 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold leading-5 text-slate-600">
                  Share the mock test schedule with your friends preparing for
                  LDCE 2026.
                </p>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `${shareText}\n\n${MOCK_TEST_SHARE_URL}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-600 px-3.5 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-green-700"
                >
                  <FaWhatsapp className="text-sm" />
                  Share on WhatsApp
                </a>
              </div>
              {/* {!compact ? (
              <p className="mt-4 max-w-4xl rounded-xl border border-teal-100 bg-white/70 px-4 py-3 text-xs leading-5 text-slate-600">
                The LDCE SO/PS examination is expected around December. Mock
                tests are most useful in the last phase, after topic-wise
                revision and previous year practice. This section will be opened
                when full-length mock practice is available.
              </p>
            ) : null} */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

MockTestPublicCTA.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  compact: PropTypes.bool,
};

function FeaturePill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 ring-1 ring-slate-200">
      <span className="text-teal-700">{icon}</span>
      {label}
    </span>
  );
}

FeaturePill.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
};

export default MockTestPublicCTA;
