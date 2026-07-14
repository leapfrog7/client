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
import {
  FaBell,
  FaWhatsapp,

  // FaRegCalendarAlt,
} from "react-icons/fa";

const MOCK_TEST_SHARE_URL = "https://undersigned.in/mock-tests";

const WHATSAPP_SHARE_TEXT =
  "Upcoming LDCE SO/PS mock tests are being prepared on UnderSigned. Timed practice, 40 questions, score review, negative marking and leaderboard ranking will be available free for all.";

function MockTestPublicCTA({
  title = "Mock tests for the preparation of LDCE 2026",
  description = "Timed LDCE SO/PS mock tests are being prepared to help you check speed, accuracy, and exam readiness closer to the actual exam.",
  compact = false,
}) {
  return (
    <section className="mb-4 md:mb-6 overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-emerald-50 shadow-sm">
      <div className={compact ? "p-4 sm:p-5" : "p-5 sm:p-6"}>
        <div className="flex items-start gap-3 sm:gap-4">
          {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100 sm:h-11 sm:w-11">
            <FaClipboardList />
          </div> */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-black uppercase tracking-wide text-teal-700">
                Upcoming Practice Support
              </p>

              <span className="inline-flex items-center gap-1 rounded-full border border-teal-100 bg-white px-2 py-0.5 text-[11px] font-black text-rose-700 shadow-sm animate-pulse">
                <FaBell className="text-[10px] " />
                Coming soon
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

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
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
                Share this upcoming mock test announcement with your friends
                preparing for LDCE 2026.
              </p>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${WHATSAPP_SHARE_TEXT}\n\n${MOCK_TEST_SHARE_URL}`,
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
