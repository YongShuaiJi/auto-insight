import React, { useEffect, useMemo, useState } from 'react';
import { ThemeModeContext } from './ThemeModeContext';

const STORAGE_KEY = 'themePreference';

// Note: We previously used MUI's theme system here. Since the app now uses Ant Design's ConfigProvider
// for theming, we keep only the mode state and context without MUI theme objects.

// Theme provider component
interface ThemeProviderWrapperProps {
  children: React.ReactNode;
}

const getSystemMode = (): 'light' | 'dark' => {
  try {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
};

export const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = ({ children }) => {
  // 初始化读取本地缓存；无缓存则默认写入 'light'
  const [preference, setPreferenceState] = useState<'light' | 'dark' | 'system'>(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (cached === 'light' || cached === 'dark' || cached === 'system') {
      return cached;
    }
    // 默认使用明色并写入缓存
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'light');
    }
    return 'light';
  });

    // 实际生效的主题模式（仅 light/dark）
  const [mode, setMode] = useState<'light' | 'dark'>(() =>
    preference === 'system' ? getSystemMode() : (preference as 'light' | 'dark')
  );

  // 当偏好变化时，写入本地缓存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // 忽略写缓存失败
    }
  }, [preference]);

  // 当偏好为 system 时监听系统主题变化；否则直接应用设定的明/暗
  useEffect(() => {
    if (preference === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        setMode(e.matches ? 'dark' : 'light');
      };
      // 设置当前系统模式
      setMode(mql.matches ? 'dark' : 'light');
      // 监听系统变化
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    } else {
      setMode(preference);
    }
  }, [preference]);

  const contextValue = useMemo(
    () => ({
      mode,
      preference,
      setPreference: (pref: 'light' | 'dark' | 'system') => setPreferenceState(pref),
      // 兼容旧用法：在明/暗之间切换（会把偏好设置为对应值）
      toggleColorMode: () =>
        setPreferenceState((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [mode, preference]
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export default ThemeProviderWrapper;
