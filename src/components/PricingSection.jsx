import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaRegHandPointUp } from "react-icons/fa";
import { PiCurrencyInr } from "react-icons/pi";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PricingSection = () => {
  const originalPrice = 1499;
  const discountedPrice = 999;
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("pricing-section");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          setIsVisible(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div id="pricing-section" className="w-full bg-white py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left Side - Pricing Title & Description */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Our Pricing Plan
          </h2>
          <div className="mt-1">
            <span className="inline-block w-40 h-1 bg-blue-500 rounded-full"></span>
            <span className="inline-block w-3 h-1 mx-1 bg-blue-500 rounded-full"></span>
            <span className="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
          </div>
          <h4 className="text-lg font-medium text-gray-700 capitalize lg:text-xl my-4">
            Topics covering
          </h4>
          <div className="space-y-3 text-base md:text-lg font-semibold">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex items-center text-gray-700 "
            >
              <FontAwesomeIcon icon={faCheck} className="text-blue-500 mr-3" />
              <span>Paper 1</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.2, delay: 0.15 }}
              className="flex items-center text-gray-700 "
            >
              <FontAwesomeIcon icon={faCheck} className="text-blue-500 mr-3" />
              <span>Paper 2</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="flex items-center text-gray-700 "
            >
              <FontAwesomeIcon icon={faCheck} className="text-blue-500 mr-3" />
              <span>Previous Year Questions</span>
              <span className="ml-2 animate-pulse text-[10px] md:text-xs text-white bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-1 rounded-full font-semibold shadow-sm">
                2024 included
              </span>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Pricing Card */}
        <div className="bg-slate-100  shadow-2xl rounded-lg px-10 py-6 max-w-md mx-auto w-full border border-gray-300 ">
          <p className="mt-4 text-indigo-500  text-lg lg:text-xl text-center font-semibold">
            Get unlimited access to all features.
          </p>
          <div className="py-4 text-3xl font-semibold text-gray-700  sm:text-4xl flex justify-center items-center gap-4">
            <span className="text-gray-500 line-through text-lg flex items-center">
              <PiCurrencyInr /> {originalPrice}
            </span>
            <span className="text-blue-800 text-4xl lg:text-5xl font-extrabold flex items-center text-shadow">
              <PiCurrencyInr /> {discountedPrice}
            </span>
          </div>
          <p className="mt-1 text-gray-500 text-sm md:text-base text-center">
            Subscription valid until{" "}
            <span className="font-bold">LDCE 2025</span> (Max 2 years from
            purchase date)
          </p>
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-5 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg font-semibold mt-6 "
            onClick={() => navigate("/subscribe")}
          >
            Subscribe Now <FaRegHandPointUp className="ml-3 text-xl" />
          </button>
          <hr className="border-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
