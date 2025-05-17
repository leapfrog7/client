// import React from "react";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const highlightText = (text, term) => {
  if (!term || term.length < 3) return text;
  const regex = new RegExp(`(${term})`, "gi");
  return text.replace(regex, `<mark class="bg-yellow-200">$1</mark>`);
};

const SwipeView = ({ sections, searchTerm, startIndex = 0 }) => {
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
            className="snap-start h-screen flex flex-col justify-between px-4 py-6 bg-white"
          >
            <div className="space-y-3 overflow-auto">
              <p
                className="text-base font-semibold text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: highlightText(
                    `${section.ruleNumber} – ${section.ruleTitle}`,
                    searchTerm
                  ),
                }}
              />
              {section.chapterTitle && (
                <p
                  className="text-sm text-cyan-700 italic"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(section.chapterTitle, searchTerm),
                  }}
                />
              )}
              <div className="text-sm text-gray-700 space-y-2">
                {section.contentBlocks.map((block, bIdx) => {
                  if (block.type === "text" || block.type === "note") {
                    return (
                      <div
                        key={bIdx}
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(block.value, searchTerm),
                        }}
                      />
                    );
                  } else if (block.type === "image") {
                    return (
                      <div key={bIdx}>
                        <img
                          src={block.value}
                          alt={block.caption || "Image"}
                          className="max-h-64 object-contain rounded mx-auto"
                        />
                        {block.caption && (
                          <p className="text-xs text-gray-500 italic text-center mt-1">
                            {block.caption}
                          </p>
                        )}
                      </div>
                    );
                  } else if (block.type === "table") {
                    return (
                      <div
                        key={bIdx}
                        className="overflow-x-auto border rounded"
                      >
                        <table className="table-auto text-sm w-full border-collapse">
                          <tbody>
                            {block.value.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className="border px-2 py-1 text-center"
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
                      <p key={bIdx} className="text-sm text-blue-600 underline">
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
            <div className="pt-4 text-center text-xs text-gray-400">
              Section {idx + 1} of {sections.length}
            </div>
          </div>
        );
      })}
      <button
        onClick={() => window.dispatchEvent(new Event("exitSwipe"))}
        className="fixed bottom-4 right-4 z-50 bg-cyan-600 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-cyan-700 transition"
      >
        Exit View
      </button>
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
};

export default SwipeView;
