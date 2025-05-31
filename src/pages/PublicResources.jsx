import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineArrowRight,
} from "react-icons/ai";
// import { FaBookOpen } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const BASE_URL = "https://server-v4dy.onrender.com";
// const BASE_URL = "http://localhost:5000";

const getIconForRule = (rule) => {
  if (rule.title.toLowerCase().includes("constitution")) {
    return "🇮🇳"; // or use 🇮🇳, 🏛️, 📜 based on your preference
  }

  const iconMap = {
    Rule: "📘",
    Act: "📜",
    Manual: "🧾",
    Circular: "📄",
    Order: "🗂️",
  };

  return iconMap[rule.type] || "📚";
};

const PublicResources = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/public/resources`);
        setResources(
          res.data.filter(
            (rule) => rule.description && rule.description.trim().length > 0
          )
        );
      } catch (err) {
        console.error("Failed to fetch resources", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter((rule) => {
    const lower = searchTerm.toLowerCase();
    return (
      rule.title.toLowerCase().includes(lower) ||
      rule.description?.toLowerCase().includes(lower) ||
      rule.tags?.some((tag) => tag.toLowerCase().includes(lower))
    );
  });

  return (
    <div className="p-4 md:p-8 md:w-11/12  min-h-screen mx-auto">
      <Helmet>
        <title>Government Rules & Acts Directory | UnderSigned</title>
        <meta
          name="description"
          content="Access a centralized hub of government rules, acts, circulars, and manuals including GFR, FRSR, and more. Browse rule-wise explanations and bookmark important sections."
        />
        <link
          rel="canonical"
          href="https://undersigned.in/pages/public/resources"
        />
      </Helmet>

      <div className="py-1">
        <div className=" mx-auto ">
          <h1 className="text-2xl text-cyan-600 font-semibold text-center  tracking-wide mb-1 sm:text-2xl md:text-3xl">
            {/* <FaBookOpen className="inline-block mr-2 align-middle" />{" "} */}
            <span className="font-extrabold tracking-wider">📚 Resources</span>
          </h1>
          <h2 className="font-style: italic text-sm md:text-base mb-6 text-center text-gray-500">
            Your central hub for all essential Government Rules and Regulations.
            Easily navigate and stay informed.
          </h2>
          <div className="mb-6 sm:mb-8">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                placeholder="Search titles, summaries..."
                className="w-full border border-gray-300 rounded-md py-2 px-3 pr-8 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none sm:pr-3">
                {!searchTerm && (
                  <AiOutlineSearch className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
                )}
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute top-1/2 right-1.5 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none sm:right-2"
                >
                  <AiOutlineClose className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : filteredResources.length === 0 ? (
        <p className="text-center text-gray-500">No matching rules found.</p>
      ) : (
        <div className=" grid gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xlg:grid-cols-5">
          {filteredResources.map((rule) => (
            <div
              key={rule.slug}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
            >
              {/* Title Bar */}
              <div className="bg-gradient-to-r from-pink-50 to-cyan-50 p-3 flex items-center justify-between rounded-t-xl border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl lg:text-2xl">
                    {getIconForRule(rule)}
                  </span>
                  <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 line-clamp-2">
                    {rule.title}
                  </h2>
                </div>
              </div>

              {/* Image Section */}
              {rule.image && (
                <img
                  src={rule.image}
                  alt={rule.title}
                  className="w-full h-40 object-cover rounded-b-none rounded-t-none"
                />
              )}

              {/* Description */}
              <div className="px-4 py-3 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {rule.description}
                </p>
              </div>

              {/* Button */}
              <div className="px-2 pb-4 mx-auto">
                <button
                  onClick={() =>
                    navigate(`/pages/public/resources/${rule.slug}`)
                  }
                  className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors duration-200"
                >
                  View Details <AiOutlineArrowRight className="text-base" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <blockquote className="px-4 mt-16 text-xl italic font-semibold text-gray-500">
        <hr className="h-px my-8 bg-gray-200 border-0 "></hr>
        <p className="text-center">We are in process of adding more rules...</p>
        <hr className="h-px my-8 bg-gray-200 border-0 "></hr>
      </blockquote>
    </div>
  );
};

export default PublicResources;
