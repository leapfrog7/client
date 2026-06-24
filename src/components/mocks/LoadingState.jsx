import PropTypes from "prop-types";

function LoadingState({
  message = "Loading...",
  description = "Please wait while server is responding...",
}) {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center shadow-sm sm:px-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" />
      </div>

      <p className="mt-4 text-sm font-black text-slate-900">{message}</p>

      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}

LoadingState.propTypes = {
  message: PropTypes.string,
  description: PropTypes.string,
};

export default LoadingState;
