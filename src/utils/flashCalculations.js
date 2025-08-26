import { ALL_POWER_LEVELS } from './constants';

// Get power multiplier from power string
export const getPowerMultiplier = (powerStr) => {
  const fractions = {
    "1/1": 1,
    "1/2": 0.5,
    "1/4": 0.25,
    "1/8": 0.125,
    "1/16": 0.0625,
    "1/32": 0.03125,
    "1/64": 0.015625,
    "1/128": 0.0078125,
  };
  return fractions[powerStr] || 1;
};

// Calculate required aperture for given distance, ISO, and power
export const calculateRequiredAperture = (distance, guideNumber, isoValue, powerStr) => {
  const isoMultiplier = Math.sqrt(isoValue / 100);
  const powerMultiplier = Math.sqrt(getPowerMultiplier(powerStr));
  const effectiveGN = guideNumber * isoMultiplier * powerMultiplier;
  return effectiveGN / distance;
};

// Convert slider value to label
export const getSliderLabel = (value) => {
  if (value <= 0.2) return "Low";
  if (value <= 0.5) return "Medium";
  if (value <= 0.8) return "High";
  return "Max";
};

// Find viable flash solutions for target distance
export const findViableSolutions = (targetDistance, settings, currentISO, availableApertures) => {
  const solutions = [];

  ALL_POWER_LEVELS.forEach((power) => {
    const requiredAperture = calculateRequiredAperture(
      targetDistance,
      settings.guideNumber,
      currentISO,
      power
    );

    const closestAperture = availableApertures.reduce((prev, curr) =>
      Math.abs(curr - requiredAperture) < Math.abs(prev - requiredAperture)
        ? curr
        : prev
    );

    if (settings.availableApertures.includes(closestAperture)) {
      const actualDistance =
        (settings.guideNumber *
          Math.sqrt(currentISO / 100) *
          Math.sqrt(getPowerMultiplier(power))) /
        closestAperture;
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
        depthOfField: closestAperture,
      });
    }
  });

  // Sort by user preferences (independent weights)
  return solutions
    .sort((a, b) => {
      const efficiencyScore =
        (b.batteryEfficiency - a.batteryEfficiency) *
        settings.priorityWeights.efficiency;
      const dofScore =
        (a.depthOfField - b.depthOfField) *
        settings.priorityWeights.depthOfField;
      const accuracyScore =
        (b.distanceError - a.distanceError) *
        settings.priorityWeights.accuracy;

      return efficiencyScore + dofScore + accuracyScore;
    })
    .slice(0, 6);
};

// Get viable power levels for distance/aperture combination
export const getViablePowers = (distance, aperture, guideNumber, currentISO) => {
  const powerLevels = [
    { power: "1/128", value: 1 / 128, color: "bg-cyan-400" },
    { power: "1/64", value: 1 / 64, color: "bg-sky-400" },
    { power: "1/32", value: 1 / 32, color: "bg-blue-400" },
    { power: "1/16", value: 1 / 16, color: "bg-indigo-400" },
    { power: "1/8", value: 1 / 8, color: "bg-purple-400" },
    { power: "1/4", value: 1 / 4, color: "bg-violet-400" },
    { power: "1/2", value: 1 / 2, color: "bg-pink-400" },
    { power: "1/1", value: 1, color: "bg-red-400" },
  ];

  const viablePowers = [];

  powerLevels.forEach(({ power, value, color }) => {
    // Calculate distance achievable with this power level using current ISO
    const effectiveGN = guideNumber * Math.sqrt(currentISO / 100) * Math.sqrt(value);
    const achievableDistance = effectiveGN / aperture;

    // Consider viable if achievable distance is within 15% of target distance
    const tolerance = 0.15;
    if (
      achievableDistance >= distance * (1 - tolerance) &&
      achievableDistance <= distance * (1 + tolerance)
    ) {
      viablePowers.push({ power, color });
    }
  });

  return viablePowers;
};
