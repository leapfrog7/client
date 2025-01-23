import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaRegHandPointUp } from "react-icons/fa";
import { PiCurrencyInr } from "react-icons/pi";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
// import { SiTestrail } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const originalPrice = 1499;
  const discountedPrice = 1199;
  const navigate = useNavigate();

  return (
    <div className="shadow-md rounded-lg mx-auto px-12 py-2 text-center bg-orange-50">
      <h2 className="text-2xl font-bold mb-4 text-customBlue">
        Simplified Pricing
      </h2>

      <div className="mb-6">
        <div className="text-lg flex justify-center items-baseline space-x-2">
          <span className="text-gray-500 line-through flex items-center">
            <PiCurrencyInr /> {originalPrice}
          </span>
          <span className="text-yellow-500 text-2xl font-bold flex items-center">
            <PiCurrencyInr /> {discountedPrice}
          </span>
        </div>
        <p className="text-gray-600 text-sm mt-1">
          Subscription valid until the{" "}
          <span className="font-bold">LDCE 2025</span> <br />
          <span className="text-xs">
            {" "}
            (Maximum validity: 2 years from purchase date)
          </span>
        </p>
      </div>

      <button
        className="bg-customBlue text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300 flex items-center justify-center mx-auto"
        onClick={() => navigate("/subscribe")}
      >
        Subscribe Now <FaRegHandPointUp className="ml-2 text-lg" />
      </button>
      {/* <p className="text-sm py-2 text-pink-800">includes</p> */}
      <div className="flex justify-center my-4 space-x-2 text-sm">
        <div className="flex items-center text-customPink bg-pink-100 px-6 py-2 rounded-md shadow">
          <FontAwesomeIcon icon={faCheck} className="text-customPink mr-1" />
          <span className="px-2">Paper 1</span>
        </div>
        <div className="flex items-center text-customPurple bg-purple-100 px-6 py-2 rounded-md shadow">
          <FontAwesomeIcon icon={faCheck} className="mr-1" />
          <span className="px-2">Paper 2</span>
        </div>
      </div>
      <div className="flex items-center text-customBlue bg-blue-100 px-6 py-2 rounded-md shadow mb-2">
        <FontAwesomeIcon icon={faCheck} className="mr-1" />
        <span className="px-2">Previous Year Questions</span>
      </div>

      {/* <div className="mt-6">
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
      </div> */}
    </div>
  );
};

export default PricingSection;
