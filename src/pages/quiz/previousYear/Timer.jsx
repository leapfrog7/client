// import { useEffect, useState } from "react";
// import PropTypes from "prop-types";

// const Timer = ({ duration, onTimeUp }) => {
//   const fullDuration = 7200; // Full duration of 120 minutes (7200 seconds)
//   const [timeLeft, setTimeLeft] = useState(duration);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       onTimeUp();
//       return;
//     }

//     const timerId = setInterval(() => {
//       setTimeLeft(timeLeft - 1);
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [timeLeft, onTimeUp]);

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const calculateProgress = () => {
//     return (timeLeft / fullDuration) * 100;
//   };

//   return (
//     <div className="relative flex items-center justify-center w-16 h-16">
//       <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
//         <div
//           className="absolute top-0 left-0 w-full h-full rounded-full transform origin-center"
//           style={{
//             background: `conic-gradient(#f7f294 ${calculateProgress()}%, transparent 0%)`,
//           }}
//         ></div>
//         <span className="absolute text-base md:text-xl font-bold text-blue-700">
//           {formatTime(timeLeft)}
//         </span>
//       </div>
//     </div>
//   );
// };

// Timer.propTypes = {
//   duration: PropTypes.number.isRequired,
//   onTimeUp: PropTypes.func.isRequired,
// };

// export default Timer;

// import { useEffect, useRef, useState, useMemo } from "react";
// import PropTypes from "prop-types";

// const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

// const Timer = ({ duration, onTimeUp, totalDuration }) => {
//   // Stable total for the progress ring: set once on mount
//   const totalRef = useRef(Math.max(totalDuration ?? duration ?? 0, 1));

//   const [timeLeft, setTimeLeft] = useState(duration);

//   // Refs to avoid stale closures
//   const onTimeUpRef = useRef(onTimeUp);
//   const intervalRef = useRef(null);

//   // Keep latest onTimeUp without retriggering tick effect
//   useEffect(() => {
//     onTimeUpRef.current = onTimeUp;
//   }, [onTimeUp]);

//   // Resync when `duration` changes (e.g., restored attempt)
//   useEffect(() => {
//     setTimeLeft(duration);
//   }, [duration]);

//   // Single interval; functional state update to avoid stale closures
//   useEffect(() => {
//     if (intervalRef.current) clearInterval(intervalRef.current);

//     intervalRef.current = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(intervalRef.current);
//           intervalRef.current = null;
//           try {
//             onTimeUpRef.current?.();
//           } catch (err) {
//             console.error("Error in onTimeUp callback:", err);
//           }
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//     };
//   }, []); // run once

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const progressPct = useMemo(() => {
//     const total = totalRef.current; // stable denominator
//     return clamp((timeLeft / total) * 100, 0, 100);
//   }, [timeLeft]);

//   return (
//     <div className="relative flex items-center justify-center w-16 h-16">
//       <div className="relative w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
//         <div
//           className="absolute inset-0 rounded-full"
//           style={{
//             // transparent segment begins where filled segment ends
//             background: `conic-gradient(#f7f294 ${progressPct}%, transparent ${progressPct}% 100%)`,
//           }}
//         />
//         <span
//           className="absolute z-10 text-base md:text-xl font-bold text-blue-700"
//           aria-live="polite"
//         >
//           {formatTime(timeLeft)}
//         </span>
//       </div>
//     </div>
//   );
// };

// Timer.propTypes = {
//   /** Current seconds remaining (e.g., restored from server or countdown start). */
//   duration: PropTypes.number.isRequired,
//   /** Callback when the timer reaches zero. */
//   onTimeUp: PropTypes.func.isRequired,
//   /** Optional total exam duration in seconds (for accurate progress ring). If omitted, uses the initial `duration`. */
//   totalDuration: PropTypes.number,
// };

// export default Timer;

// Timer.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export default function Timer({
  duration, // remaining seconds now (e.g., 3600 on resume)
  onTimeUp, // callback at 0
  totalDuration = 7200, // default total = 120 mins
  size = 72,
  stroke = 6,
  trackColor = "#fff",
  progressColor = "#FF038E",
  textClassName = "text-sm md:text-base font-bold text-white",
  showTime = true,
}) {
  // Stable denominator: fixed to 7200 unless explicitly overridden
  const totalRef = useRef(Math.max(totalDuration, 1));

  const [timeLeft, setTimeLeft] = useState(duration);

  const onTimeUpRef = useRef(onTimeUp);
  const intervalRef = useRef(null);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // If you restore from server (e.g., 3600), ring & text resync here
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          try {
            onTimeUpRef.current?.();
          } catch (err) {
            console.error("Error in onTimeUp callback:", err);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // SVG ring math
  const radius = useMemo(() => (size - stroke) / 2, [size, stroke]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  const progress = useMemo(() => {
    const total = totalRef.current; // fixed 7200 by default
    return clamp(timeLeft / total, 0, 1);
  }, [timeLeft]);

  const dashOffset = useMemo(
    () => circumference * (1 - progress),
    [circumference, progress]
  );

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="timer"
      aria-live="polite"
    >
      <svg
        width={size}
        height={size}
        className="block"
        style={{ transform: "rotate(-90deg)" }} // start at 12 o’clock
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.3s linear" }}
        />
      </svg>

      {showTime && (
        <span className={`absolute ${textClassName}`}>
          {formatTime(timeLeft)}
        </span>
      )}
    </div>
  );
}

Timer.propTypes = {
  duration: PropTypes.number.isRequired, // remaining seconds (e.g., 3600)
  onTimeUp: PropTypes.func.isRequired,
  totalDuration: PropTypes.number, // defaults to 7200
  size: PropTypes.number,
  stroke: PropTypes.number,
  trackColor: PropTypes.string,
  progressColor: PropTypes.string,
  textClassName: PropTypes.string,
  showTime: PropTypes.bool,
};
