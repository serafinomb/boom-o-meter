import { ALL_POWER_LEVELS, POWER_LEVEL_COLORS } from './constants';

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
        powerConsumption: powerValue, // Higher = more power consumed
        depthOfField: closestAperture, // Higher = deeper DOF
      });
    }
  });

  // Sort by user preferences with normalized scoring
  return solutions
    .sort((a, b) => {
      // Normalize scores to similar scales (0-1) before applying weights
      
      // Power Efficiency: Lower power consumption is better
      // powerConsumption ranges from ~0.0078 (1/128) to 1.0 (1/1)
      // Normalize by dividing by max possible difference (≈1.0)
      const efficiencyScore =
        (a.powerConsumption - b.powerConsumption) *
        settings.priorityWeights.efficiency;
      
      // Depth of Field: Higher aperture numbers = deeper DOF
      // aperture values like 2.8, 4, 5.6, 8, 11, 16, 22
      // Normalize by dividing by a reasonable max difference (≈15)
      const dofScore =
        ((b.depthOfField - a.depthOfField) / 15) *
        settings.priorityWeights.depthOfField;
      
      // Distance Accuracy: Lower error is better
      // Normalize by dividing by 2m (reasonable max error we care about)
      const maxReasonableError = 2.0;
      const normalizedAccuracyScore = Math.min(
        (a.distanceError - b.distanceError) / maxReasonableError,
        1.0
      );
      const accuracyScore = normalizedAccuracyScore * settings.priorityWeights.accuracy;

      const totalScore = efficiencyScore + dofScore + accuracyScore;
      
      // Secondary sort by aperture for consistency when scores are equal
      if (Math.abs(totalScore) < 0.001) {
        return b.depthOfField - a.depthOfField;
      }
      
      return totalScore;
    })
    .slice(0, 6);
};

// Get viable power levels for distance/aperture combination
export const getViablePowers = (distance, aperture, guideNumber, currentISO) => {
  // Create power levels array from constants
  const powerLevels = POWER_LEVEL_COLORS.map(({ power, color }) => ({
    power,
    value: getPowerMultiplier(power),
    color,
  }));

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
