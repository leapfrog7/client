import { Link } from "react-router-dom";
import QuizDetails from "../components/QuizDetails";
import PricingSection from "../components/PricingSection";
import Dashboard from "../components/Dashboard";
import { useEffect } from "react";
// import axios from "axios";

const Home = ({
  isLoggedIn,
  username,
  isPaymentMade,
  fetchUserStats,
  userStats,
}) => {
  useEffect(() => {
    fetchUserStats();
  }, []);

  return (
    <div className="bg-white flex flex-col w-full xl:w-5/6 mx-auto">
      {!isPaymentMade && isLoggedIn && <AccountActivationNotice />}
      <div
        className={`flex flex-col lg:flex-row mx-auto items-center justify-center ${
          isLoggedIn ? (isPaymentMade ? "hidden" : "") : ""
        }`}
      >
        {/* Image Background Section */}
        <div className="w-full lg:w-2/5 md:w-1/2 md:h-auto flex items-center justify-center">
          <picture className="w-full h-full bg-cover bg-center">
            <source srcSet="/homeLarge2.png" media="(min-width: 1200px)" />
            <source srcSet="/homeLarge2.png" media="(min-width: 768px)" />
            <source srcSet="/homeLarge2.png" media="(max-width: 767px)" />
            <img
              src="/home1-large.png"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>
        {/* Text Section */}
        <div className="flex flex-col items-center justify-center w-full lg:w-3/5 p-4 lg:p-8">
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2">
            <div className="w-full md:w-3/5 flex items-center justify-center p-4 lg:p-8 bg-white">
              <div className="max-w-lg text-center md:text-left">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                  Welcome to Our Website
                </h1>
                <p className="text-base md:text-lg mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus imperdiet, nulla et dictum interdum, nisi lorem
                  egestas odio, vitae scelerisque enim ligula venenatis dolor.
                </p>
                <Link
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  to="/register"
                >
                  Register
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 lg:p-8 bg-white">
              <PricingSection />
            </div>
          </div>
        </div>
      </div>
      <div className={`${isLoggedIn ? (isPaymentMade ? "hidden" : "") : ""}`}>
        <QuizDetails />
      </div>

      {/* This is the DashBoard which should appear only when the user is logged In */}
      {isLoggedIn && isPaymentMade && (
        <div>
          <Dashboard userStats={userStats} username={username} />
        </div>
      )}
    </div>
  );
};

import PropTypes from "prop-types";
import AccountActivationNotice from "../components/AccountActivationNotice";

Home.propTypes = {
  isLoggedIn: PropTypes.bool,
  username: PropTypes.string,
  isPaymentMade: PropTypes.bool,
  fetchUserStats: PropTypes.func,
  userStats: PropTypes.object,
};

export default Home;
