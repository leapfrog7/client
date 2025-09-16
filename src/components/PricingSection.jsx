// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { FaRegHandPointUp } from "react-icons/fa";
// import { PiCurrencyInr } from "react-icons/pi";
// import { faCheck } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";

// const PricingSection = () => {
//   const originalPrice = 1499;
//   const discountedPrice = 999;
//   const navigate = useNavigate();
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const section = document.getElementById("pricing-section");
//       if (section) {
//         const rect = section.getBoundingClientRect();
//         if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
//           setIsVisible(true);
//         }
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div id="pricing-section" className="w-full bg-white py-10 px-6 md:px-12">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
//         {/* Left Side - Pricing Title & Description */}
//         <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
//           <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
//             Our Pricing Plan
//           </h2>
//           <div className="mt-1">
//             <span className="inline-block w-40 h-1 bg-blue-500 rounded-full"></span>
//             <span className="inline-block w-3 h-1 mx-1 bg-blue-500 rounded-full"></span>
//             <span className="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
//           </div>
//           <h4 className="text-lg font-medium text-gray-700 capitalize lg:text-xl my-4">
//             Topics covering
//           </h4>
//           <div className="space-y-3 text-base md:text-lg font-semibold">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={isVisible ? { opacity: 1, y: 0 } : {}}
//               transition={{ duration: 0.2, delay: 0.1 }}
//               className="flex items-center text-gray-700 "
//             >
//               <FontAwesomeIcon icon={faCheck} className="text-blue-500 mr-3" />
//               <span>Paper 1</span>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={isVisible ? { opacity: 1, y: 0 } : {}}
//               transition={{ duration: 0.2, delay: 0.15 }}
//               className="flex items-center text-gray-700 "
//             >
//               <FontAwesomeIcon icon={faCheck} className="text-blue-500 mr-3" />
//               <span>Paper 2</span>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={isVisible ? { opacity: 1, y: 0 } : {}}
//               transition={{ duration: 0.2, delay: 0.2 }}
//               className="flex items-center text-gray-700 "
//             >
//               <FontAwesomeIcon icon={faCheck} className="text-blue-500 mr-3" />
//               <span>Previous Year Questions</span>
//               <span className="ml-2 animate-pulse text-[10px] md:text-xs text-white bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-1 rounded-full font-semibold shadow-sm">
//                 2024 included
//               </span>
//             </motion.div>
//           </div>
//         </div>

//         {/* Right Side - Pricing Card */}
//         <div className="bg-slate-100  shadow-2xl rounded-lg px-10 py-6 max-w-md mx-auto w-full border border-gray-300 ">
//           <p className="mt-4 text-indigo-500  text-lg lg:text-xl text-center font-semibold">
//             Get unlimited access to all features.
//           </p>
//           <div className="py-4 text-3xl font-semibold text-gray-700  sm:text-4xl flex justify-center items-center gap-4">
//             <span className="text-gray-500 line-through text-lg flex items-center">
//               <PiCurrencyInr /> {originalPrice}
//             </span>
//             <span className="text-blue-800 text-4xl lg:text-5xl font-extrabold flex items-center text-shadow">
//               <PiCurrencyInr /> {discountedPrice}
//             </span>
//           </div>
//           <p className="mt-1 text-gray-500 text-sm md:text-base text-center">
//             Subscription valid until{" "}
//             <span className="font-bold">LDCE 2025</span> (Max 2 years from
//             purchase date)
//           </p>
//           <button
//             className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-5 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg font-semibold mt-6 "
//             onClick={() => navigate("/subscribe")}
//           >
//             Subscribe Now <FaRegHandPointUp className="ml-3 text-xl" />
//           </button>
//           <hr className="border-gray-300" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingSection;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaRegHandPointUp } from "react-icons/fa";
import { PiCurrencyInr } from "react-icons/pi";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import TermsAndConditions from "./TermsAndConditions";
import Modal from "./common/Modal";

const PricingSection = () => {
  const originalPrice = 1499;
  const discountedPrice = 999;
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const sectionRef = useRef(null);
  const [tncOpen, setTncOpen] = useState(false);

  // Reveal on view (more reliable than scroll handlers)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="pricing-section"
      ref={sectionRef}
      className="w-full bg-white py-10 px-6 md:px-12"
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left: Title + benefits */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2
            id="pricing-heading"
            className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-2"
          >
            One Plan. Two Exam Cycles.
          </h2>

          {/* Accent underline */}
          <div className="mt-1 mb-4">
            <span className="inline-block w-40 h-1 bg-blue-600 rounded-full"></span>
            <span className="inline-block w-3 h-1 mx-1 bg-blue-600 rounded-full"></span>
            <span className="inline-block w-1 h-1 bg-blue-600 rounded-full"></span>
          </div>

          <p className="text-gray-700 text-base md:text-lg max-w-xl">
            Your subscription covers <strong>LDCE 2025</strong>. If you don’t
            clear, it <strong>automatically extends to LDCE 2026</strong> —
            completely free.
          </p>
          <div className="flex gap-4 justify-center items-baseline">
            <h4 className="text-lg font-semibold text-gray-800 mt-6">
              What’s included
            </h4>
            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => setTncOpen(true)}
                className="text-xs md:text-sm p-2 rounded-md text-teal-600 underline hover:text-teal-800 bg-teal-50"
              >
                See Terms & Conditions
              </button>
            </div>
            {/* Modal with T&C */}
            <Modal
              open={tncOpen}
              onClose={() => setTncOpen(false)}
              title="Terms & Conditions"
            >
              <TermsAndConditions />
            </Modal>
          </div>

          <div className="mt-3 space-y-3 text-base md:text-lg font-semibold">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="flex items-center text-gray-700"
            >
              <FontAwesomeIcon icon={faCheck} className="text-blue-600 mr-3" />
              <span>Paper I</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="flex items-center text-gray-700"
            >
              <FontAwesomeIcon icon={faCheck} className="text-blue-600 mr-3" />
              <span>Paper II</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.25, delay: 0.15 }}
              className="flex items-center text-gray-700"
            >
              <FontAwesomeIcon icon={faCheck} className="text-blue-600 mr-3" />
              <span>Previous Year Questions</span>
              <span className="ml-2 animate-pulse text-[10px] md:text-xs text-white bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-0.5 rounded-full font-semibold shadow-sm">
                2024 included
              </span>
            </motion.div>
          </div>
          {/* Inside the Pricing Card, put a "View Terms" link/button */}
        </div>

        {/* Right: Pricing Card */}
        <div className="bg-slate-50 shadow-xl rounded-2xl px-6 sm:px-8 py-6 max-w-md mx-auto w-full border border-gray-200">
          {/* Guarantee badge */}
          {/* <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 text-xs font-medium">
              ✅ Pass Protection: LDCE 2025 → 2026
            </span>
          </div> */}

          <p className="mt-3 text-indigo-600 text-base lg:text-lg text-center font-semibold">
            Unlimited access to all features
          </p>

          <div className="py-3 sm:py-4 text-3xl font-semibold text-gray-800 sm:text-4xl flex justify-center items-center gap-4">
            <span className="text-gray-400 line-through text-lg flex items-center">
              <PiCurrencyInr /> {originalPrice}
            </span>
            <span className="text-blue-800 text-4xl lg:text-5xl font-extrabold flex items-center">
              <PiCurrencyInr /> {discountedPrice}
            </span>
          </div>

          {/* New policy copy */}
          <div className="text-center text-sm md:text-base text-gray-600 space-y-1">
            <p>
              Valid through <strong>LDCE 2025</strong>.
            </p>
            <p>
              Didn’t clear? <strong>Auto-extends to LDCE 2026</strong> at no
              cost.
            </p>
          </div>

          <button
            className="mt-5 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] transition-all duration-200 flex items-center justify-center text-lg font-semibold"
            onClick={() => navigate("/subscribe")}
            aria-label="Subscribe now"
          >
            Subscribe Now <FaRegHandPointUp className="ml-3 text-xl" />
          </button>

          {/* Collapsible “How the extension works” */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="w-full text-xs text-gray-600 underline hover:text-gray-800"
              aria-expanded={showDetails}
              aria-controls="extension-details"
            >
              How the extension works
            </button>

            {showDetails && (
              <div
                id="extension-details"
                className="mt-3 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg p-3 text-left"
              >
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Enter your <strong>Roll Number</strong> &{" "}
                    <strong>DOB</strong> in your dashboard{" "}
                    <em>before LDCE 2025 Exam</em>.
                  </li>
                  <li>
                    After results, if you didn’t clear, your access{" "}
                    <strong>continues for LDCE 2026</strong> automatically.
                  </li>
                  <li>
                    If you cleared in 2025, the subscription ends (fair usage
                    for everyone).
                  </li>
                </ul>
                <p className="mt-2 text-[11px] text-gray-500">
                  Note: We only use Roll No. & DOB to verify your result. Your
                  data is stored securely and never sold.
                </p>
              </div>
            )}
          </div>

          <hr className="mt-5 border-gray-200" />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
