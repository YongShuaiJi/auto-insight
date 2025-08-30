import React, { createContext, useContext } from 'react';

// Create context for theme mode
export interface ThemeModeContextType {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
}

export const ThemeModeContext = createContext<ThemeModeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
});

// Hook to use theme mode
export const useThemeMode = () => useContext(ThemeModeContext);