// import React from "react";
import PropTypes from "prop-types";

const ContentBlock = ({ block, searchTerm }) => {
  const highlightText = (text, term) => {
    if (!term || term.length < 3) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.replace(regex, `<mark class="bg-yellow-200">$1</mark>`);
  };

  switch (block.type) {
    case "text":
      return (
        <div
          className={`prose prose-sm md:prose-base prose-slate max-w-none mx-auto transition-colors duration-300 `}
          dangerouslySetInnerHTML={{
            __html: highlightText(block.value, searchTerm),
          }}
        />
      );

    case "note":
      return (
        <div className="relative bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3 rounded shadow-sm">
          <span className="absolute -top-2 left-2 text-xs bg-yellow-400 text-white px-2 py-0.5 rounded">
            Note
          </span>
          <div
            className="text-sm md:text-sm italic text-gray-700 prose prose-sm md:prose-base prose-slate"
            dangerouslySetInnerHTML={{
              __html: highlightText(block.value, searchTerm),
            }}
          />
        </div>
      );

    case "table":
      return (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="table-auto w-full text-sm text-left border-collapse">
            <tbody>
              {block.value.map((row, rIdx) => (
                <tr key={rIdx} className="even:bg-gray-50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="border px-3 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "image":
      return (
        <figure className="text-center">
          <img
            src={block.value}
            alt={block.caption || "Image"}
            className="rounded border max-h-64 object-contain mx-auto"
          />
          {block.caption && (
            <figcaption className="text-xs text-gray-600 italic mt-1">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "reference":
      return (
        <p className="text-sm text-blue-600 underline flex items-center gap-1">
          <a
            href={block.link}
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-800"
          >
            🔗 {block.value}
          </a>
        </p>
      );

    default:
      return null;
  }
};

ContentBlock.propTypes = {
  block: PropTypes.shape({
    type: PropTypes.oneOf(["text", "table", "image", "note", "reference"])
      .isRequired,
    value: PropTypes.any.isRequired,
    caption: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default ContentBlock;
