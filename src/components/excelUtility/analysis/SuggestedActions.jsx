import PropTypes from "prop-types";

export default function SuggestedActions({ actions = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-slate-900">
        Suggested actions
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        These are cautious suggestions based on detected column types.
      </p>

      <div className="mt-4 space-y-2">
        {!actions.length ? (
          <div className="rounded-xl bg-white px-3 py-4 text-sm text-slate-500">
            Suggestions will appear after a sheet is loaded.
          </div>
        ) : (
          actions.map((action, index) => (
            <button
              key={`${action}-${index}`}
              type="button"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 hover:border-blue-200 hover:bg-blue-50"
            >
              {action}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

SuggestedActions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string),
};
