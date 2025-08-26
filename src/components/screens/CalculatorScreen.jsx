import React from "react";
import { Settings } from "lucide-react";
import CustomSlider from "../ui/CustomSlider";
import SolutionBadge from "../ui/SolutionBadge";
import QuickReference from "../sections/QuickReference";

const CalculatorScreen = ({
  settings,
  targetDistance,
  setTargetDistance,
  iso,
  setIso,
  selectedSolution,
  setSelectedSolution,
  viableSolutions,
  currentSolution,
  currentISO,
  onSettingsClick,
}) => {
  return (
    <div className="max-w-lg mx-auto bg-gray-100 p-6 rounded-2xl shadow-lg font-mono">
      {/* Distance Slider */}
      <div className="mb-6">
        <label className="block text-xs text-gray-600 mb-2 uppercase tracking-wide">
          Target Distance
        </label>
        <div className="bg-white rounded-lg p-4 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">
              {settings.minDistance.toFixed(1)}m
            </span>
            <div className="text-2xl font-bold text-blue-600">
              {targetDistance.toFixed(1)}m
            </div>
            <span className="text-sm text-gray-500">
              {settings.maxDistance.toFixed(1)}m
            </span>
          </div>
          <CustomSlider
            min={settings.minDistance}
            max={settings.maxDistance}
            step={0.1}
            value={targetDistance}
            onChange={(e) => {
              setTargetDistance(parseFloat(e.target.value));
              setSelectedSolution(0);
            }}
            color="blue"
          />
        </div>
      </div>

      {/* ISO Selection - only show in digital mode */}
      {settings.photographyMode === "digital" && (
        <div className="mb-6">
          <label className="block text-xs text-gray-600 mb-2 uppercase tracking-wide">
            ISO
          </label>
          <div className="flex bg-white rounded-lg p-1 shadow-inner flex-wrap gap-1">
            {settings.availableISOs.map((isoVal) => (
              <button
                key={isoVal}
                onClick={() => {
                  setIso(isoVal);
                  setSelectedSolution(0);
                }}
                className={`flex-1 min-w-0 py-2 px-1 text-sm font-medium rounded-md transition-all duration-200 ${
                  iso === isoVal
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {isoVal}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Solutions */}
      <div className="mb-6">
        <label className="block text-xs text-gray-600 mb-3 uppercase tracking-wide">
          Suggested Settings{" "}
          {viableSolutions.length > 0 && `(${viableSolutions.length} options)`}
        </label>
        {viableSolutions.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {viableSolutions.map((solution, index) => (
                <SolutionBadge
                  key={index}
                  solution={solution}
                  index={index}
                  isSelected={index === selectedSolution}
                  onClick={() => setSelectedSolution(index)}
                />
              ))}
            </div>
            {/* Legend */}
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Optimal recommendation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span>Perfect (Low power + Deep DOF)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Power efficient</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Maximum depth of field</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span>Deep depth of field</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-sm">No viable solutions found</div>
            <div className="text-xs mt-1">
              Try adjusting distance, settings, or ISO
            </div>
          </div>
        )}
      </div>

      {/* Current Selection Details */}
      {currentSolution && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-inner">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800 mb-2">
              Selected Settings
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-500 uppercase">Aperture</div>
                <div className="text-xl font-bold text-orange-600">
                  f/{currentSolution.aperture}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">Power</div>
                <div className="text-xl font-bold text-green-600">
                  {currentSolution.power}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">Distance</div>
                <div className="text-xl font-bold text-blue-600">
                  {currentSolution.actualDistance.toFixed(1)}m
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              ISO {currentISO} • GN {settings.guideNumber}
            </div>
          </div>
        </div>
      )}

      {/* Quick Reference Guide */}
      <QuickReference settings={settings} currentISO={currentISO} />

      {/* Settings button at bottom */}
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <div className="text-lg font-bold text-gray-700">FR-04</div>
          <div className="text-xs text-gray-500">
            Distance-First Flash Calculator
          </div>
        </div>
        <button
          onClick={onSettingsClick}
          className="ml-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};

export default CalculatorScreen;
