import PropTypes from "prop-types";
import DraftListItem from "./DraftListItem";
import EmptyDraftState from "./EmptyDraftState";

DraftList.propTypes = {
  drafts: PropTypes.array.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default function DraftList({ drafts, onDuplicate, onDelete }) {
  if (!drafts.length) {
    return <EmptyDraftState />;
  }

  return (
    <div className="space-y-3">
      {drafts.map((draft) => (
        <DraftListItem
          key={draft.id}
          draft={draft}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
