import PropTypes from "prop-types";
import AffairCard from "./AffairCard";

const AffairsList = ({ items, onOpen, bookmarkIds, onToggleBookmark }) => {
  return (
    <div className="mx-2 mt-3 grid grid-cols-1 gap-3">
      {items.map((it) => (
        <AffairCard
          key={it._id}
          item={it}
          onOpen={onOpen}
          isBookmarked={bookmarkIds?.has(it._id)}
          onBookmark={() => onToggleBookmark(it)}
        />
      ))}
    </div>
  );
};

AffairsList.propTypes = {
  items: PropTypes.array.isRequired,
  onOpen: PropTypes.func.isRequired,
  bookmarkIds: PropTypes.instanceOf(Set).isRequired,
  onToggleBookmark: PropTypes.func.isRequired,
};

export default AffairsList;
