import React from "react";

const SolutionBadge = ({ solution, index, isSelected, onClick }) => {
  const isPrimaryRecommendation = index === 0;
  const isLowPower = solution.powerMultiplier <= 0.25;
  const isVeryHighDOF = solution.aperture >= 11;
  const isHighDOF = solution.aperture >= 8;

  let borderColor = "border-gray-200";
  let bgColor = "bg-white";
  let indicatorColor = "";

  if (isSelected) {
    borderColor = "border-blue-500";
    bgColor = "bg-blue-50";
  }

  if (isPrimaryRecommendation) {
    indicatorColor = "bg-green-500";
  } else if (isLowPower && isVeryHighDOF) {
    indicatorColor = "bg-purple-600";
  } else if (isLowPower) {
    indicatorColor = "bg-blue-500";
  } else if (isVeryHighDOF) {
    indicatorColor = "bg-purple-500";
  } else if (isHighDOF) {
    indicatorColor = "bg-indigo-500";
  }

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${borderColor} ${bgColor} hover:border-gray-300 relative`}
    >
      {indicatorColor && (
        <div
          className={`absolute top-2 right-2 w-3 h-3 rounded-full ${indicatorColor}`}
        ></div>
      )}

      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-xl">f/{solution.aperture}</span>
          <span className="text-gray-600 text-lg">{solution.power}</span>
        </div>
        <div className="text-sm text-gray-500">
          {solution.actualDistance.toFixed(1)}m
          {solution.distanceError > 0.1 && (
            <span className="text-orange-500 block">
              ±{solution.distanceError.toFixed(1)}m
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolutionBadge;
