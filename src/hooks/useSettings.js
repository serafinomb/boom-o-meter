import { useState } from 'react';
import { DEFAULT_SETTINGS } from '../utils/constants';

export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    setSettings,
    updateSettings,
    resetToDefaults
  };
};
