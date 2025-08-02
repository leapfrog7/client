import { Link } from "react-router-dom";
import QuizDetails from "../components/QuizDetails";
import PricingSection from "../components/PricingSection";
import Dashboard from "../components/Dashboard";
import { useEffect } from "react";
// import FeatureCarousel from "../components/FeatureCarousel";
import AccountActivationNotice from "../components/AccountActivationNotice";
import { Helmet } from "react-helmet-async";
// import { SiTestrail } from "react-icons/si";
// import { RiContactsBook3Line } from "react-icons/ri";
import NewCarousel from "../components/NewCarousel";
import CTA from "../components/CTA";
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
    <div className="bg-white flex flex-col w-full xl:w-4/5 mx-auto">
      <Helmet>
        <title>Home - UnderSigned</title>
        <link rel="canonical" href="https://undersigned.in/" />
        <meta
          name="description"
          content="Welcome to the home page of UnderSigned. We offer test series in MCQ format for the Limited Departmental Competitive Examination (LDCE) conducted by Union Public Service Commission (UPSC) for promotion to SO or PS grade"
        />
        <meta
          name="keywords"
          content="UnderSigned, LDCE, Limited Departmental, Section Officer, Test Series, CCS CCA, Pension, Conduct, Leave Rules"
        />
        <meta property="og:title" content="UnderSigned| Prepare Smartly" />
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
        {/* <div className="lg:w-1/2 2xl:w-1/3 md:h-auto flex items-center justify-center flex-col my-2">
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
        </div> */}

        {/* Text Section */}
        {/* <div className="flex flex-col w-full lg:w-1/2 lg:p-2">
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
        </div> */}
      </div>

      <div
        className={`flex flex-col lg:flex-row mx-auto justify-center ${
          isLoggedIn ? (isPaymentMade ? "hidden" : "") : ""
        }`}
      >
        <CTA />
      </div>
      <div className={`${isLoggedIn ? (isPaymentMade ? "hidden" : "") : ""}`}>
        <PricingSection />
      </div>
      <div className={`${isLoggedIn ? (isPaymentMade ? "hidden" : "") : ""} `}>
        <QuickLinksCarousel />
      </div>

      <div className="mx-auto w-full overflow-y-auto mt-2">
        {!isLoggedIn && (
          <div>
            <NewCarousel />
          </div>
        )}
      </div>

      <div className={` ${isLoggedIn ? (isPaymentMade ? "hidden" : "") : ""}`}>
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
                SO LDCE{" "}
                <span className="animate-pulse text-[10px] md:text-xs text-white bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-1 rounded-full font-semibold shadow-sm">
                  2024 PYQ added
                </span>
              </p>
            </div>

            {/* CTA Link */}
            <Link
              to="/pages/quiz/previousYear/Exam"
              className="text-blue-800 font-bold hover:text-blue-600 transition duration-200 ease-in-out bg-yellow-300 px-4 py-2 md: rounded-md text-sm md:text-base text-center"
            >
              Click Here
            </Link>
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div className="bg-gradient-to-r from-teal-50 to-gray-100 mb-8  my-4 p-4 rounded-lg shadow-md text-center">
          <p className="text-base lg:text-lg font-semibold text-gray-800">
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
import QuickLinksCarousel from "../components/QuickLinksCarousel";

// import { Carousel } from "react-responsive-carousel";

Home.propTypes = {
  isLoggedIn: PropTypes.bool,
  username: PropTypes.string,
  isPaymentMade: PropTypes.bool,
  fetchUserStats: PropTypes.func,
  userStats: PropTypes.object,
};

export default Home;
