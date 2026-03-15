import { useEffect, useRef } from "react";

export default function useExamTimer({
  isStarted,
  remainingTime,
  setRemainingTime,
  onTimeUp,
}) {
  const timeUpRef = useRef(false);

  useEffect(() => {
    if (!isStarted) return;

    const interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted, setRemainingTime]);

  useEffect(() => {
    if (!isStarted) return;

    if (remainingTime <= 0 && !timeUpRef.current) {
      timeUpRef.current = true;
      onTimeUp?.();
    }
  }, [remainingTime, isStarted, onTimeUp]);

  const resetTimeUpGuard = () => {
    timeUpRef.current = false;
  };

  return {
    resetTimeUpGuard,
  };
}
