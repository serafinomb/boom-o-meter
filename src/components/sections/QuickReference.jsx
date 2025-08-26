import React from "react";
import { getViablePowers } from "../../utils/flashCalculations";
import { POWER_LEVEL_COLORS } from "../../utils/constants";

const QuickReference = ({ settings, currentISO }) => {
  // Generate distance columns and aperture rows based on user settings
  const allDistances = [0.9, 1.3, 1.8, 2.5, 3.5, 5, 10, 20, 30];
  // Filter distances to match user's configured range
  const visibleDistances = allDistances.filter(
    (d) => d >= settings.minDistance && d <= settings.maxDistance
  );

  // Use user's configured apertures
  const userApertures = settings.availableApertures.sort((a, b) => a - b);

  // Don't show table if no distances or apertures are available
  if (visibleDistances.length === 0 || userApertures.length === 0) {
    return (
      <div className="mb-6 p-4 bg-white rounded-lg shadow-inner">
        <div className="text-sm font-bold text-gray-800 mb-3 text-center">
          Quick Power Reference
        </div>
        <div className="text-center py-4 text-gray-500 text-sm">
          Configure distance range and apertures in settings to see power
          reference
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-inner">
      <div className="text-sm font-bold text-gray-800 mb-3 text-center">
        Quick Power Reference
      </div>

      {/* Table Header - Distances */}
      <div
        className="grid gap-1 mb-2 text-xs font-semibold text-gray-700"
        style={{
          gridTemplateColumns: `60px repeat(${visibleDistances.length}, 1fr)`,
        }}
      >
        <div className="text-center py-1">Aperture</div>
        {visibleDistances.map((distance) => (
          <div key={distance} className="text-center py-1">
            {distance}m
          </div>
        ))}
      </div>

      {/* Table Rows - User's Apertures */}
      <div className="space-y-1">
        {userApertures.map((aperture) => (
          <div
            key={aperture}
            className="grid gap-1 items-center"
            style={{
              gridTemplateColumns: `60px repeat(${visibleDistances.length}, 1fr)`,
            }}
          >
            <div className="text-center py-2 font-medium text-gray-700">
              f/{aperture}
            </div>

            {visibleDistances.map((distance) => {
              const viablePowers = getViablePowers(
                distance,
                aperture,
                settings.guideNumber,
                currentISO
              );

              return (
                <div
                  key={distance}
                  className="flex items-center justify-center py-2 px-1"
                >
                  <div className="w-full flex justify-center">
                    {/* Multiple power level bars - no labels */}
                    <div className="flex flex-col space-y-0.5 w-full max-w-8">
                      {viablePowers.length > 0 ? (
                        viablePowers.map(({ power, color }) => (
                          <div
                            key={power}
                            className={`w-full h-2 rounded-full ${color}`}
                          ></div>
                        ))
                      ) : (
                        <div className="w-full h-2 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Color Legend */}
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="flex flex-wrap gap-2 justify-center text-xs">
          {POWER_LEVEL_COLORS.map(({ power, color }) => (
            <div key={power} className="flex items-center space-x-1">
              <div className={`w-3 h-2 rounded-full ${color}`}></div>
              <span className="text-gray-600">{power}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center mt-2">
        ISO {currentISO} • GN {settings.guideNumber} • Based on your configured
        settings
      </div>
    </div>
  );
};

export default QuickReference;
