import React, { useState, useRef } from "react";

const DualRangeSlider = ({
  min,
  max,
  step = 0.1,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  className = "",
  color = "blue",
}) => {
  const [dragging, setDragging] = useState(null); // 'min' | 'max' | null
  const sliderRef = useRef(null);

  const minPercentage = ((minValue - min) / (max - min)) * 100;
  const maxPercentage = ((maxValue - min) / (max - min)) * 100;

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

  const updateValue = (clientX, thumb) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width)
    );
    const newValue = min + (max - min) * percentage;
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    if (thumb === "min" && clampedValue < maxValue) {
      onMinChange({ target: { value: clampedValue } });
    } else if (thumb === "max" && clampedValue > minValue) {
      onMaxChange({ target: { value: clampedValue } });
    }
  };

  const handleStart = (e, thumb) => {
    e.stopPropagation();
    setDragging(thumb);
    const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    updateValue(clientX, thumb);
  };

  const handleTrackClick = (e) => {
    if (dragging) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clickPercentage = (e.clientX - rect.left) / rect.width;
    const clickValue = min + (max - min) * clickPercentage;

    // Determine which thumb is closer to the click
    const distanceToMin = Math.abs(clickValue - minValue);
    const distanceToMax = Math.abs(clickValue - maxValue);

    if (distanceToMin < distanceToMax) {
      updateValue(e.clientX, "min");
    } else {
      updateValue(e.clientX, "max");
    }
  };

  const handleMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    updateValue(clientX, dragging);
  };

  const handleEnd = () => {
    setDragging(null);
  };

  React.useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);

      return () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
      };
    }
  }, [dragging]);

  // Determine z-index based on which thumb should be on top
  const minZ = minPercentage > maxPercentage - 5 ? "z-10" : "z-20";
  const maxZ = maxPercentage < minPercentage + 5 ? "z-10" : "z-30";

  return (
    <div className={`relative w-full h-6 ${className}`} ref={sliderRef}>
      {/* Track */}
      <div
        className={`absolute top-2 w-full h-2 rounded-full ${trackColorMap[color]} cursor-pointer`}
        onClick={handleTrackClick}
      ></div>

      {/* Fill between thumbs */}
      <div
        className={`absolute top-2 h-2 rounded-full ${colorMap[color]} transition-all duration-150 pointer-events-none`}
        style={{
          left: `${minPercentage}%`,
          width: `${maxPercentage - minPercentage}%`,
        }}
      ></div>

      {/* Min Thumb */}
      <div
        className={`absolute top-0 w-6 h-6 rounded-full ${colorMap[color]} border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-all duration-150 ${minZ}`}
        style={{ left: `calc(${minPercentage}% - 12px)` }}
        onMouseDown={(e) => handleStart(e, "min")}
        onTouchStart={(e) => handleStart(e, "min")}
      ></div>

      {/* Max Thumb */}
      <div
        className={`absolute top-0 w-6 h-6 rounded-full ${colorMap[color]} border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-all duration-150 ${maxZ}`}
        style={{ left: `calc(${maxPercentage}% - 12px)` }}
        onMouseDown={(e) => handleStart(e, "max")}
        onTouchStart={(e) => handleStart(e, "max")}
      ></div>
    </div>
  );
};

export default DualRangeSlider;
