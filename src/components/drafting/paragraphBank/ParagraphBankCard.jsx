import PropTypes from "prop-types";

ParagraphBankCard.propTypes = {
  item: PropTypes.object.isRequired,
  onInsert: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

function prettifyType(type) {
  return type === "template" ? "Smart" : "Static";
}

export default function ParagraphBankCard({
  item,
  onInsert,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-2.5 py-1">
              {item.category}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1">
              {prettifyType(item.type)}
            </span>
            {item.isFavorite ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">
                Favorite
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {onInsert ? (
            <button
              type="button"
              onClick={() => onInsert(item)}
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Insert
            </button>
          ) : null}

          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </button>
          ) : null}

          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
        {item.content}
      </p>

      {Array.isArray(item.tags) && item.tags.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] text-slate-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
