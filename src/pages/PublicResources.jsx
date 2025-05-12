import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { FaBookOpen } from "react-icons/fa";

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
        setResources(res.data);
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
      <div className="py-1">
        <div className=" mx-auto ">
          <h1 className="text-xl text-cyan-600 font-semibold text-center  tracking-wide mb-1 sm:text-2xl md:text-3xl">
            <FaBookOpen className="inline-block mr-2 align-middle" /> Resources
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
              className="border py-4 shadow-sm hover:shadow-md transition-all bg-white flex flex-col justify-between rounded"
            >
              <div className="min-h-16">
                <div className="flex items-center justify-center gap-1 md:gap-2 lg:gap-4 mb-2 bg-teal-50 w-full">
                  <span className="text-lg lg:text-3xl ml-2">
                    {getIconForRule(rule)}
                  </span>

                  <h2 className="text-center text-sm md:text-base lg:text-lg font-semibold text-gray-800 mr-2">
                    {rule.title}
                  </h2>
                </div>
                {rule.image && (
                  <img
                    src={rule.image}
                    alt={rule.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <p className="text-xs md:text-sm lg:text-base text-gray-600 line-clamp-3 px-4">
                  {rule.description}
                </p>
              </div>
              <div className="mx-4 mt-6 lg:mx-16">
                <button
                  onClick={() =>
                    navigate(`/pages/public/resources/${rule.slug}`)
                  }
                  className="w-full text-center px-4 py-2 text-sm font-medium bg-cyan-500 text-white rounded hover:bg-cyan-700 transition"
                >
                  Expand
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicResources;
