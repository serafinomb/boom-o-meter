import React, { useState } from "react";
import SettingsScreen from "./components/screens/SettingsScreen";
import CalculatorScreen from "./components/screens/CalculatorScreen";
import { useSettings } from "./hooks/useSettings";
import { useCalculator } from "./hooks/useCalculator";
import { useFlashCalculations } from "./hooks/useFlashCalculations";

function App() {
  const [currentScreen, setCurrentScreen] = useState("calculator");

  // Use custom hooks for state management
  const { settings, setSettings, resetToDefaults } = useSettings();
  const {
    targetDistance,
    setTargetDistance,
    iso,
    setIso,
    selectedSolution,
    setSelectedSolution,
  } = useCalculator();

  // Get current ISO based on photography mode
  const currentISO =
    settings.photographyMode === "analog" ? settings.fixedISO : iso;
  const availableApertures = settings.availableApertures;

  // Calculate viable solutions
  const { viableSolutions, currentSolution } = useFlashCalculations(
    targetDistance,
    settings,
    currentISO,
    availableApertures
  );

  const solution = currentSolution(selectedSolution);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {currentScreen === "settings" ? (
        <SettingsScreen
          settings={settings}
          setSettings={setSettings}
          resetToDefaults={resetToDefaults}
          onBack={() => setCurrentScreen("calculator")}
        />
      ) : (
        <CalculatorScreen
          settings={settings}
          targetDistance={targetDistance}
          setTargetDistance={setTargetDistance}
          iso={iso}
          setIso={setIso}
          selectedSolution={selectedSolution}
          setSelectedSolution={setSelectedSolution}
          viableSolutions={viableSolutions}
          currentSolution={solution}
          currentISO={currentISO}
          onSettingsClick={() => setCurrentScreen("settings")}
        />
      )}
    </div>
  );
}

export default App;
