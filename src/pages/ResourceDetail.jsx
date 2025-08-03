// ResourceDetail.jsx — Infinite scroll with anchor compatibility and swipe view
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdCancel } from "react-icons/md";
import { FaArrowLeft, FaRegImages, FaListUl } from "react-icons/fa";
import SectionCardFull from "./SectionCard";
import SwipeView from "./SwipeView"; // Re-integrated swipe view

const BASE_URL = "https://server-v4dy.onrender.com";
const itemsPerLoad = 10;

const ResourceDetail = () => {
  const { slug } = useParams();
  const [rule, setRule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingAnchor, setPendingAnchor] = useState(null);
  const [visibleCount, setVisibleCount] = useState(itemsPerLoad);
  const [nightMode, setNightMode] = useState(false);
  const [isSwipeView, setIsSwipeView] = useState(false);
  const loadMoreRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleToggle = () => setNightMode((prev) => !prev);
    window.addEventListener("toggleNightMode", handleToggle);
    return () => window.removeEventListener("toggleNightMode", handleToggle);
  }, []);

  useEffect(() => {
    const handleExit = () => setIsSwipeView(false);
    window.addEventListener("exitSwipe", handleExit);
    return () => window.removeEventListener("exitSwipe", handleExit);
  }, []);

  useEffect(() => {
    const fetchRule = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/public/resources/${slug}`
        );
        setRule(res.data);
      } catch (err) {
        console.error("Failed to load rule detail", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRule();
  }, [slug]);

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filteredSections = useMemo(() => {
    if (!rule) return [];
    if (searchTerm.length < 3) return rule.sections;
    const lower = searchTerm.toLowerCase();
    return rule.sections.filter((section) => {
      const inMetadata =
        section.ruleNumber?.toLowerCase().includes(lower) ||
        section.ruleTitle?.toLowerCase().includes(lower) ||
        section.chapterTitle?.toLowerCase().includes(lower);
      const inContentBlock = section.contentBlocks.some((b) => {
        if (
          (b.type === "text" || b.type === "note") &&
          typeof b.value === "string"
        ) {
          return b.value.toLowerCase().includes(lower);
        }
        if (b.type === "table" && Array.isArray(b.value)) {
          return b.value.some((row) =>
            row.some(
              (cell) =>
                typeof cell === "string" && cell.toLowerCase().includes(lower)
            )
          );
        }
        return false;
      });
      return inMetadata || inContentBlock;
    });
  }, [rule, searchTerm]);

  const visibleSections = useMemo(() => {
    return filteredSections.slice(0, visibleCount);
  }, [filteredSections, visibleCount]);

  useEffect(() => {
    if (!loading && rule) {
      const hash = window.location.hash;
      if (!hash) return;
      const targetIndex = rule.sections.findIndex((section) => {
        const anchorId = `section-${section.ruleNumber
          .replace(/\s+/g, "-")
          .toLowerCase()}`;
        return `#${anchorId}` === hash;
      });
      if (targetIndex !== -1) {
        setVisibleCount(Math.max(targetIndex + 5, itemsPerLoad));
        setPendingAnchor(hash);
      }
    }
  }, [loading, rule]);

  useEffect(() => {
    if (!pendingAnchor) return;
    const timeout = setTimeout(() => {
      const el = document.querySelector(pendingAnchor);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("ring-2", "ring-cyan-500", "rounded");
        setTimeout(
          () => el.classList.remove("ring-2", "ring-cyan-500", "rounded"),
          2000
        );
      }
      setPendingAnchor(null);
    }, 300);
    return () => clearTimeout(timeout);
  }, [visibleCount, pendingAnchor]);

  useEffect(() => {
    if (!filteredSections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < filteredSections.length
        ) {
          setTimeout(() => {
            setVisibleCount((prev) =>
              Math.min(prev + itemsPerLoad, filteredSections.length)
            );
          }, 400);
        }
      },
      { threshold: 1 }
    );
    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => el && observer.unobserve(el);
  }, [filteredSections, visibleCount]);

  const handleShare = (ruleNumber, ruleTitle) => {
    const anchorId = `section-${ruleNumber.replace(/\s+/g, "-").toLowerCase()}`;
    const shareUrl = `${window.location.origin}${window.location.pathname}#${anchorId}`;
    const shareText = `${ruleNumber} – ${ruleTitle}`;
    if (navigator.share) {
      navigator
        .share({ title: ruleTitle, text: shareText, url: shareUrl })
        .catch(console.warn);
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("📎 Link copied to clipboard!");
    }
  };

  if (loading || !rule) return <p className="p-4 text-center">Loading...</p>;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="p-2 md:p-8 md:w-11/12 mx-auto">
      <h1 className="text-xl md:text-2xl font-bold text-center mb-4 text-cyan-700">
        {rule.title}
      </h1>
      {rule.image && (
        <div className="mb-4">
          <img
            src={rule.image}
            alt={rule.title}
            className="w-full max-h-64 object-cover rounded"
          />
        </div>
      )}
      <p className="text-gray-700 mb-6 text-sm md:text-base text-center italic">
        {rule.description}
      </p>

      <div className="flex justify-around gap-3 mb-4">
        {/* Toggle swipe view (mobile only) */}
        <button
          onClick={() => setIsSwipeView((prev) => !prev)}
          className="md:hidden flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-700 border border-blue-200 rounded-md bg-blue-50 hover:bg-blue-100"
        >
          {isSwipeView ? (
            <>
              <FaListUl className="text-xs" /> List View
            </>
          ) : (
            <>
              <FaRegImages className="text-xs" /> Swipe View
            </>
          )}
        </button>

        <button
          onClick={() => navigate("/pages/public/resources")}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-teal-700 border border-teal-300 rounded-md bg-teal-50 hover:bg-teal-100"
        >
          <FaArrowLeft className="text-xs" /> Back to Resources
        </button>
      </div>

      <form
        className="flex items-center max-w-3xl mx-auto my-4 px-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
              />
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 p-2.5"
            placeholder="Search section title or content..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(itemsPerLoad);
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              aria-label="Clear search"
            >
              <MdCancel size={18} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="ml-2 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </form>

      <div className="inline-flex items-center justify-center w-full">
        <hr className="w-64 h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
        <span className="text-sm absolute px-3 font-medium text-gray-500 -translate-x-1/2 bg-white left-1/2 "></span>
      </div>

      {isSwipeView && isMobile ? (
        <SwipeView
          sections={filteredSections}
          searchTerm={searchTerm}
          startIndex={0}
          nightMode={nightMode}
        />
      ) : (
        <>
          <ul className="space-y-4 mt-4" id="sections-title">
            {visibleSections.map((section, idx) => (
              <SectionCardFull
                key={idx}
                index={idx}
                section={section}
                searchTerm={searchTerm}
                isExpanded={expandedSections[idx] || false}
                toggleSection={toggleSection}
                renderAnchorId={(ruleNumber) =>
                  `section-${ruleNumber.replace(/\s+/g, "-").toLowerCase()}`
                }
                handleShare={handleShare}
              />
            ))}
          </ul>

          <div ref={loadMoreRef} className="text-center py-4">
            {visibleCount < filteredSections.length && (
              <span className="text-sm text-gray-500 animate-pulse">
                Loading more sections…
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ResourceDetail;
