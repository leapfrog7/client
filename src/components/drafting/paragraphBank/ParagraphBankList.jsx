import PropTypes from "prop-types";
import ParagraphBankCard from "./ParagraphBankCard";

ParagraphBankList.propTypes = {
  items: PropTypes.array.isRequired,
  onInsert: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default function ParagraphBankList({
  items,
  onInsert,
  onEdit,
  onDelete,
}) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        No saved paragraphs yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ParagraphBankCard
          key={item.id}
          item={item}
          onInsert={onInsert}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
