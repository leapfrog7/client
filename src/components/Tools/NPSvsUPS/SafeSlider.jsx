import { useRef, useState } from "react";
import PropTypes from "prop-types";

const SafeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className = "",
  ...rest
}) => {
  const touchStartRef = useRef({ x: 0, y: 0 });
  const [allowMove, setAllowMove] = useState(true);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setAllowMove(true);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartRef.current.y);

    if (dy > dx) setAllowMove(false);
  };

  const handleTouchEnd = () => {
    setAllowMove(true); // reset
  };

  const handleChange = (e) => {
    if (allowMove) {
      onChange(Number(e.target.value));
    }
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={className}
      {...rest}
    />
  );
};

SafeSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default SafeSlider;
