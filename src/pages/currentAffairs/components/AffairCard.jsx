import PropTypes from "prop-types";
import { FaRegBookmark, FaBookmark, FaArrowRight } from "react-icons/fa";
import { formatDate } from "../utils/formatDate";

// const typeLabel = (type) => {
//   if (!type) return "Misc";
//   if (type === "Govt Scheme") return "Govt Scheme";
//   return type;
// };

const badgeClass = (type) => {
  switch (type) {
    case "PIB":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "Govt Scheme":
    case "GOVT_SCHEME":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const normalizeType = (t) => {
  if (t === "GOVT_SCHEME") return "Govt Scheme";
  if (t === "MISC") return "Misc";
  return t || "Misc";
};

const AffairCard = ({ item, onOpen, onBookmark, isBookmarked }) => {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="
        group w-full text-left
        rounded-xl border border-gray-200
        bg-gradient-to-b from-white to-gray-50/60
        p-3
        shadow-sm
        hover:shadow-md hover:-translate-y-[1px]
        active:translate-y-0
        transition
        focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2
      "
    >
      {/* Meta row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] md:text-xs text-gray-500">
          {item?.date ? formatDate(item.date) : ""}
        </span>
      </div>

      {/* Title */}
      <h5
        className="
          mt-2
          text-sm md:text-lg
          font-bold
          text-gray-700
          leading-5 md:leading-7
          tracking-wide
          line-clamp-2
        "
      >
        {item.title}{" "}
        <span
          className={`
            text-[11px] md:text-xs font-semibold px-2 py-0.5 rounded-lg border
            ${badgeClass(normalizeType(item.type))}
          `}
        >
          {normalizeType(item.type)}
        </span>
      </h5>

      {/* CTA row */}
      <div className="mt-3 flex items-center justify-end gap-2">
        {/* Bookmark toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBookmark?.(item);
          }}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          aria-pressed={isBookmarked}
          title={isBookmarked ? "Bookmarked" : "Bookmark"}
          className={`
            inline-flex items-center justify-center
            h-9 w-9 md:h-10 md:w-10
            rounded-xl border
            transition
            focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2
            ${
              isBookmarked
                ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            }
          `}
        >
          {isBookmarked ? (
            <FaBookmark className="text-sm md:text-base" />
          ) : (
            <FaRegBookmark className="text-sm md:text-base" />
          )}
        </button>

        {/* Open */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(item);
          }}
          aria-label="Open"
          title="Read more"
          className="
            inline-flex items-center justify-center
            h-9 w-9 md:h-10 md:w-10
            rounded-xl border border-blue-200 bg-blue-50
            text-cyan-800
            hover:bg-cyan-100 hover:border-cyan-300
            focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2
            transition
          "
        >
          <FaArrowRight className="text-sm md:text-base" />
        </button>
      </div>
    </button>
  );
};

AffairCard.propTypes = {
  item: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
  onBookmark: PropTypes.func,
  isBookmarked: PropTypes.bool,
};

export default AffairCard;
