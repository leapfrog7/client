import {
  FaBook,
  FaDatabase,
  FaQuestionCircle,
  FaHistory,
} from "react-icons/fa";
import { paperI_Items, paperII_Items } from "../data/quizDetails";

export default function QuizDetails() {
  return (
    <div className=" flex flex-col items-center justify-center p-4">
      <h1 className="text-xl md:text-3xl font-bold mb-8">
        MCQs available with explanation on these topics
      </h1>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Paper I */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center">
            <FaBook className="text-customPink mr-2" /> Paper I
          </h2>
          <div className="grid gap-8">
            {paperI_Items.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg shadow flex gap-2 items-center"
              >
                <item.icon className="text-pink-600 text-2xl mr-4 min-w-8" />
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paper II */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center">
            <FaBook className="text-customFuchsia mr-2" /> Paper II
          </h2>
          <div className="grid gap-8">
            {paperII_Items.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg shadow flex items-center"
              >
                <item.icon className="text-customPurple text-2xl mr-4 min-w-8" />
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats part */}
      <div className="my-6 flex flex-col items-center justify-center p-6 bg-gradient-to-r from-pink-100 to-purple-100 text-gray-700 rounded-lg shadow-lg">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          Stats of our 7000+ Question Bank
        </h1>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl text-center">
          {/* Total Questions */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center justify-center">
              <FaDatabase className="text-blue-600 mr-2" /> Total Questions
            </h2>
            <p className="text-lg md:text-xl font-bold">3,606 Questions</p>
            <p className="text-gray-600 mt-2">
              Explore a vast collection of questions covering various topics.
            </p>
            <p className="text-sm text-gray-600">(excluding AoBR)</p>
          </div>

          {/* AoBR Exclusive */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center justify-center">
              <FaQuestionCircle className="text-green-600 mr-2" /> AoBR
              Exclusive
            </h2>
            <p className="text-lg md:text-xl font-bold">2,204 Questions</p>
            <p className="text-gray-600 mt-2">
              Dive deep into AoBR with exclusive quizzes.
            </p>
          </div>

          {/* Previous Year Questions */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center justify-center">
              <FaHistory className="text-purple-600 mr-2" /> Previous Year
              Questions
            </h2>
            <p className="text-lg md:text-xl font-bold">1,200 Questions</p>
            <p className="text-gray-600 mt-2">
              Benchmark your preparation with previous year exams.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-lg md:text-xl font-semibold">
            Ready to test your knowledge?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              Start your quiz journey now!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
