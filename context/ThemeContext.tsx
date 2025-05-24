import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  currentTheme: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
  colors: {
    background: string;
    card: string;
    text: string;
    subText: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme() as 'light' | 'dark';
  const [theme, setTheme] = useState<ThemeType>('system');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(systemTheme || 'light');

  useEffect(() => {
    if (theme === 'system') {
      setCurrentTheme(systemTheme || 'light');
    } else {
      setCurrentTheme(theme);
    }
  }, [theme, systemTheme]);

  const lightColors = {
    background: '#FFFFFF',
    card: '#F5F5F7',
    text: '#000000',
    subText: '#6E6E73',
    border: '#D1D1D6',
    primary: '#7B61FF',
    secondary: '#5856D6',
    accent: '#3E8BFF',
    success: '#32D74B',
    warning: '#FF9500',
    error: '#FF3B30',
  };

  const darkColors = {
    background: '#121212',
    card: '#1C1C1E',
    text: '#FFFFFF',
    subText: '#8E8E93',
    border: '#38383A',
    primary: '#7B61FF',
    secondary: '#5E5CE6',
    accent: '#5AC8FA',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
  };

  const colors = currentTheme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};