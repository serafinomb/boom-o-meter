import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Settings, ArrowLeft, RotateCcw, Wifi, WifiOff } from 'lucide-react';

// Custom Slider Component that works well on mobile
const CustomSlider = ({ 
  min, 
  max, 
  step = 0.1, 
  value, 
  onChange, 
  className = '',
  color = 'blue',
  disabled = false 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  
  const percentage = ((value - min) / (max - min)) * 100;
  
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };
  
  const trackColorMap = {
    blue: 'bg-blue-200',
    green: 'bg-green-200',
    purple: 'bg-purple-200',
    orange: 'bg-orange-200'
  };

  const updateValue = (clientX) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
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
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
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
        className={`absolute top-0 w-6 h-6 rounded-full ${colorMap[color]} border-2 border-white shadow-lg transition-all duration-150 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'} pointer-events-none`}
        style={{ left: `calc(${percentage}% - 12px)` }}
      ></div>
    </div>
  );
};

// Dual Range Slider Component
const DualRangeSlider = ({ 
  min, 
  max, 
  step = 0.1, 
  minValue, 
  maxValue, 
  onMinChange, 
  onMaxChange, 
  className = '',
  color = 'blue' 
}) => {
  const [dragging, setDragging] = useState(null);
  const sliderRef = useRef(null);
  
  const minPercentage = ((minValue - min) / (max - min)) * 100;
  const maxPercentage = ((maxValue - min) / (max - min)) * 100;
  
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };
  
  const trackColorMap = {
    blue: 'bg-blue-200',
    green: 'bg-green-200',
    purple: 'bg-purple-200',
    orange: 'bg-orange-200'
  };

  const updateValue = (clientX, thumb) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = min + (max - min) * percentage;
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    if (thumb === 'min' && clampedValue < maxValue) {
      onMinChange({ target: { value: clampedValue } });
    } else if (thumb === 'max' && clampedValue > minValue) {
      onMaxChange({ target: { value: clampedValue } });
    }
  };

  const handleStart = (e, thumb) => {
    e.stopPropagation();
    setDragging(thumb);
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    updateValue(clientX, thumb);
  };

  const handleTrackClick = (e) => {
    if (dragging) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const clickPercentage = (e.clientX - rect.left) / rect.width;
    const clickValue = min + (max - min) * clickPercentage;
    
    const distanceToMin = Math.abs(clickValue - minValue);
    const distanceToMax = Math.abs(clickValue - maxValue);
    
    if (distanceToMin < distanceToMax) {
      updateValue(e.clientX, 'min');
    } else {
      updateValue(e.clientX, 'max');
    }
  };

  const handleMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    updateValue(clientX, dragging);
  };

  const handleEnd = () => {
    setDragging(null);
  };

  React.useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [dragging]);

  const minZ = minPercentage > maxPercentage - 5 ? 'z-10' : 'z-20';
  const maxZ = maxPercentage < minPercentage + 5 ? 'z-10' : 'z-30';

  return (
    <div className={`relative w-full h-6 ${className}`} ref={sliderRef}>
      <div 
        className={`absolute top-2 w-full h-2 rounded-full ${trackColorMap[color]} cursor-pointer`}
        onClick={handleTrackClick}
      ></div>
      
      <div 
        className={`absolute top-2 h-2 rounded-full ${colorMap[color]} transition-all duration-150 pointer-events-none`}
        style={{ 
          left: `${minPercentage}%`,
          width: `${maxPercentage - minPercentage}%` 
        }}
      ></div>
      
      <div 
        className={`absolute top-0 w-6 h-6 rounded-full ${colorMap[color]} border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-all duration-150 ${minZ}`}
        style={{ left: `calc(${minPercentage}% - 12px)` }}
        onMouseDown={(e) => handleStart(e, 'min')}
        onTouchStart={(e) => handleStart(e, 'min')}
      ></div>
      
      <div 
        className={`absolute top-0 w-6 h-6 rounded-full ${colorMap[color]} border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-all duration-150 ${maxZ}`}
        style={{ left: `calc(${maxPercentage}% - 12px)` }}
        onMouseDown={(e) => handleStart(e, 'max')}
        onTouchStart={(e) => handleStart(e, 'max')}
      ></div>
    </div>
  );
};

// Storage utilities
const STORAGE_KEY = 'flash-calculator-settings';

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Could not save to localStorage:', error);
  }
};

const loadFromStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.warn('Could not load from localStorage:', error);
    return defaultValue;
  }
};

const FlashReachCalculator = () => {
  const [currentScreen, setCurrentScreen] = useState('calculator');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Settings state with localStorage persistence
  const defaultSettings = {
    guideNumber: 30,
    availableISOs: [100, 160, 200, 400, 800, 1600],
    availableApertures: [2, 2.8, 4, 5.6, 8, 11, 16],
    minDistance: 0.6,
    maxDistance: 5.0,
    priorityWeights: {
      efficiency: 0.7,
      depthOfField: 0.5,
      accuracy: 0.3
    },
    batterySavingMode: false,
    photographyMode: 'digital',
    fixedISO: 400
  };
  
  const [settings, setSettings] = useState(() => 
    loadFromStorage(STORAGE_KEY, defaultSettings)
  );
  
  // Calculator state
  const [targetDistance, setTargetDistance] = useState(2);
  const [iso, setIso] = useState(160);
  const [selectedSolution, setSelectedSolution] = useState(0);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    saveToStorage(STORAGE_KEY, settings);
  }, [settings]);
  
  // Online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const allPowerLevels = ['1/1', '1/2', '1/4', '1/8', '1/16', '1/32', '1/64', '1/128'];
  const allApertures = [1.4, 1.8, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
  const allISOs = [100, 160, 200, 400, 800, 1600, 3200];
  
  // Get current ISO based on photography mode
  const currentISO = settings.photographyMode === 'analog' ? settings.fixedISO : iso;
  
  const availableApertures = settings.availableApertures;
  
  // Convert power fraction to decimal
  const getPowerMultiplier = (powerStr) => {
    const fractions = {
      '1/1': 1, '1/2': 0.5, '1/4': 0.25, '1/8': 0.125,
      '1/16': 0.0625, '1/32': 0.03125, '1/64': 0.015625, '1/128': 0.0078125
    };
    return fractions[powerStr] || 1;
  };
  
  // Calculate required aperture for given distance, ISO, and power
  const calculateRequiredAperture = (distance, gn, isoValue, powerStr) => {
    const isoMultiplier = Math.sqrt(isoValue / 100);
    const powerMultiplier = Math.sqrt(getPowerMultiplier(powerStr));
    const effectiveGN = gn * isoMultiplier * powerMultiplier;
    return effectiveGN / distance;
  };
  
  // Convert slider value to label
  const getSliderLabel = (value) => {
    if (value <= 0.2) return 'Low';
    if (value <= 0.5) return 'Medium';
    if (value <= 0.8) return 'High';
    return 'Max';
  };
  
  // Find viable solutions for target distance
  const viableSolutions = useMemo(() => {
    const solutions = [];
    
    allPowerLevels.forEach(power => {
      const requiredAperture = calculateRequiredAperture(targetDistance, settings.guideNumber, currentISO, power);
      
      const closestAperture = availableApertures.reduce((prev, curr) => 
        Math.abs(curr - requiredAperture) < Math.abs(prev - requiredAperture) ? curr : prev
      );
      
      if (settings.availableApertures.includes(closestAperture)) {
        const actualDistance = (settings.guideNumber * Math.sqrt(currentISO / 100) * Math.sqrt(getPowerMultiplier(power))) / closestAperture;
        const distanceError = Math.abs(actualDistance - targetDistance);
        
        const powerValue = getPowerMultiplier(power);
        
        if (settings.batterySavingMode && powerValue > 0.5) {
          return;
        }
        
        solutions.push({
          power,
          aperture: closestAperture,
          requiredAperture,
          actualDistance,
          distanceError,
          powerMultiplier: powerValue,
          batteryEfficiency: powerValue,
          depthOfField: closestAperture
        });
      }
    });
    
    // Sort by user preferences (independent weights)
    return solutions
      .sort((a, b) => {
        const efficiencyScore = (b.batteryEfficiency - a.batteryEfficiency) * settings.priorityWeights.efficiency;
        const dofScore = (a.depthOfField - b.depthOfField) * settings.priorityWeights.depthOfField;
        const accuracyScore = (b.distanceError - a.distanceError) * settings.priorityWeights.accuracy;
        
        return efficiencyScore + dofScore + accuracyScore;
      })
      .slice(0, 6);
  }, [targetDistance, settings, currentISO, availableApertures]);
  
  const currentSolution = viableSolutions[selectedSolution] || viableSolutions[0];
  
  // Reset defaults
  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };
  
  // Settings Screen Component
  const SettingsScreen = () => (
    <div className="max-w-lg mx-auto bg-gray-100 p-6 rounded-2xl shadow-lg font-mono">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentScreen('calculator')}
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
          <label className="block text-sm font-semibold text-gray-700 mb-3">Photography Mode</label>
          <div className="bg-white rounded-lg p-3 shadow-inner">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSettings({...settings, photographyMode: 'digital'})}
                className={`py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                  settings.photographyMode === 'digital'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">Digital</div>
                <div className="text-xs mt-1">ISO controls on main screen</div>
              </button>
              <button
                onClick={() => setSettings({...settings, photographyMode: 'analog'})}
                className={`py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                  settings.photographyMode === 'analog'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          <label className="block text-sm font-semibold text-gray-700 mb-3">Flash Guide Number</label>
          <div className="bg-white rounded-lg p-3 shadow-inner">
            <input
              type="number"
              value={settings.guideNumber}
              onChange={(e) => setSettings({...settings, guideNumber: parseFloat(e.target.value) || 30})}
              min="1"
              max="200"
              step="1"
              className="w-full py-2 px-3 text-center text-xl font-bold border-none outline-none bg-transparent"
            />
          </div>
        </div>

        {/* ISO Settings - varies by photography mode */}
        {settings.photographyMode === 'analog' ? (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Film ISO</label>
            <div className="bg-white rounded-lg p-3 shadow-inner">
              <select
                value={settings.fixedISO}
                onChange={(e) => setSettings({...settings, fixedISO: parseInt(e.target.value)})}
                className="w-full py-2 px-3 text-center text-lg font-bold border-none outline-none bg-transparent"
              >
                {allISOs.map(isoVal => (
                  <option key={isoVal} value={isoVal}>{isoVal}</option>
                ))}
              </select>
              <div className="text-xs text-gray-500 text-center mt-1">
                Set once for your loaded film
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Available ISO Values</label>
            <div className="bg-white rounded-lg p-3 shadow-inner">
              <div className="grid grid-cols-4 gap-2">
                {allISOs.map(isoVal => (
                  <label key={isoVal} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.availableISOs.includes(isoVal)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSettings({
                            ...settings,
                            availableISOs: [...settings.availableISOs, isoVal].sort((a,b) => a-b)
                          });
                        } else {
                          setSettings({
                            ...settings,
                            availableISOs: settings.availableISOs.filter(iso => iso !== isoVal)
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
          <label className="block text-sm font-semibold text-gray-700 mb-3">Available Apertures</label>
          <div className="bg-white rounded-lg p-3 shadow-inner">
            <div className="grid grid-cols-5 gap-2">
              {allApertures.map(aperture => (
                <label key={aperture} className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.availableApertures.includes(aperture)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSettings({
                          ...settings,
                          availableApertures: [...settings.availableApertures, aperture].sort((a,b) => a-b)
                        });
                      } else {
                        setSettings({
                          ...settings,
                          availableApertures: settings.availableApertures.filter(a => a !== aperture)
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
          <label className="block text-sm font-semibold text-gray-700 mb-3">Distance Range</label>
          <div className="bg-white rounded-lg p-4 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">{settings.minDistance.toFixed(1)}m</span>
              <span className="text-sm text-gray-600">to</span>
              <span className="text-sm text-gray-600">{settings.maxDistance.toFixed(1)}m</span>
            </div>
            <DualRangeSlider
              min={0.3}
              max={20}
              step={0.1}
              minValue={settings.minDistance}
              maxValue={settings.maxDistance}
              onMinChange={(e) => setSettings({...settings, minDistance: parseFloat(e.target.value)})}
              onMaxChange={(e) => setSettings({...settings, maxDistance: parseFloat(e.target.value)})}
              color="blue"
            />
            <div className="text-xs text-gray-500 text-center mt-3">
              Drag handles to adjust minimum and maximum shooting distances
            </div>
          </div>
        </div>

        {/* Priority Weights */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Solution Priority</label>
          <div className="bg-white rounded-lg p-4 shadow-inner space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Power Efficiency</span>
                <span className="text-xs font-semibold text-gray-800">{getSliderLabel(settings.priorityWeights.efficiency)}</span>
              </div>
              <CustomSlider
                min={0}
                max={1}
                step={0.1}
                value={settings.priorityWeights.efficiency}
                onChange={(e) => setSettings({
                  ...settings,
                  priorityWeights: {...settings.priorityWeights, efficiency: parseFloat(e.target.value)}
                })}
                color="green"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Depth of Field</span>
                <span className="text-xs font-semibold text-gray-800">{getSliderLabel(settings.priorityWeights.depthOfField)}</span>
              </div>
              <CustomSlider
                min={0}
                max={1}
                step={0.1}
                value={settings.priorityWeights.depthOfField}
                onChange={(e) => setSettings({
                  ...settings,
                  priorityWeights: {...settings.priorityWeights, depthOfField: parseFloat(e.target.value)}
                })}
                color="purple"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Distance Accuracy</span>
                <span className="text-xs font-semibold text-gray-800">{getSliderLabel(settings.priorityWeights.accuracy)}