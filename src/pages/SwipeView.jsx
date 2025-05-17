// import React from "react";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { MdExitToApp } from "react-icons/md";
import { BsMoonStars, BsSun } from "react-icons/bs";

const highlightText = (text, term) => {
  if (!term || term.length < 3) return text;
  const regex = new RegExp(`(${term})`, "gi");
  return text.replace(regex, `<mark class="bg-yellow-200">$1</mark>`);
};

const SwipeView = ({ sections, searchTerm, startIndex = 0, nightMode }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && containerRef.current.children[startIndex]) {
      containerRef.current.children[startIndex].scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }
  }, [startIndex]);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
    >
      {sections.map((section, idx) => {
        return (
          <div
            key={idx}
            className={`snap-start h-screen px-2 py-4 flex flex-col justify-between transition-colors duration-300 ${
              nightMode
                ? "bg-gray-300 text-gray-700"
                : "bg-gradient-to-b from-gray-200 to-gray-700 text-gray-800"
            }`}
          >
            <div
              className={`max-w-2xl mx-auto w-full flex-1 flex flex-col overflow-auto rounded-lg shadow-sm border p-4 transition-colors duration-300 ${
                nightMode
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              {/* Header */}
              <div
                className={`my-3 px-2 py-2 rounded-lg transition-colors ${
                  nightMode
                    ? "bg-gray-700 text-white"
                    : "bg-slate-50 text-slate-700"
                }`}
              >
                <p
                  className="text-lg font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(
                      `${section.ruleNumber} – ${section.ruleTitle}`,
                      searchTerm
                    ),
                  }}
                />
                {section.chapterTitle && (
                  <p
                    className={`text-base italic font-semibold tracking-wide ${
                      nightMode ? "text-cyan-300" : "text-cyan-700"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: highlightText(section.chapterTitle, searchTerm),
                    }}
                  />
                )}
              </div>

              {/* Content Blocks */}
              <div
                className={`flex-1 space-y-4 leading-relaxed overflow-auto transition-colors ${
                  nightMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {section.contentBlocks.map((block, bIdx) => {
                  if (block.type === "text" || block.type === "note") {
                    if (block.type === "text") {
                      return (
                        <div
                          key={bIdx}
                          className={`prose max-w-none transition-colors ${
                            nightMode ? "prose-invert" : ""
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: highlightText(block.value, searchTerm),
                          }}
                        />
                      );
                    }

                    if (block.type === "note") {
                      return (
                        <div
                          key={bIdx}
                          className={`rounded-md px-4 py-3 text-sm font-medium border-l-4 ${
                            nightMode
                              ? "bg-yellow-900/20 border-yellow-600 text-yellow-200"
                              : "bg-yellow-50 border-yellow-400 text-yellow-800"
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: highlightText(block.value, searchTerm),
                          }}
                        />
                      );
                    }
                  } else if (block.type === "image") {
                    return (
                      <div key={bIdx}>
                        <img
                          src={block.value}
                          alt={block.caption || "Image"}
                          className="max-h-64 w-full object-contain rounded border"
                        />
                        {block.caption && (
                          <p className="text-xs italic text-center mt-1 text-gray-400">
                            {block.caption}
                          </p>
                        )}
                      </div>
                    );
                  } else if (block.type === "table") {
                    return (
                      <div key={bIdx} className="overflow-x-auto">
                        <table
                          className={`table-auto w-full text-sm border-collapse border rounded ${
                            nightMode
                              ? "text-gray-200 border-gray-600"
                              : "text-gray-700 border-gray-300"
                          }`}
                        >
                          <tbody>
                            {block.value.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`border px-2 py-1 text-center ${
                                      nightMode
                                        ? "border-gray-600"
                                        : "border-gray-300"
                                    }`}
                                  >
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
                      <p
                        key={bIdx}
                        className={`text-sm underline ${
                          nightMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        <a href={block.link} target="_blank" rel="noreferrer">
                          {block.value}
                        </a>
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Footer */}
            <div
              className={`text-center text-xs mt-3 transition-colors ${
                nightMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Section {idx + 1} of {sections.length}
            </div>
          </div>
        );
      })}
      <div className="fixed bottom-16 right-12 z-50 flex items-center gap-4">
        {/* Exit Swipe View */}
        <button
          onClick={() => window.dispatchEvent(new Event("exitSwipe"))}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-rose-600 text-white rounded-full shadow-md hover:bg-red-700 transition"
          title="Exit Swipe View"
        >
          <MdExitToApp className="text-base" />
          Exit
        </button>

        {/* Toggle Night Mode */}
        <button
          onClick={() => window.dispatchEvent(new Event("toggleNightMode"))}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-gray-600 text-white rounded-full shadow-md hover:bg-gray-700 transition"
          title="Toggle Night Mode"
        >
          {nightMode ? (
            <>
              <BsSun className="text-sm" />
              Light Mode
            </>
          ) : (
            <>
              <BsMoonStars className="text-sm" />
              Night Mode
            </>
          )}
        </button>
      </div>
    </div>
  );
};

SwipeView.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      chapterTitle: PropTypes.string,
      ruleNumber: PropTypes.string,
      ruleTitle: PropTypes.string,
      contentBlocks: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.oneOf(["text", "note", "table", "image", "reference"])
            .isRequired,
          value: PropTypes.any.isRequired,
          caption: PropTypes.string,
          link: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
  searchTerm: PropTypes.string.isRequired,
  startIndex: PropTypes.number, // ✅ this line fixes the warning
  nightMode: PropTypes.bool,
};

export default SwipeView;
