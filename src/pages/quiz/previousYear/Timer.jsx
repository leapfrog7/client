import PropTypes from "prop-types";

const pad = (n) => String(Math.max(0, Number(n) || 0)).padStart(2, "0");

export default function Timer({ duration }) {
  const safeTime = Math.max(Number(duration) || 0, 0);

  const hour = Math.floor(safeTime / 3600);
  const minutes = Math.floor((safeTime % 3600) / 60);
  const seconds = safeTime % 60;

  const items = [
    { label: "HR ", value: pad(hour) },
    { label: "MIN", value: pad(minutes) },
    { label: "SEC", value: pad(seconds) },
  ];

  return (
    <div
      className="flex items-center justify-center gap-1.5 sm:gap-2"
      role="timer"
      aria-live="polite"
    >
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-1.5 sm:gap-2">
          <div className="min-w-[64px] rounded-lg border border-sky-200 bg-white px-2 py-2 shadow-sm sm:min-w-[76px] sm:px-3 sm:py-2.5">
            <div className="text-center">
              <div className="text-base md:text-lg lg:text-2xl font-bold font-mono leading-none text-sky-700">
                {item.value}
              </div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:text-[11px]">
                {item.label}
              </div>
            </div>
          </div>

          {index < items.length - 1 && (
            <span className="pb-4 text-lg font-bold text-slate-400 sm:text-xl">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

Timer.propTypes = {
  duration: PropTypes.number.isRequired,
};
