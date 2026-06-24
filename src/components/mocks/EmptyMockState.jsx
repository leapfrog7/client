import PropTypes from "prop-types";

function EmptyMockState({
  title = "No data found",
  message = "There is nothing to show here yet.",
  action = null,
}) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500">
        —
      </div>

      <h3 className="text-base font-semibold text-gray-800">{title}</h3>

      <p className="mx-auto mt-2 max-w-xl text-sm text-gray-500">{message}</p>

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

EmptyMockState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.node,
};

export default EmptyMockState;
