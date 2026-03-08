import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FaRegHandPointUp } from "react-icons/fa";
import { PiCurrencyInr } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import TermsAndConditions from "./TermsAndConditions";
import Modal from "./common/Modal";

const PricingSection = () => {
  const originalPrice = 1499;
  const regularPrice = 999;
  const EARLY_BIRD_PRICE = 699;
  const IS_EARLY_BIRD = true;

  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [tncOpen, setTncOpen] = useState(false);

  const displayPrice = IS_EARLY_BIRD ? EARLY_BIRD_PRICE : regularPrice;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const benefitItem = (label, delay) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.25, delay }}
      className="flex items-center text-gray-700"
    >
      <FontAwesomeIcon icon={faCheck} className="text-blue-600 mr-3" />
      <span>{label}</span>
    </motion.div>
  );

  return (
    <section
      id="pricing-section"
      ref={sectionRef}
      className="w-full bg-white py-10 px-6 md:px-12"
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <p className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Best value offer
          </p>

          <h2
            id="pricing-heading"
            className="mt-4 text-3xl md:text-5xl font-extrabold text-gray-800"
          >
            One Plan. Two Exam Cycles.
          </h2>

          <div className="mt-2 mb-5">
            <span className="inline-block w-40 h-1 bg-blue-600 rounded-full"></span>
            <span className="inline-block w-3 h-1 mx-1 bg-blue-600 rounded-full"></span>
            <span className="inline-block w-1 h-1 bg-blue-600 rounded-full"></span>
          </div>

          <p className="text-gray-700 text-base md:text-lg max-w-xl leading-relaxed">
            Your subscription covers <strong>LDCE 2026</strong>. If you don’t
            clear, your access{" "}
            <strong>automatically continues for LDCE 2027</strong> at no extra
            cost.
          </p>

          <div className="mt-6 w-full max-w-xl rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-800">
                What’s included
              </h3>

              <button
                type="button"
                onClick={() => setTncOpen(true)}
                className="text-sm text-teal-700 underline underline-offset-2 hover:text-teal-900"
              >
                View Terms & Conditions
              </button>
            </div>

            <div className="mt-4 space-y-3 text-base md:text-lg font-semibold">
              {benefitItem("Paper I", 0.05)}
              {benefitItem("Paper II", 0.1)}
              {benefitItem("Previous Year Questions", 0.15)}
            </div>
          </div>

          <Modal
            open={tncOpen}
            onClose={() => setTncOpen(false)}
            title="Terms & Conditions"
          >
            <TermsAndConditions />
          </Modal>
        </div>

        {/* Right */}
        <div className="max-w-md mx-auto w-full">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-slate-50 shadow-xl">
            {IS_EARLY_BIRD && (
              <div className="absolute -right-12 top-5 rotate-45 bg-amber-500 text-white text-xs font-semibold tracking-wider px-16 py-1.5 shadow">
                EARLY BIRD
              </div>
            )}

            <div className="p-6 sm:p-8">
              <div className="text-center">
                <p className="text-indigo-600 text-lg lg:text-xl font-semibold">
                  Unlimited access to all premium features
                </p>

                <div className="py-4 flex justify-center items-center gap-4">
                  <span className="text-gray-400 line-through text-lg flex items-center">
                    <PiCurrencyInr /> {originalPrice}
                  </span>

                  <span className="text-blue-800 text-4xl lg:text-5xl font-extrabold flex items-center">
                    <PiCurrencyInr />
                    {displayPrice}
                  </span>
                </div>

                <div className="space-y-1 text-sm md:text-base text-gray-600">
                  <p>
                    Valid through <strong>LDCE 2026</strong>
                  </p>
                  <p>
                    Didn’t clear? <strong>Auto-extends to LDCE 2027</strong> at
                    no extra cost
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
                <p className="text-sm text-blue-900 leading-relaxed">
                  <span className="font-semibold">Early Bird ₹699</span> is
                  available until UPSC publishes the{" "}
                  <span className="font-medium">SO-LDCE 2026 notification</span>
                  . Thereafter, the price will be revised.
                </p>
              </div>

              <button
                className="mt-5 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] transition-all duration-200 flex items-center justify-center text-lg font-semibold"
                onClick={() => navigate("/subscribe")}
                aria-label="Subscribe now"
              >
                Subscribe Now <FaRegHandPointUp className="ml-3 text-xl" />
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                One-time subscription · No recurring charge
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
