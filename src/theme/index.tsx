import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useEffect, useMemo, useState } from 'react';
import { ThemeModeContext } from './ThemeModeContext';

const STORAGE_KEY = 'themePreference';

// Define theme colors
const lightThemeColors = {
  primary: {
    main: '#007FFF',
    light: '#66B2FF',
    dark: '#0059B2',
    contrastText: '#fff',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#fff',
  },
  background: {
    default: '#f5f5f5',
    paper: '#fff',
  },
};

const darkThemeColors = {
  primary: {
    main: '#66B2FF',
    light: '#99CCFF',
    dark: '#0059B2',
    contrastText: '#000',
  },
  secondary: {
    main: '#ce93d8',
    light: '#f3e5f5',
    dark: '#ab47bc',
    contrastText: '#000',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#fff',
    secondary: 'rgba(255, 255, 255, 0.7)',
  },
};

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

  // 实际生效的 MUI 主题模式（仅 light/dark）
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

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light' ? lightThemeColors : darkThemeColors),
        },
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? '#0066CC' // Blue background for AppBar in light mode only
                    : undefined, // Use default dark theme color in dark mode
              }),
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor: '#6b6b6b #2b2b2b',
                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                  backgroundColor: mode === 'light' ? '#f5f5f5' : '#2b2b2b',
                  width: 8,
                },
                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                  borderRadius: 8,
                  backgroundColor: mode === 'light' ? '#c1c1c1' : '#6b6b6b',
                  minHeight: 24,
                },
                '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
                  backgroundColor: mode === 'light' ? '#a8a8a8' : '#959595',
                },
                '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
                  backgroundColor: mode === 'light' ? '#a8a8a8' : '#959595',
                },
                '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: mode === 'light' ? '#a8a8a8' : '#959595',
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeProviderWrapper;
