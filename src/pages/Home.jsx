import { Link } from "react-router-dom";
import QuizDetails from "../components/QuizDetails";
import PricingSection from "../components/PricingSection";
import Dashboard from "../components/Dashboard";
import { useEffect } from "react";
import FeatureCarousel from "../components/FeatureCarousel";
import AccountActivationNotice from "../components/AccountActivationNotice";
import { Helmet } from "react-helmet";
// import Carousel_N from "../components/Carousel_N";

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
      <Helmet>
        <title>Home Page - UnderSigned</title>
        <meta
          name="description"
          content="Welcome to the home page of UnderSigned. We offer test series in MCQ format for the Limited Departmental Competitive Examination (LDCE) conducted by Union Public Service Commission (UPSC) for promotion to SO or PS grade"
        />
        <meta
          name="keywords"
          content="UnderSigned, LDCE, Limited Departmental, Section Officer, Test Series, CCS CCA, Pension, Conduct, Leave Rules"
        />
        <meta property="og:title" content="Home Page - Your React App" />
        <meta
          property="og:description"
          content="Welcome to the home page of UnderSigned. We offer test series in MCQ format for the Limited Departmental Competitive Examination (LDCE) conducted by Union Public Service Commission (UPSC)"
        />
        <meta property="og:type" content="website" />
      </Helmet>

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
                  Welcome to{" "}
                  <span className="text-customBlue">UnderSigned</span>
                </h1>
                <p className="text-base md:text-lg mb-4 text-gray-700">
                  Our platform is designed to help you excel in your exams with
                  a wide range of quizzes tailored specifically for LDCE
                  aspirants.
                </p>
                <p className="text-base md:text-lg mb-4 text-gray-700">
                  We equip you with all the essential tools for success,
                  including progress tracking, bookmarking of important
                  questions, topic-wise quizzes, and the option to focus
                  exclusively on unattempted questions.
                </p>
                <Link
                  className="bg-blue-500 text-white my-4 px-6 py-2 rounded hover:bg-blue-600"
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
      <div className="max-w-screen-lg mx-auto overflow-y-auto">
        {!isLoggedIn && (
          <div>
            <h2 className="max-w-80 mx-auto rounded-lg text-2xl font-bold text-center text-gray-700 mb-2 ">
              Features
            </h2>
            <FeatureCarousel />
          </div>
        )}
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

// import { Carousel } from "react-responsive-carousel";

Home.propTypes = {
  isLoggedIn: PropTypes.bool,
  username: PropTypes.string,
  isPaymentMade: PropTypes.bool,
  fetchUserStats: PropTypes.func,
  userStats: PropTypes.object,
};

export default Home;
