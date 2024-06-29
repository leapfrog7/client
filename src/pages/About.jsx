import { FaRegLightbulb, FaRegGrinStars } from "react-icons/fa";
import { SiTarget } from "react-icons/si";
import { GiPathDistance } from "react-icons/gi";
import { Helmet } from "react-helmet";

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-yellow-100 py-10">
      <Helmet>
        <title>About Us - UnderSigned</title>
        <meta
          name="description"
          content="Learn more about Your Website Name, our vision, and how we strive to provide the best quizzes on various topics for SO LDCE."
        />
        <link rel="canonical" href="https://undersigned.netlify.app/about" />
        <meta property="og:title" content="About Us - UnderSigned" />
        <meta
          property="og:description"
          content="Learn more about Your Website Name, our vision, and how we strive to provide the best quizzes on various topics for SO LDCE."
        />
        <meta
          property="og:url"
          content="https://undersigned.netlify.app/about"
        />
        <meta property="og:type" content="website" />
      </Helmet>

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
              Determined to provide a better preparation platform for LDCE
              aspirants, we went back to the drawing board. We started from
              scratch, redesigning our entire system to deliver an enriched user
              experience. Significant improvements were made at the database
              schema level to ensure better performance and reliability.
            </p>
          </div>
          <div className="text-center">
            <SiTarget className="text-4xl md:text-5xl lg:text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">
              Our Vision
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              To create a platform for the officers belonging to Central
              Secretariat Service (CSS) to foster a more efficient, a more
              competent and a better informed work environment.
            </p>
          </div>
          <div className="text-center">
            <FaRegGrinStars className="text-4xl md:text-5xl lg:text-6xl text-fuchsia-700 mx-auto mb-4" />
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">
              Continuous Improvement
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              We are continuously working on enhancing our platform to meet and
              exceed our user&apos;s expectations. We have started with a test
              series for LDCE and with time we aim to add many more general
              features to realize our vision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
