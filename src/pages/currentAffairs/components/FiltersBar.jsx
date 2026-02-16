import PropTypes from "prop-types";

const TYPES = [
  { label: "All", value: "" },
  { label: "PIB", value: "PIB" },
  { label: "Govt Scheme", value: "GOVT_SCHEME" },
  { label: "Misc", value: "MISC" },
  { label: "Your Bookmarks", value: "__BOOKMARKS__" },
];

const FiltersBar = ({ selectedType, onTypeChange, bookmarkCount = 0 }) => {
  return (
    <div className="mx-2 my-3 rounded-2xl border bg-white p-3 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => {
          const active = selectedType === t.value;
          const isBookmarks = t.value === "__BOOKMARKS__";

          return (
            <button
              key={t.value || "ALL"}
              onClick={() => onTypeChange(t.value)}
              type="button"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition
                ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
            >
              <span className="inline-flex items-center gap-2">
                {t.label}
                {isBookmarks ? (
                  <span
                    className={`inline-flex items-center justify-center min-w-[22px] h-[18px] px-1.5 rounded-full text-[11px] font-bold
                      ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"}`}
                  >
                    {bookmarkCount}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

FiltersBar.propTypes = {
  selectedType: PropTypes.string,
  onTypeChange: PropTypes.func.isRequired,
  bookmarkCount: PropTypes.number,
};

export default FiltersBar;
