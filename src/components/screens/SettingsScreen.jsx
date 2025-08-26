import React from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import CustomSlider from "../ui/CustomSlider";
import DualRangeSlider from "../ui/DualRangeSlider";
import { ALL_ISOS, ALL_APERTURES } from "../../utils/constants";
import { getSliderLabel } from "../../utils/flashCalculations";

const SettingsScreen = ({ settings, setSettings, resetToDefaults, onBack }) => {
  return (
    <div className="max-w-lg mx-auto p-6 rounded-2xl font-mono">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-lg font-bold text-gray-700">Settings</h1>
        <button
          onClick={resetToDefaults}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Photography Mode */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Photography Mode
          </label>
          <div className="bg-white rounded-lg p-3 shadow-inner">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  setSettings({ ...settings, photographyMode: "digital" })
                }
                className={`py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                  settings.photographyMode === "digital"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="font-semibold">Digital</div>
                <div className="text-xs mt-1">ISO controls on main screen</div>
              </button>
              <button
                onClick={() =>
                  setSettings({ ...settings, photographyMode: "analog" })
                }
                className={`py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                  settings.photographyMode === "analog"
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="font-semibold">Analog</div>
                <div className="text-xs mt-1">Fixed ISO setting</div>
              </button>
            </div>
          </div>
        </div>

        {/* Guide Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Flash Guide Number
          </label>
          <div className="bg-white rounded-lg p-3 shadow-inner">
            <input
              type="number"
              value={settings.guideNumber}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  guideNumber: parseFloat(e.target.value) || 30,
                })
              }
              min="1"
              max="200"
              step="1"
              className="w-full py-2 px-3 text-center text-xl font-bold border-none outline-none bg-transparent"
            />
          </div>
        </div>

        {/* ISO Settings - varies by photography mode */}
        {settings.photographyMode === "analog" ? (
          /* Fixed ISO for Analog */
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Film ISO
            </label>
            <div className="bg-white rounded-lg p-3 shadow-inner">
              <select
                value={settings.fixedISO}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    fixedISO: parseInt(e.target.value),
                  })
                }
                className="w-full py-2 px-3 text-center text-lg font-bold border-none outline-none bg-transparent"
              >
                {ALL_ISOS.map((isoVal) => (
                  <option key={isoVal} value={isoVal}>
                    {isoVal}
                  </option>
                ))}
              </select>
              <div className="text-xs text-gray-500 text-center mt-1">
                Set once for your loaded film
              </div>
            </div>
          </div>
        ) : (
          /* Available ISOs for Digital */
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Available ISO Values
            </label>
            <div className="bg-white rounded-lg p-3 shadow-inner">
              <div className="grid grid-cols-4 gap-2">
                {ALL_ISOS.map((isoVal) => (
                  <label
                    key={isoVal}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={settings.availableISOs.includes(isoVal)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSettings({
                            ...settings,
                            availableISOs: [
                              ...settings.availableISOs,
                              isoVal,
                            ].sort((a, b) => a - b),
                          });
                        } else {
                          setSettings({
                            ...settings,
                            availableISOs: settings.availableISOs.filter(
                              (iso) => iso !== isoVal
                            ),
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{isoVal}</span>
                  </label>
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">
                Quick access ISO options for main screen
              </div>
            </div>
          </div>
        )}

        {/* Available Apertures */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Available Apertures
          </label>
          <div className="bg-white rounded-lg p-3 shadow-inner">
            <div className="grid grid-cols-5 gap-2">
              {ALL_APERTURES.map((aperture) => (
                <label
                  key={aperture}
                  className="flex items-center space-x-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={settings.availableApertures.includes(aperture)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSettings({
                          ...settings,
                          availableApertures: [
                            ...settings.availableApertures,
                            aperture,
                          ].sort((a, b) => a - b),
                        });
                      } else {
                        setSettings({
                          ...settings,
                          availableApertures:
                            settings.availableApertures.filter(
                              (a) => a !== aperture
                            ),
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-xs">f/{aperture}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Distance Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Distance Range
          </label>
          <div className="bg-white rounded-lg p-4 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                {settings.minDistance.toFixed(1)}m
              </span>
              <span className="text-sm text-gray-600">to</span>
              <span className="text-sm text-gray-600">
                {settings.maxDistance.toFixed(1)}m
              </span>
            </div>
            <DualRangeSlider
              min={0.3}
              max={20}
              step={0.1}
              minValue={settings.minDistance}
              maxValue={settings.maxDistance}
              onMinChange={(e) =>
                setSettings({
                  ...settings,
                  minDistance: parseFloat(e.target.value),
                })
              }
              onMaxChange={(e) =>
                setSettings({
                  ...settings,
                  maxDistance: parseFloat(e.target.value),
                })
              }
              color="blue"
            />
            <div className="text-xs text-gray-500 text-center mt-3">
              Drag handles to adjust minimum and maximum shooting distances
            </div>
          </div>
        </div>

        {/* Priority Weights */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Solution Priority
          </label>
          <div className="bg-white rounded-lg p-4 shadow-inner space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Power Efficiency</span>
                <span className="text-xs font-semibold text-gray-800">
                  {getSliderLabel(settings.priorityWeights.efficiency)}
                </span>
              </div>
              <CustomSlider
                min={0}
                max={1}
                step={0.1}
                value={settings.priorityWeights.efficiency}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    priorityWeights: {
                      ...settings.priorityWeights,
                      efficiency: parseFloat(e.target.value),
                    },
                  })
                }
                color="green"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Depth of Field</span>
                <span className="text-xs font-semibold text-gray-800">
                  {getSliderLabel(settings.priorityWeights.depthOfField)}
                </span>
              </div>
              <CustomSlider
                min={0}
                max={1}
                step={0.1}
                value={settings.priorityWeights.depthOfField}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    priorityWeights: {
                      ...settings.priorityWeights,
                      depthOfField: parseFloat(e.target.value),
                    },
                  })
                }
                color="purple"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Distance Accuracy</span>
                <span className="text-xs font-semibold text-gray-800">
                  {getSliderLabel(settings.priorityWeights.accuracy)}
                </span>
              </div>
              <CustomSlider
                min={0}
                max={1}
                step={0.1}
                value={settings.priorityWeights.accuracy}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    priorityWeights: {
                      ...settings.priorityWeights,
                      accuracy: parseFloat(e.target.value),
                    },
                  })
                }
                color="blue"
              />
            </div>
          </div>
        </div>

        {/* Battery Saving Mode */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Battery Saving
          </label>
          <div className="bg-white rounded-lg p-4 shadow-inner">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.batterySavingMode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    batterySavingMode: e.target.checked,
                  })
                }
                className="rounded"
              />
              <div>
                <div className="text-sm font-medium">
                  Enable Battery Saving Mode
                </div>
                <div className="text-xs text-gray-600">
                  Excludes high power settings (1/1, 1/2)
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
