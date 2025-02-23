import { SiTestrail } from "react-icons/si";
import { RiContactsBook3Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full p-8 gap-12 max-w-7xl mx-auto">
      {/* Text Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-700 leading-tight">
          Stay Ahead of the Competition{" "}
          <motion.span
            className="text-blue-700"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.0 }}
          >
            <div className="bg-white w-full h-auto pt-2">
              <h2 className="text-4xl lg:text-5xl font-manrope font-black leading-snug text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 lg:py-4">
                Prepare Smarter!
              </h2>
            </div>
          </motion.span>
        </h1>

        <div className="mt-6 space-y-4 lg:space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            {/* <motion.p
              className="text-base lg:text-xl text-gray-700 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.0 }}
            >
              Designed to help you{" "}
              <motion.span
                className="text-blue-700"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                excel
              </motion.span>{" "}
              in your exams.
            </motion.p> */}
            <p className="text-base lg:text-xl text-gray-700 font-medium">
              Designed to help you excel in your exams.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">📈</span>
            <p className="text-base lg:text-xl text-gray-700 font-medium">
              Track progress & bookmark key questions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">🎯</span>
            <p className="text-base lg:text-xl text-gray-700 font-medium">
              Focus on topic-wise quizzes & targeted learning.
            </p>
          </div>
        </div>

        <Link
          to="/register"
          className="mt-8 bg-cyan-800 rounded-full px-8 py-3 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-cyan-600 transition-all duration-300 w-full max-w-xs shadow-lg hover:shadow-xl"
        >
          <span>Register Now</span>
          <RiContactsBook3Line className="text-2xl" />
        </Link>
      </div>

      {/* Image Background Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center">
        <img
          src="/newHome.png"
          alt="Homepage Background"
          className="w-full h-auto object-cover rounded-2xl"
        />
        <div className="mt-6 text-center w-full max-w-sm">
          <p className="text-gray-500 text-sm tracking-wide uppercase">
            Curious about our quizzes?
          </p>
          <a
            className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white py-3 px-6 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 w-full text-lg font-medium"
            href="/pages/quiz/SampleQuiz"
          >
            <span>Take Sample Quiz</span> <SiTestrail className="text-xl" />
          </a>
        </div>
      </div>
    </div>
  );
}
