import { FaBook } from "react-icons/fa";
import { paperI_Items, paperII_Items } from "../data/quizDetails";

export default function QuizDetails() {
  return (
    <div className=" flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Our Papers</h1>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Paper I */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
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
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paper II */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
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
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
