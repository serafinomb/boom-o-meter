import { useState } from 'react';

export const useCalculator = () => {
  const [targetDistance, setTargetDistance] = useState(2);
  const [iso, setIso] = useState(160);
  const [selectedSolution, setSelectedSolution] = useState(0);

  const resetCalculator = () => {
    setTargetDistance(2);
    setIso(160);
    setSelectedSolution(0);
  };

  return {
    targetDistance,
    setTargetDistance,
    iso,
    setIso,
    selectedSolution,
    setSelectedSolution,
    resetCalculator
  };
};
