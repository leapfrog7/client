import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Timer = ({ duration, onTimeUp }) => {
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

  return <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>;
};

Timer.propTypes = {
  duration: PropTypes.number.isRequired,
  onTimeUp: PropTypes.func.isRequired,
};

export default Timer;
