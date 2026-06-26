import PropTypes from "prop-types";

function LoadingState({
  message = "Loading...",
  description = "Please wait while the server is responding...",
}) {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="relative px-5 py-10 text-center sm:px-8">
        {/* Soft background glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-teal-50/80 to-transparent" />

        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          {/* Pulse ring */}
          <div className="absolute h-20 w-20 animate-ping rounded-full bg-teal-100 opacity-40" />

          {/* Static outer circle */}
          <div className="absolute h-16 w-16 rounded-2xl border border-teal-100 bg-teal-50 shadow-sm" />

          {/* Spinner */}
          <div className="relative h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" />

          {/* Center dot */}
          <div className="absolute h-3 w-3 rounded-full bg-teal-700" />
        </div>

        <div className="relative mt-5">
          <p className="text-sm font-black tracking-tight text-slate-950 sm:text-base">
            {message}
          </p>

          {description ? (
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>

        {/* Progress dots */}
        <div className="relative mt-6 flex items-center justify-center gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-teal-700 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-teal-600 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 w-full overflow-hidden bg-slate-100">
        <div className="h-full w-1/2 animate-pulse rounded-r-full bg-teal-600" />
      </div>
    </div>
  );
}

LoadingState.propTypes = {
  message: PropTypes.string,
  description: PropTypes.string,
};

export default LoadingState;
