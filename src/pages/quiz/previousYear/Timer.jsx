import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Timer = ({ duration, onTimeUp }) => {
  const fullDuration = 7200; // Full duration of 120 minutes (7200 seconds)
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const calculateProgress = () => {
    return (timeLeft / fullDuration) * 100;
  };

  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
        <div
          className="absolute top-0 left-0 w-full h-full rounded-full transform origin-center"
          style={{
            background: `conic-gradient(#f7f294 ${calculateProgress()}%, transparent 0%)`,
          }}
        ></div>
        <span className="absolute text-base md:text-xl font-bold text-blue-700">
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
};

Timer.propTypes = {
  duration: PropTypes.number.isRequired,
  onTimeUp: PropTypes.func.isRequired,
};

export default Timer;
