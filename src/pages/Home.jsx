import { Link } from "react-router-dom";
import QuizDetails from "../components/QuizDetails";
import PricingSection from "../components/PricingSection";
import Dashboard from "../components/Dashboard";

const Home = ({ isLoggedIn, username }) => {
  //This contains the path for various pages of topics.
  const userStats = {
    paperI: [
      {
        title: "Constitution",
        progress: "75",
        path: "/pages/quiz/paper-i/Constitution",
      },
      { title: "RTI Act", progress: "50", path: "/pages/quiz/paper-i/rti-act" },
      { title: "DFPR", progress: "60", path: "/pages/quiz/paper-i/dfpr" },
      {
        title: "Parliamentary Procedure",
        progress: "80",
        path: "/pages/quiz/paper-i/parliamentary-procedure",
      },
    ],
    paperII: [
      {
        title: "Leave Rules",
        progress: "40",
        path: "/pages/quiz/paper-ii/leave-rules",
      },
      {
        title: "CCS CCA Rules",
        progress: "90",
        path: "/pages/quiz/paper-ii/ccs-cca-rules",
      },
      {
        title: "Pension Rules",
        progress: "70",
        path: "/pages/quiz/paper-ii/pension-rules",
      },
      {
        title: "Conduct Rules",
        progress: "55",
        path: "/pages/quiz/pages/quiz/paper-ii/conduct-rules",
      },
      { title: "GFR", progress: "65", path: "/pages/quiz/paper-ii/gfr" },
      {
        title: "Office Procedure",
        progress: "65",
        path: "/pages/quiz/paper-ii/csmop",
      },
    ],
  };

  return (
    <div className="bg-white flex flex-col w-full xl:w-5/6 mx-auto">
      <div
        className={`flex flex-col lg:flex-row mx-auto items-center justify-center ${
          isLoggedIn ? "hidden" : ""
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
      <div className={`${isLoggedIn ? "hidden" : ""}`}>
        <QuizDetails />
      </div>

      {/* This is the DashBoard which should appear only when the user is logged In */}
      {isLoggedIn && (
        <div>
          <Dashboard userStats={userStats} username={username} />
        </div>
      )}
    </div>
  );
};

import PropTypes from "prop-types";

Home.propTypes = {
  isLoggedIn: PropTypes.bool,
  username: PropTypes.string,
};

export default Home;
