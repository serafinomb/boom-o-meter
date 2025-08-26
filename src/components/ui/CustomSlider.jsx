import React, { useState, useRef } from "react";

const CustomSlider = ({
  min,
  max,
  step = 0.1,
  value,
  onChange,
  className = "",
  color = "blue",
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const colorMap = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };

  const trackColorMap = {
    blue: "bg-blue-200",
    green: "bg-green-200",
    purple: "bg-purple-200",
    orange: "bg-orange-200",
  };

  const updateValue = (clientX) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width)
    );
    const newValue = min + (max - min) * percentage;
    const steppedValue = Math.round(newValue / step) * step;

    onChange({ target: { value: Math.max(min, Math.min(max, steppedValue)) } });
  };

  const handleMouseDown = (e) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updateValue(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    updateValue(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging]);

  return (
    <div className={`relative w-full h-6 ${className}`} ref={sliderRef}>
      {/* Track */}
      <div
        className={`absolute top-2 w-full h-2 rounded-full ${trackColorMap[color]} cursor-pointer`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      ></div>

      {/* Fill */}
      <div
        className={`absolute top-2 h-2 rounded-full ${colorMap[color]} transition-all duration-150 pointer-events-none`}
        style={{ width: `${percentage}%` }}
      ></div>

      {/* Thumb */}
      <div
        className={`absolute top-0 w-6 h-6 rounded-full ${
          colorMap[color]
        } border-2 border-white shadow-lg transition-all duration-150 ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:scale-110"
        } pointer-events-none`}
        style={{ left: `calc(${percentage}% - 12px)` }}
      ></div>
    </div>
  );
};

export default CustomSlider;
