import React, { createContext, useContext, useMemo, useState } from 'react';
import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

type Palette = {
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  primary: string;
  accent: string;
  border: string;
  success: string;
  danger: string;
  gradient: [string, string];
};

const lightPalette: Palette = {
  background: '#F4F7FB',
  surface: '#FFFFFF',
  text: '#111827',
  mutedText: '#6B7280',
  primary: '#0A4B9E',
  accent: '#11A579',
  border: '#E5E7EB',
  success: '#0E9F6E',
  danger: '#E02424',
  gradient: ['#0A4B9E', '#11A579'],
};

const darkPalette: Palette = {
  background: '#0B1220',
  surface: '#111827',
  text: '#F3F4F6',
  mutedText: '#9CA3AF',
  primary: '#3B82F6',
  accent: '#34D399',
  border: '#1F2937',
  success: '#34D399',
  danger: '#F87171',
  gradient: ['#1E3A8A', '#047857'],
};

type ThemeContextType = {
  isDarkMode: boolean;
  palette: Palette;
  navTheme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const palette = isDarkMode ? darkPalette : lightPalette;

  const navTheme = useMemo<Theme>(() => {
    const base = isDarkMode ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: palette.background,
        card: palette.surface,
        text: palette.text,
        border: palette.border,
        primary: palette.primary,
      },
    };
  }, [isDarkMode, palette]);

  const value = useMemo(
    () => ({
      isDarkMode,
      palette,
      navTheme,
      toggleTheme: () => setIsDarkMode((prev) => !prev),
    }),
    [isDarkMode, palette, navTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return context;
}
