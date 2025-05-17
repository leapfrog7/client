// import React from "react";
import PropTypes from "prop-types";
import ContentBlock from "./ContentBlock"; // adjust path as needed

const SectionCard = ({
  section,
  index,
  searchTerm,
  isExpanded,
  toggleSection,
  renderAnchorId,
  handleShare,
}) => {
  // Prepare block content for clamping logic
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

  const anchorId = renderAnchorId(section.ruleNumber);

  return (
    <li
      key={index}
      id={anchorId}
      className="border border-gray-100 rounded-lg bg-gray-50 shadow-sm p-4 md:p-5"
    >
      <div className="mb-2 flex justify-between items-start gap-2 flex-wrap">
        <p
          className="font-semibold text-gray-700 text-sm md:text-base flex-1"
          dangerouslySetInnerHTML={{
            __html: `${section.ruleNumber} – ${section.ruleTitle}`.replace(
              new RegExp(`(${searchTerm})`, "gi"),
              `<mark class="bg-yellow-200">$1</mark>`
            ),
          }}
        />
        <button
          onClick={() => handleShare(section.ruleNumber, section.ruleTitle)}
          className="text-sm text-cyan-600 hover:text-cyan-800 transition-colors flex items-center gap-1"
          title="Copy shareable link"
        >
          <span className="text-base">🔗</span>
          <span className="hidden sm:inline text-xs font-medium">Share</span>
        </button>
      </div>

      {section.chapterTitle && (
        <p
          className="text-sm text-cyan-700 border border-cyan-100 bg-cyan-50 inline-block mt-1 px-3 py-1 rounded-md italic"
          dangerouslySetInnerHTML={{
            __html: section.chapterTitle.replace(
              new RegExp(`(${searchTerm})`, "gi"),
              `<mark class="bg-yellow-200">$1</mark>`
            ),
          }}
        />
      )}

      <div className="mt-4">
        {!shouldClamp || isExpanded ? (
          <>
            <div className="space-y-4">
              {section.contentBlocks.map((block, idx) => (
                <ContentBlock key={idx} block={block} searchTerm={searchTerm} />
              ))}
            </div>
            {shouldClamp && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => toggleSection(index)}
                  className="text-xs px-2 py-1 bg-cyan-50 text-cyan-600 hover:underline rounded"
                >
                  Show less
                </button>
              </div>
            )}
          </>
        ) : (
          <div>
            <p
              className="text-sm text-gray-700 line-clamp-6 mb-2"
              dangerouslySetInnerHTML={{
                __html: fullTextContent.replace(
                  new RegExp(`(${searchTerm})`, "gi"),
                  `<mark class="bg-yellow-200">$1</mark>`
                ),
              }}
            />
            <div className="flex justify-end">
              <button
                onClick={() => toggleSection(index)}
                className="text-xs px-2 py-1 bg-cyan-50 text-cyan-700 hover:underline rounded"
              >
                Show more
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

SectionCard.propTypes = {
  section: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  toggleSection: PropTypes.func.isRequired,
  renderAnchorId: PropTypes.func.isRequired,
  handleShare: PropTypes.func.isRequired,
};

export default SectionCard;
