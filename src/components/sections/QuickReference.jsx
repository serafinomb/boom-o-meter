import React from "react";
import { Aperture, Zap } from "lucide-react";
import { getViablePowers } from "../../utils/flashCalculations";
import { POWER_LEVEL_COLORS } from "../../utils/constants";

const QuickReference = ({ settings, currentISO }) => {
  // Generate distance range based on user settings
  const allDistances = [0.9, 1.3, 1.8, 2.5, 3.5, 5, 10, 20, 30];
  const visibleDistances = allDistances.filter(
    (d) => d >= settings.minDistance && d <= settings.maxDistance
  );

  // Use user's configured apertures
  const userApertures = settings.availableApertures.sort((a, b) => a - b);

  // Don't show if no distances or apertures are available
  if (visibleDistances.length === 0 || userApertures.length === 0) {
    return (
      <div className="mb-6">
        <label className="block text-xs text-gray-600 mb-3 uppercase tracking-wide">
          Power Reference Gradient
        </label>
        <div className="p-4 bg-white rounded-lg shadow-inner">
          <div className="text-center py-4 text-gray-500 text-sm">
            Configure distance range and apertures in settings to see power
            reference
          </div>
        </div>
      </div>
    );
  }

  // Create gradient segments for each aperture
  const createGradientSegments = (aperture) => {
    const segments = [];

    visibleDistances.forEach((distance) => {
      const viablePowers = getViablePowers(
        distance,
        aperture,
        settings.guideNumber,
        currentISO
      );

      // Get the primary (first) power level color and power value
      const primaryColor =
        viablePowers.length > 0 ? viablePowers[0].color : "bg-gray-300";
      const primaryPower =
        viablePowers.length > 0 ? viablePowers[0].power : null;

      segments.push({
        color: primaryColor,
        power: primaryPower,
        distance,
        powers: viablePowers,
      });
    });

    return segments;
  };

  // Get Tailwind color class to CSS color - optimized for smooth gradients
  const getColorFromClass = (colorClass) => {
    const colorMap = {
      "bg-green-400": "#4ade80",
      "bg-lime-400": "#a3e635",
      "bg-yellow-400": "#facc15",
      "bg-amber-400": "#fbbf24",
      "bg-orange-400": "#fb923c",
      "bg-orange-500": "#f97316",
      "bg-red-400": "#f87171",
      "bg-red-500": "#ef4444",
      "bg-gray-300": "#d1d5db",
    };
    return colorMap[colorClass] || "#d1d5db";
  };

  // Create CSS gradient string with smoother transitions
  const createGradient = (segments) => {
    if (segments.length === 0) return "linear-gradient(to right, #d1d5db)";

    if (segments.length === 1) {
      const color = getColorFromClass(segments[0].color);
      return `linear-gradient(to right, ${color})`;
    }

    const gradientStops = [];
    segments.forEach((segment, index) => {
      const color = getColorFromClass(segment.color);
      const position = (index / (segments.length - 1)) * 100;
      gradientStops.push(`${color} ${position}%`);
    });

    return `linear-gradient(to right, ${gradientStops.join(", ")})`;
  };

  return (
    <div className="mb-6">
      <label className="block text-xs text-gray-600 mb-3 uppercase tracking-wide">
        Power Reference Gradient
      </label>
      <div className="p-4 bg-white rounded-lg shadow-inner space-y-4">
        {/* Distance Markers Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12"></div>
          <div className="flex-1 flex justify-between text-xs text-gray-500">
            {visibleDistances.map((distance) => (
              <span key={distance} className="text-center">
                {distance}m
              </span>
            ))}
          </div>
        </div>

        {/* Aperture Gradient Bars */}
        {userApertures.map((aperture) => {
          const segments = createGradientSegments(aperture);
          const gradient = createGradient(segments);

          return (
            <div key={aperture} className="flex items-center space-x-3">
              {/* Aperture Label on Left */}
              <div className="flex items-center space-x-1 w-12 justify-end">
                <Aperture size={14} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {aperture}
                </span>
              </div>

              {/* Gradient Bar with Numbers */}
              <div className="flex-1 relative">
                <div
                  className="w-full h-4 rounded-full shadow-inner"
                  style={{
                    background: gradient,
                  }}
                ></div>
                {/* Power Level Overlays */}
                <div className="absolute inset-0 flex items-center justify-between px-1">
                  {segments.map((segment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center"
                      style={{
                        width: `${100 / segments.length}%`,
                      }}
                    >
                      {segment.power && (
                        <span className="text-white text-xs font-bold drop-shadow-sm">
                          {segment.power}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        <div className="text-xs text-gray-500 text-center mt-2">
          ISO {currentISO} • GN {settings.guideNumber}
        </div>
      </div>
    </div>
  );
};

export default QuickReference;
