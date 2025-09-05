import React, { createContext, useContext } from 'react';

// Create context for theme mode
export interface ThemeModeContextType {
  /**
   * 当前实际应用到 MUI 主题的模式，仅为 'light' | 'dark'
   */
  mode: 'light' | 'dark';
  /**
   * 用户选择的主题偏好：明色、暗色、跟随系统
   */
  preference: 'light' | 'dark' | 'system';
  /**
   * 设置主题偏好（会持久化到本地缓存）
   */
  setPreference: (pref: 'light' | 'dark' | 'system') => void;
  /**
   * 兼容旧用法：在明/暗之间切换（会将偏好设置为 light 或 dark）
   */
  toggleColorMode: () => void;
}

export const ThemeModeContext = createContext<ThemeModeContextType>({
  mode: 'light',
  preference: 'light',
  setPreference: () => {},
  toggleColorMode: () => {},
});

// Hook to use theme mode
export const useThemeMode = () => useContext(ThemeModeContext);