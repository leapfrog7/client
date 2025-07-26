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
import PageFeedback from "../components/PageFeedback";

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
        <div className="mx-auto max-w-4xl text-center mb-10">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-normal text-gray-800 mb-2">
            <span role="img" aria-label="resources" className="mr-2">
              📑
            </span>
            Resources
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
            Your central hub for all essential Government Rules and Regulations.
            Easily navigate and stay informed.
          </p>

          {/* Search Input */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search titles, summaries..."
              className="w-full pl-10 pr-10 py-2.5 md:py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-sm text-sm sm:text-base transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Search Icon (left) */}
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <AiOutlineSearch className="h-5 w-5" />
            </div>

            {/* Clear Button (right) */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <AiOutlineClose className="h-5 w-5" />
              </button>
            )}
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
              className="rounded-2xl ring-1 ring-blue-100 bg-white p-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between"
            >
              {/* Title Section */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-2xl">
                    {getIconForRule(rule)}
                  </span>
                  <h2 className="text-sm sm:text-lg font-semibold text-gray-700 line-clamp-2">
                    {rule.title}
                  </h2>
                </div>
                {/* Type Badge */}
                <span className=" hidden md:inline-block ml-2 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {rule.type || "Rule"}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs md:text-sm text-gray-600 line-clamp-4 md:line-clamp-3 mb-4 leading-snug">
                {rule.description}
              </p>

              {/* Button */}
              <button
                onClick={() => navigate(`/pages/public/resources/${rule.slug}`)}
                className="text-xs md:text-base group inline-flex items-center justify-center gap-2 font-medium px-2 md:px-4 py-2 rounded-md border border-cyan-600 text-cyan-700 bg-white hover:bg-cyan-50 transition-colors duration-200"
              >
                See Complete
                <AiOutlineArrowRight className="text-sm md:text-base group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      )}

      <blockquote className="px-4 mt-16 text-xl italic font-semibold text-gray-500">
        <hr className="h-px my-8 bg-gray-200 border-0 "></hr>
        <p className="text-center">We are in process of adding more rules...</p>
        <hr className="h-px my-8 bg-gray-200 border-0 "></hr>
      </blockquote>

      <div className="mt-24 bg-gradient-to-r from-cyan-50 to-blue-50 border border-blue-100 rounded-xl shadow-md p-6 my-8 max-w-4xl mx-auto">
        <h2 className="text-sm md:text-xl font-semibold text-blue-800 mb-3 text-center">
          Why This Matters? 🤔💭
        </h2>
        <p className="text-xs md:text-base text-gray-700 leading-relaxed">
          Government rules and guidelines, frequently needed for Secretariat
          work, are freely available but scattered across various platforms —
          often buried in unsearchable or hard-to-navigate PDFs. At{" "}
          <span className="font-medium text-blue-900">UnderSigned</span>, our
          mission is to build a
          <span className="font-semibold text-blue-700">
            {" "}
            unified, searchable, and free repository{" "}
          </span>
          of publicly available government content — from rules and circulars to
          manuals and notifications. We believe access to such knowledge should
          be
          <span className="font-semibold text-pink-700">
            {" "}
            effortless, empowering,{" "}
          </span>
          and{" "}
          <span className="font-semibold text-pink-700">
            {" "}
            freely available
          </span>{" "}
          to every government employee .
        </p>
      </div>
      <PageFeedback pageSlug="/main_resource page" />
    </div>
  );
};

export default PublicResources;
