import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaRegHandPointUp } from "react-icons/fa";
import { PiCurrencyInr } from "react-icons/pi";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const PricingSection = () => {
  const originalPrice = 1200;
  const discountedPrice = 1000;

  return (
    <div className="bg-white shadow-md rounded-lg max-w-md mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4 text-customBlue">Pricing</h2>
      <div className="mb-4">
        <div className="flex justify-center items-baseline space-x-2">
          <PiCurrencyInr />{" "}
          <span className="text-gray-500 line-through text-lg">
            {originalPrice}
          </span>
          <PiCurrencyInr />{" "}
          <span className="text-yellow-500 text-3xl font-bold">
            {discountedPrice}/yr
          </span>
        </div>
        <p className="text-gray-600 text-sm">Limited time offer!</p>
      </div>
      <button className="bg-white text-customBlue border-blue-800 border px-8 py-2 rounded-lg hover:bg-customBlue hover:text-white transition duration-300 flex items-center justify-center mx-auto">
        Subscribe <FaRegHandPointUp className="ml-2 hover:text-white" />
      </button>
      <div className="flex justify-center mt-6 space-x-2 min-w-56 gap-2 text-sm">
        <div className="flex items-center text-customPink bg-pink-100 px-4 py-2 rounded-md">
          <FontAwesomeIcon icon={faCheck} className="text-customPink mr-2" />
          <span>Paper 1</span>
        </div>
        <div className="flex items-center text-customPurple bg-purple-100 px-4 py-2 rounded-md">
          <FontAwesomeIcon icon={faCheck} className="mr-2" />
          <span>Paper 2</span>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
