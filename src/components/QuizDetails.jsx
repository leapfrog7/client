import PropTypes from "prop-types";
import {
  FaBook,
  FaDatabase,
  FaQuestionCircle,
  FaHistory,
} from "react-icons/fa";
import { paperI_Items, paperII_Items } from "../data/quizDetails";

export default function QuizDetails() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-xl md:text-2xl font-bold text-center mt-4 lg:mt-12">
        Topics Currently Available
      </h1>

      <div className="text-center mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 w-full">
        {/* Paper I */}
        <PaperSection
          title="Paper I"
          items={paperI_Items}
          iconColor="text-customPink"
        />
        {/* Paper II */}
        <PaperSection
          title="Paper II"
          items={paperII_Items}
          iconColor="text-customFuchsia"
        />
      </div>

      {/* Stats Section */}
      <div className="w-full bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg shadow-lg text-gray-700 text-center">
        <h1 className="text-xl lg:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          Stats of Our 7500+ Question Bank
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
          <StatCard
            icon={FaDatabase}
            color="text-blue-600"
            title="Total Questions"
            count="4,129"
            description="Explore a vast collection of questions covering various topics."
            footnote="(excluding AoBR)"
          />
          <StatCard
            icon={FaQuestionCircle}
            color="text-green-600"
            title="AoBR Exclusive"
            count="2,204"
            description="Dive deep into AoBR with exclusive quizzes."
          />
          <StatCard
            icon={FaHistory}
            color="text-purple-600"
            title="Previous Year Questions"
            count="1,200"
            description="Benchmark your preparation with previous year exams."
          />
        </div>

        <p className="text-base lg:text-xl font-semibold mt-6">
          Ready to test your knowledge?{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Start your LDCE journey now!
          </span>
        </p>
      </div>
    </div>
  );
}

function PaperSection({ title, items, iconColor }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-base lg:text-xl font-semibold mb-4 flex items-center">
        <FaBook className={`${iconColor} mr-2`} /> {title}
      </h2>
      <div className="grid grid-cols-2 gap-2 md:gap-4 lg:gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-lg shadow flex items-center gap-2 text-center"
          >
            <div className="mx-auto flex flex-col items-center justify-center lg:flex-row gap-2 lg:gap-4">
              <item.icon className="text-xl text-pink-600 min-w-8 lg:min-w-8" />
              <div>
                <h3 className="text-base 2xl:text-xl font-semibold lg:text-left">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm 2xl:text-base lg:text-left">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

PaperSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
    })
  ).isRequired,
  iconColor: PropTypes.string.isRequired,
};

function StatCard({ icon: Icon, color, title, count, description, footnote }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg transition-shadow duration-300 ease-in-out transform">
      <h2 className="text-base lg:text-xl font-semibold mb-2 flex items-center justify-center">
        <Icon className={`${color} mr-2`} /> {title}
      </h2>
      <p className="text-sm lg:text-base font-bold">{count} Questions</p>
      <p className="text-gray-600 mt-2 text-xs md:text-sm lg:text-base">
        {description}
      </p>
      {footnote && (
        <p className="text-xs md:text-sm text-gray-500 mt-1">{footnote}</p>
      )}
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  footnote: PropTypes.string,
};
