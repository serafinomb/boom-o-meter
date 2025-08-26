import { useMemo } from 'react';
import { findViableSolutions } from '../utils/flashCalculations';

export const useFlashCalculations = (targetDistance, settings, currentISO, availableApertures) => {
  const viableSolutions = useMemo(() => {
    return findViableSolutions(targetDistance, settings, currentISO, availableApertures);
  }, [targetDistance, settings, currentISO, availableApertures]);

  const currentSolution = (selectedSolution) => 
    viableSolutions[selectedSolution] || viableSolutions[0];

  return {
    viableSolutions,
    currentSolution
  };
};
