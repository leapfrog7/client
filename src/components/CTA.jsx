// import { SiTestrail } from "react-icons/si";
// import { RiContactsBook3Line } from "react-icons/ri";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function CTA() {
//   return (
//     <div className="flex flex-col md:flex-row items-center justify-center w-full p-8 gap-12 max-w-7xl mx-auto">
//       {/* Text Section */}
//       <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
//         <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-700 leading-tight">
//           Stay Ahead of the Competition{" "}
//           <motion.span
//             className="text-blue-700"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 2.0 }}
//           >
//             <div className="bg-white w-full h-auto pt-2">
//               <h2 className="text-4xl lg:text-5xl font-manrope font-black leading-snug text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 lg:py-4">
//                 Prepare Smarter!
//               </h2>
//             </div>
//           </motion.span>
//         </h1>

//         <div className="mt-6 space-y-4 lg:space-y-6">
//           <div className="flex items-center gap-2">
//             <span className="text-xl">✨</span>

//             <p className="text-base lg:text-xl text-gray-700 font-medium">
//               Designed to help you excel in your exams.
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="text-xl">📈</span>
//             <p className="text-base lg:text-xl text-gray-700 font-medium">
//               Track progress & bookmark key questions.
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="text-xl">🎯</span>
//             <p className="text-base lg:text-xl text-gray-700 font-medium">
//               Focus on topic-wise quizzes & targeted learning.
//             </p>
//           </div>
//         </div>

//         <Link
//           to="/register"
//           className="mt-8 bg-cyan-800 rounded-full px-8 py-3 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-cyan-600 transition-all duration-300 w-full max-w-xs shadow-lg hover:shadow-xl"
//         >
//           <span>Register Now</span>
//           <RiContactsBook3Line className="text-2xl" />
//         </Link>
//       </div>

//       {/* Image Background Section */}
//       <div className="w-full lg:w-1/2 flex flex-col items-center">
//         <img
//           src="/newHome.png"
//           alt="Homepage Background"
//           className="w-full h-auto object-cover rounded-2xl"
//           loading="lazy"
//         />
//         <div className="mt-6 text-center w-full max-w-sm">
//           <p className="text-gray-500 text-sm tracking-wide uppercase">
//             Curious about our quizzes?
//           </p>
//           <a
//             className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white py-3 px-6 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 w-full text-lg font-medium"
//             href="/pages/quiz/SampleQuiz"
//           >
//             <span>Take Sample Quiz</span> <SiTestrail className="text-xl" />
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

import { RiContactsBook3Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const item = (delay = 0) => ({
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, delay } },
});

export default function CTA({ isLoggedIn = false, onStartTrial }) {
  const primaryLabel = isLoggedIn
    ? "Start Free Trial (24h)"
    : "Register & Start Free Trial";
  const primaryTo = isLoggedIn ? "/trial" : "/register"; // adjust /trial to your actual route if needed

  return (
    <section aria-labelledby="cta-heading" className="w-full bg-white">
      <div className="flex flex-col md:flex-row items-center justify-center p-8 gap-10 lg:gap-14 max-w-7xl mx-auto">
        {/* Text */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-700 leading-tight">
            Stay Ahead of the Competition{" "}
            <motion.span
              className="text-blue-700"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.0 }}
            >
              <div className="bg-white w-full h-auto pt-2">
                <h2 className="text-4xl lg:text-5xl font-manrope font-black leading-snug text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 lg:py-4">
                  Prepare Smarter!
                </h2>
              </div>
            </motion.span>
          </h1>

          <p className="mt-3 text-gray-700 text-base lg:text-lg max-w-xl">
            Get full access to all quizzes, PYQs (including 2024), analytics and
            bookmarks
          </p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-6 space-y-4 lg:space-y-5"
            aria-label="Key benefits"
          >
            <motion.li
              variants={item(0.05)}
              className="flex items-center gap-3 lg:gap-4"
            >
              <span className="flex-shrink-0 flex items-center justify-center text-2xl lg:text-3xl">
                ✨
              </span>
              <p className="flex-1 text-base lg:text-xl text-gray-700 font-medium leading-snug text-left">
                Our MCQs are designed to help you excel in your exams.
              </p>
            </motion.li>

            <motion.li
              variants={item(0.1)}
              className="flex items-center gap-3 lg:gap-4"
            >
              <span className="flex-shrink-0 flex items-center justify-center text-2xl lg:text-3xl">
                📈
              </span>
              <p className="flex-1 text-base lg:text-xl text-gray-700 font-medium leading-snug text-left">
                Progress tracking & bookmarks
              </p>
            </motion.li>

            <motion.li
              variants={item(0.15)}
              className="flex items-center gap-3 lg:gap-4"
            >
              <span className="flex-shrink-0 flex items-center justify-center text-2xl lg:text-3xl">
                🎯
              </span>
              <p className="flex-1 text-base lg:text-xl text-gray-700 font-medium leading-snug text-left">
                Topic-wise quizzes + PYQs{" "}
                <span className="font-semibold text-indigo-600">
                  (2024 included)
                </span>
              </p>
            </motion.li>
          </motion.ul>

          {/* CTAs */}
          {/* CTAs */}
          <div className="mt-8 w-full">
            <div
              className="
      grid gap-3 sm:gap-4
      grid-cols-1 sm:grid-cols-2
      auto-rows-fr
    "
            >
              {/* Primary */}
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={onStartTrial}
                  aria-label="Start free trial"
                  className="
          group inline-flex items-center justify-center gap-2
          w-full rounded-xl
          px-6 sm:px-8
          py-3 sm:py-4
          text-base sm:text-lg font-semibold
          bg-cyan-800 text-white
          shadow-lg transition
          hover:bg-cyan-700 hover:shadow-xl
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500
          active:scale-[0.99]
        "
                >
                  {/* Optional loading spinner pattern (show conditionally if needed) */}
                  {/* {isStarting && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" />
        )} */}
                  <span>{primaryLabel}</span>
                </button>
              ) : (
                <Link
                  to={primaryTo}
                  aria-label="Register and start free trial"
                  className="
          group inline-flex items-center justify-center gap-2
          w-full rounded-xl
          px-6 sm:px-8
          py-3 sm:py-4
          text-base sm:text-lg font-semibold
          bg-cyan-800 text-white
          shadow-lg transition
          hover:bg-cyan-700 hover:shadow-xl
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500
          active:scale-[0.99]
        "
                >
                  <span className="truncate">{primaryLabel}</span>
                  <RiContactsBook3Line
                    className="text-xl sm:text-2xl transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              )}

              {/* Secondary: jump to pricing section below */}
              <a
                href="#pricing-section"
                className="
        group inline-flex items-center justify-center gap-2
        w-full rounded-xl
        px-6 sm:px-8
        py-3 sm:py-4
        text-base sm:text-lg font-semibold
        bg-white text-gray-800 border border-gray-200
        shadow-sm transition
        hover:bg-gray-50 hover:shadow
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300
        active:scale-[0.99]
      "
                aria-label="View pricing and plans"
              >
                <span>View Pricing</span>
                {/* tiny arrow for motion feedback */}
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                >
                  <path
                    d="M7 5l5 5-5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </a>
            </div>

            {/* micro-copy under CTAs */}
            <p className="mt-2 text-center text-xs sm:text-sm text-gray-500">
              No payment needed to start the trial · Ends automatically after 24
              hours
            </p>
          </div>

          {/* Trust badges */}
          {/* <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1">
              Full access
            </span>
            <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1">
              PYQs 2024 included
            </span>
          </div> */}
        </div>

        {/* Media */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <img
            src="/newHome.png"
            alt="Undersigned dashboard preview"
            className="w-full h-auto object-cover rounded-2xl"
            loading="lazy"
          />
          <div className="mt-5 text-center w-full max-w-sm">
            <p className="text-gray-600 text-sm">
              See your analytics and bookmarked questions—unlocked during trial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

CTA.propTypes = {
  isLoggedIn: PropTypes.bool,
  onStartTrial: PropTypes.func, // optional handler if you trigger an API to activate trial for logged-in users
};
