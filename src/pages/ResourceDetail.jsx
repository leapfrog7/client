import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const highlightText = (text, term) => {
    if (!term || term.length < 3) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.replace(regex, `<mark class="bg-yellow-200">$1</mark>`);
  };

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

  const renderBlocks = (blocks) => {
    return blocks.map((block, idx) => {
      if (block.type === "text" || block.type === "note") {
        return (
          <div
            key={idx}
            className="prose max-w-none text-sm text-gray-600"
            dangerouslySetInnerHTML={{
              __html: highlightText(block.value, searchTerm),
            }}
          />
        );
      } else if (block.type === "image") {
        return (
          <div key={idx} className="my-4">
            <img
              src={block.value}
              alt={block.caption || "Image"}
              className="rounded max-h-64 w-full object-contain"
            />
            {block.caption && (
              <p className="text-xs text-gray-700 italic mt-1">
                {block.caption}
              </p>
            )}
          </div>
        );
      } else if (block.type === "table" && Array.isArray(block.value)) {
        return (
          <div key={idx} className="overflow-x-auto my-4">
            <table className="table-auto border text-sm w-full">
              <tbody>
                {block.value.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="border px-2 py-1">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else if (block.type === "reference") {
        return (
          <p key={idx} className="text-sm text-blue-600 underline">
            <a href={block.link} target="_blank" rel="noreferrer">
              {block.value}
            </a>
          </p>
        );
      }
      return null;
    });
  };

  if (loading || !rule) return <p className="p-4 text-center">Loading...</p>;

  const filteredSections =
    searchTerm.length >= 3
      ? rule.sections.filter((section) => {
          const lower = searchTerm.toLowerCase();

          const inMetadata =
            section.ruleNumber?.toLowerCase().includes(lower) ||
            section.ruleTitle?.toLowerCase().includes(lower) ||
            section.chapterTitle?.toLowerCase().includes(lower);

          const inContentBlock = section.contentBlocks.some(
            (b) =>
              (b.type === "text" || b.type === "note") &&
              b.value?.toLowerCase().includes(lower)
          );

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

  return (
    <div className="p-4 md:p-8 md:w-11/12 mx-auto">
      <h1 className="text-xl md:text-2xl font-bold text-center mb-4 text-teal-700 antialiased ">
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
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/pages/public/resources")}
          className="text-sm text-cyan-700 hover:underline inline-flex items-center text-right"
        >
          ← Back to Resources
        </button>
      </div>
      <ul className="space-y-2 mt-4">
        {currentSections.map((section, idx) => {
          const isExpanded = expandedSections[startIndex + idx]; // Adjust index for pagination

          // Combine all block content for word count
          const fullTextContent = section.contentBlocks
            .filter((b) => b.type === "text" || b.type === "note")
            .map((b) => {
              const temp = document.createElement("div");
              temp.innerHTML = b.value;
              return temp.textContent || "";
            })
            .join(" ");

          const wordCount = fullTextContent.trim().split(/\s+/).length;

          const shouldClamp = wordCount > 400;

          return (
            <li
              key={startIndex + idx}
              className="border border-gray-50 rounded px-2 py-2 bg-white shadow-sm"
            >
              <div className="my-2">
                <p
                  className="font-semibold text-gray-700 text-sm md:text-base "
                  dangerouslySetInnerHTML={{
                    __html: highlightText(
                      `${section.ruleNumber} – ${section.ruleTitle}`,
                      searchTerm
                    ),
                  }}
                >
                  {/* {section.ruleNumber} – {section.ruleTitle} */}
                </p>
                <div className="mb-2 flex items-start">
                  <p
                    className="text-sm text-cyan-700 border border-cyan-100 bg-cyan-50 px-3 py-1 rounded-md italic my-1"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(section.chapterTitle, searchTerm),
                    }}
                  >
                    {/* {section.chapterTitle} */}
                  </p>
                </div>
              </div>

              {!shouldClamp || isExpanded ? (
                <div className="p-2 bg-teal-50 rounded-lg border border-teal-400">
                  <div className="mb-0 ">
                    {renderBlocks(section.contentBlocks)}
                  </div>
                  {shouldClamp && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => toggleSection(startIndex + idx)}
                        className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 hover:underline rounded"
                      >
                        Show less
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-teal-50 p-2 rounded-lg border border-teal-400">
                  <p
                    className="text-sm text-gray-700 line-clamp-6 mb-2"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(fullTextContent, searchTerm),
                    }}
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleSection(idx)}
                      className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 hover:underline rounded"
                    >
                      Show more
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {renderPagination()}
    </div>
  );
};

export default ResourceDetail;
