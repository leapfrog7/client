import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import SectionCard from "./SectionCard"; // Adjust path if needed
import SwipeView from "./SwipeView"; // adjust path
import { FaListUl, FaRegImages, FaArrowLeft } from "react-icons/fa";

const BASE_URL = "https://server-v4dy.onrender.com";
// const BASE_URL = "http://localhost:5000";

const itemsPerPage = 5; // You can adjust this value

const ResourceDetail = () => {
  const { slug } = useParams();
  const [rule, setRule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingAnchor, setPendingAnchor] = useState(null);
  const [isSwipeView, setIsSwipeView] = useState(false);

  const navigate = useNavigate();

  const [nightMode, setNightMode] = useState(false);

  useEffect(() => {
    const handleToggle = () => setNightMode((prev) => !prev);
    window.addEventListener("toggleNightMode", handleToggle);
    return () => window.removeEventListener("toggleNightMode", handleToggle);
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
        const targetPage = Math.floor(targetIndex / itemsPerPage) + 1;
        setPendingAnchor(hash); // store it temporarily
        setCurrentPage(targetPage); // trigger re-render
      }
    }
  }, [loading, rule]);

  useEffect(() => {
    if (!pendingAnchor) return;

    let attempts = 0;
    const maxAttempts = 20;

    const scrollToAnchor = () => {
      console.log("Trying to scroll to", pendingAnchor);
      const el = document.querySelector(pendingAnchor);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("ring-2", "ring-cyan-500", "rounded");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-cyan-500", "rounded");
        }, 2000);
        setPendingAnchor(null);
      } else if (attempts < maxAttempts) {
        attempts++;
        requestAnimationFrame(scrollToAnchor); // Keep retrying
      }
    };

    scrollToAnchor();
  }, [currentPage, pendingAnchor]);

  useEffect(() => {
    const handleExit = () => setIsSwipeView(false);
    window.addEventListener("exitSwipe", handleExit);
    return () => window.removeEventListener("exitSwipe", handleExit);
  }, []);

  if (loading || !rule) return <p className="p-4 text-center">Loading...</p>;

  const filteredSections =
    searchTerm.length >= 3
      ? rule.sections.filter((section) => {
          const lower = searchTerm.toLowerCase();

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
                    typeof cell === "string" &&
                    cell.toLowerCase().includes(lower)
                )
              );
            }

            return false;
          });

          return inMetadata || inContentBlock;
        })
      : rule.sections;

  const totalSections = filteredSections.length;
  const totalPages = Math.ceil(totalSections / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSections = filteredSections.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Optionally scroll to the sections
    window.scrollTo({
      top: document.querySelector("#sections-title")?.offsetTop - 80,
      behavior: "smooth",
    });
  };

  const handleShare = (ruleNumber, ruleTitle) => {
    const anchorId = `section-${ruleNumber.replace(/\s+/g, "-").toLowerCase()}`;
    const shareUrl = `${window.location.origin}${window.location.pathname}#${anchorId}`;
    const shareText = `${ruleNumber} – ${ruleTitle}`;

    if (navigator.share) {
      navigator
        .share({
          title: ruleTitle,
          text: shareText,
          url: shareUrl,
        })
        .catch((err) => console.warn("Share cancelled or failed", err));
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("📎 Link copied to clipboard!");
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    // const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    const visiblePageNumbers = new Set();
    const adjacentPagesLarge = 2; // Number of pages to show on each side for larger screens
    const adjacentPagesSmall = 1; // Number of pages to show on each side for smaller screens
    const isMobile = window.innerWidth < 640; // Example breakpoint for mobile (can adjust)
    const adjacentPages = isMobile ? adjacentPagesSmall : adjacentPagesLarge;

    visiblePageNumbers.add(1);
    visiblePageNumbers.add(currentPage);
    visiblePageNumbers.add(totalPages);

    for (
      let i = Math.max(2, currentPage - adjacentPages);
      i <= Math.min(totalPages - 1, currentPage + adjacentPages);
      i++
    ) {
      visiblePageNumbers.add(i);
    }

    const sortedVisiblePageNumbers = Array.from(visiblePageNumbers).sort(
      (a, b) => a - b
    );
    const paginationItems = [];

    const addEllipsis = (index, array) => {
      if (index > 0 && array[index] - array[index - 1] > 1) {
        paginationItems.push(
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-1 text-xs md:text-sm"
          >
            ...
          </span>
        );
      }
    };

    paginationItems.push(
      currentPage > 1 && (
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 text-xs md:text-sm rounded-md bg-teal-50 text-gray-700 hover:bg-gray-200 mr-2 flex items-center"
        >
          <AiOutlineLeft className="mr-1  text-teal-700" />
        </button>
      )
    );

    sortedVisiblePageNumbers.forEach((number, index) => {
      addEllipsis(index, sortedVisiblePageNumbers);
      paginationItems.push(
        <button
          key={number}
          onClick={() => handlePageChange(number)}
          className={`px-3 py-1 text-xs md:text-sm rounded-md ${
            currentPage === number
              ? "bg-teal-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } mx-1`}
        >
          {number}
        </button>
      );
    });

    paginationItems.push(
      currentPage < totalPages && (
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 text-xs md:text-sm rounded-md bg-teal-50 text-gray-700 hover:bg-gray-200 ml-2 flex items-center"
        >
          <AiOutlineRight className="ml-1 text-teal-700" />
        </button>
      )
    );

    return (
      <div className="flex justify-center mt-6 mb-4">{paginationItems}</div>
    );
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="p-2 md:p-8 md:w-11/12 mx-auto">
      <h1 className="text-xl md:text-2xl font-bold text-center mb-4 text-cyan-700 antialiased ">
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
      <p className="text-gray-700 mb-6 text-sm md:text-base text-center font-style: italic">
        {rule.description}
      </p>
      <div className="flex justify-around gap-3 mb-4">
        {/* Swipe View Toggle (only on mobile) */}
        <button
          onClick={() => setIsSwipeView((prev) => !prev)}
          className="md:hidden flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-700 border border-blue-200 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          {isSwipeView ? (
            <>
              <FaListUl className="text-xs" />
              List View
            </>
          ) : (
            <>
              <FaRegImages className="text-xs" />
              Swipe View
            </>
          )}
        </button>

        {/* Back to Resources (always visible) */}
        <button
          onClick={() => navigate("/pages/public/resources")}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-teal-700 border border-teal-300 rounded-md bg-teal-50 hover:bg-teal-100 transition-colors"
        >
          <FaArrowLeft className="text-xs" />
          Back to Resources
        </button>
      </div>
      <div className="max-w-3xl mx-auto my-4 relative">
        <input
          type="text"
          placeholder="Search... type atleast 3 letters"
          className="w-full border border-gray-300 rounded px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 text-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
            aria-label="Clear search"
            // Adjust size if needed
          >
            <MdCancel size={20} />
          </button>
        )}
      </div>
      {renderPagination()} {/* Render pagination at the top */}
      {isSwipeView && isMobile ? (
        <SwipeView
          sections={filteredSections}
          searchTerm={searchTerm}
          startIndex={startIndex}
          nightMode={nightMode}
        />
      ) : (
        <>
          <ul className="space-y-4 mt-4" id="sections-title">
            {currentSections.map((section, idx) => (
              <SectionCard
                key={startIndex + idx}
                index={startIndex + idx}
                section={section}
                searchTerm={searchTerm}
                isExpanded={expandedSections[startIndex + idx] || false}
                toggleSection={toggleSection}
                renderAnchorId={(ruleNumber) =>
                  `section-${ruleNumber.replace(/\s+/g, "-").toLowerCase()}`
                }
                handleShare={handleShare}
              />
            ))}
          </ul>
        </>
      )}
      {renderPagination()}
    </div>
  );
};

export default ResourceDetail;
