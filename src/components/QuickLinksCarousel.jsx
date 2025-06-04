import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Icons from react-icons
import {
  FaBalanceScale,
  FaChartLine,
  FaHospitalSymbol,
  FaBook,
} from "react-icons/fa";

const QuickLinksCarousel = ({
  title = "Quick and Free Links",
  linksData = [
    {
      title: "NPS or UPS",
      subtitle:
        "Compare your retirement options with the most comprehensive tool",
      url: "/pages/public/nps-or-ups",
      icon: FaBalanceScale,
    },
    {
      title: "7th CPC Matrix",
      subtitle: "Seamlessly navigate entire pay matrix with your fingertips",
      url: "/pages/public/7thCPC-paymatrix",
      icon: FaChartLine,
    },
    {
      title: "CGHS Units",
      subtitle: "Search CGHS Hospitals and areas nearby in Delhi-NCR",
      url: "/pages/public/cghs-units",
      icon: FaHospitalSymbol,
    },
    {
      title: "Govt Rules",
      subtitle: "Search Important Rules and Regulations at one place.",
      url: "/pages/public/resources",
      icon: FaBook,
    },
    // {
    //   title: "Govt Rules",
    //   subtitle: "Resource Repository",
    //   url: "/pages/public/resources",
    //   icon: FaBook,
    // },
  ],
}) => {
  return (
    <div className="my-2 w-full mx-auto text-center">
      <div className="max-w-7xl mx-auto px-4">
        <div className="p-[1px] rounded-xl bg-gradient-to-r from-pink-400 via-green-400 to-blue-400">
          <div className="rounded-xl bg-white p-4">
            <h2 className="text-base md:text-xl lg:text-2xl font-semibold mb-4 text-gray-800 flex justify-center items-center gap-2">
              {title}
              <span className="relative text-xs font-semibold text-white bg-pink-500 px-1.5 py-0.5 rounded-md">
                New
                <span className="absolute inset-0 rounded-sm bg-red-500 opacity-75 animate-ping z-[-1]"></span>
              </span>
            </h2>

            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-4">
                {linksData.map((link, idx) => (
                  <Link
                    to={link.url}
                    key={idx}
                    className="min-w-[200px] max-w-[220px] bg-white rounded-xl shadow-md p-4 flex-shrink-0 border border-gray-100 hover:shadow-lg transition-transform hover:scale-[1.03]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-xl md:text-2xl text-blue-600">
                        {React.createElement(link.icon)}
                      </div>
                      <h3 className="text-sm md:text-base font-semibold text-gray-900">
                        {link.title}
                      </h3>
                    </div>

                    <p className="text-xs md:text-sm text-gray-600 leading-snug line-clamp-2">
                      {link.subtitle}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

QuickLinksCarousel.propTypes = {
  title: PropTypes.string,
  linksData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      url: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
    })
  ),
};

export default QuickLinksCarousel;
