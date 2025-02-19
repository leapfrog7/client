import { Link } from "react-router-dom";
import QuizDetails from "../components/QuizDetails";
import PricingSection from "../components/PricingSection";
import Dashboard from "../components/Dashboard";
import { useEffect } from "react";
import FeatureCarousel from "../components/FeatureCarousel";
import AccountActivationNotice from "../components/AccountActivationNotice";
import { Helmet } from "react-helmet";
import { SiTestrail } from "react-icons/si";
import { RiContactsBook3Line } from "react-icons/ri";
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
        className={`flex flex-col lg:flex-row mx-auto justify-center ${
          isLoggedIn ? (isPaymentMade ? "hidden" : "") : ""
        }`}
      >
        {/* Image Background Section */}
        <div className="lg:w-1/2 2xl:w-1/3 md:h-auto flex items-center justify-center flex-col my-2">
          <div className="w-full">
            <img
              src="/homeLarge2.png"
              alt="Homepage Background"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          <div className="mt-6 w-2/3 text-center">
            <p className="text-gray-600 text-sm">
              Curious about our quizzes? Try a free sample!
            </p>
            <a
              className="bg-customFuchsia text-white py-3 px-4 rounded-lg shadow hover:bg-fuchsia-700 transition duration-300 flex items-center 
                    justify-center gap-2 mt-4 inline-block"
              href="/pages/quiz/SampleQuiz"
            >
              <span>Take Sample Quiz</span> <SiTestrail />
            </a>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col w-full lg:w-1/2 lg:p-2">
          <div className="w-full flex flex-col items-center gap-6">
            <div className="text-center md:text-left px-2">
              <h1 className="text-2xl md:text-3xl font-bold my-4 text-center ">
                Welcome to <span className="text-customBlue">UnderSigned</span>
              </h1>
              <p className="text-base mb-4 text-gray-700 text-center">
                Our platform is designed to help you excel in your exams with a
                wide range of quizzes tailored specifically for LDCE aspirants.
              </p>
              <p className="text-base mb-4 text-gray-700 text-center">
                We equip you with all the essential tools for success, including
                progress tracking, bookmarking of important questions,
                topic-wise quizzes, and the option to focus exclusively on
                unattempted questions.
              </p>
              <div className="flex justify-center items-center">
                <Link
                  to="/register"
                  className="bg-cyan-800 rounded-md px-6 text-white my-4 py-2 flex items-center justify-center gap-2 hover:bg-cyan-500 w-1/2"
                >
                  <span>Register</span>
                  <RiContactsBook3Line className="text-xl" />
                </Link>
              </div>
            </div>

            <div className="w-full flex justify-center ">
              <PricingSection />
            </div>
          </div>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="lg:w-11/12 bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-200 text-gray-600 p-6 rounded-lg shadow-lg text-center mt-6 mx-2 lg:mx-auto">
          <p className="text-lg md:text-xl lg:text-2xl font-bold">
            Mock Test - Previous Year Questions (2016-17 to 2023) - SO LDCE
            {/* <span className="ml-2 inline-block bg-red-500 text-white text-xs md:text-sm font-semibold px-3 py-1 rounded-full shadow-md animate-pulse">
              NEW
            </span> */}
          </p>
          <p className="text-sm md:text-base mt-2">
            Enhance your preparation with a comprehensive collection of 1200
            PYQs designed for LDCE aspirants as mock tests.
          </p>
          <Link
            to="/subscribe"
            className="inline-block mt-4 bg-blue-800 text-white text-sm md:text-base font-medium px-6 py-2 rounded-lg shadow-md hover:bg-blue-500 transition duration-300"
          >
            Subscribe to Access
          </Link>
        </div>
      )}

      {/* Banner for PYQ LDCE 
      {!isLoggedIn && (
        <div className="bg-gradient-to-r from-pink-600 to-blue-800 text-white p-4 rounded-lg shadow-lg text-center mt-4">
          <p className="text-sm md:text-base lg:text-lg font-semibold">
            Now access - Previous Year Questions (2016-17 to 2023)- SO LDCE
            <span className=" ml-2 inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md animate-pulse">
              NEW
            </span>{" "}
          </p>
          <Link
            to="/register"
            className="pl-2 text-sm md:text-base lg:text-lg  text-yellow-200 text-lg hover:text-yellow-400 underline transition-colors duration-200 ease-in-out"
          >
            Login/Register to access
          </Link>
        </div>
      )} */}

      <div className="mx-auto overflow-y-auto mt-2">
        {!isLoggedIn && (
          <div>
            <h2 className="w-full mx-auto rounded-lg text-2xl font-bold text-center text-gray-700 mb-2 mt-4">
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

          <div className="bg-blue-100 border-l-4 border-blue-600 text-gray-800 px-2 py-4 md:px-6 rounded-md shadow-sm my-6 mx-1 flex items-center justify-between">
            {/* Text Section */}
            <div className="flex items-center gap-2 md:gap-4">
              <p className="text-base lg:text-lg font-medium">
                Access{" "}
                <span className="font-bold">Previous Year Questions</span> for
                SO LDCE
              </p>
            </div>

            {/* CTA Link */}
            <Link
              to="/pages/quiz/previousYear/Exam"
              className="text-blue-800 font-bold hover:text-blue-600 transition duration-200 ease-in-out bg-yellow-300 px-4 py-2 md: rounded-md text-sm md:text-base text-center"
            >
              Click Here →
            </Link>
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-200 mx-4 mb-8  py-4 rounded-lg shadow-md text-center">
          <p className="text-lg font-semibold text-gray-800">
            Still have questions?
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Check out our{" "}
            <Link
              to="/faqs"
              className="text-cyan-600 hover:text-cyan-800 font-bold underline transition duration-300 "
            >
              FAQs
            </Link>{" "}
            for more information.
          </p>
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
