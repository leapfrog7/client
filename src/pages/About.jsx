import { FaRegLightbulb, FaRegChartBar, FaRegGrinStars } from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-yellow-100 py-10">
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 text-center mb-8">
          About Us
        </h1>
        <div className="space-y-8">
          <div className="text-center">
            <FaRegLightbulb className="text-4xl md:text-5xl lg:text-6xl text-yellow-500 mx-auto mb-4" />
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">
              Understanding the Challenge
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              We understand the challenges faced by aspirants preparing for the
              Limited Departmental Competitive Exam (LDCE). Traditional methods
              of preparing for MCQs, such as taking printouts and manually
              managing them, are not only outdated but also inefficient. This
              frustration during our own exam preparations led us to seek a
              better solution.
            </p>
          </div>
          <div className="text-center">
            <GiPathDistance className="text-5xl md:text-6xl lg:text-7xl text-blue-500 mx-auto mb-4" />
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">
              Our Journey
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              In response to this need, we launched the Leapfrog Series last
              year. While it met some of our initial goals, we realized that
              there was room for improvement. The feedback from our users
              highlighted the need for more options and enhanced features.
            </p>
          </div>
          <div className="text-center">
            <FaRegChartBar className="text-4xl md:text-5xl lg:text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">
              Our Vision
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              Determined to provide a better preparation platform for LDCE
              aspirants, we went back to the drawing board. We started from
              scratch, redesigning our entire system to deliver an enriched user
              experience. Significant improvements were made at the database
              schema level to ensure better performance and reliability.
            </p>
          </div>
          <div className="text-center">
            <FaRegGrinStars className="text-4xl md:text-5xl lg:text-6xl text-fuchsia-700 mx-auto mb-4" />
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">
              Continuous Improvement
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              We are continuously working on enhancing our platform to meet and
              exceed our user&apos;s expectations. We hope that our subscribers
              will appreciate the changes and improvements we have made and will
              continue to support us in our journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
