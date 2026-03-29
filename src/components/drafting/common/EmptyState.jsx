import PropTypes from "prop-types";

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
};

export default function EmptyState({
  title,
  description = "Nothing to show here yet.",
  action = null,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
        {description}
      </p>

      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
