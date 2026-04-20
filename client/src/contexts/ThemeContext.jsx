import { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#000000',
            colorLink: '#000000',
            colorLinkHover: '#333333',
            borderRadius: 2,
            fontFamily: "'Inter', sans-serif",
          },
          components: {
            Button: {
              borderRadius: 0,
              controlHeight: 40,
              colorPrimary: '#000000',
              colorPrimaryHover: '#333333',
            },
            Input: {
              borderRadius: 0,
              controlHeight: 40,
            },
            Select: {
              borderRadius: 0,
              controlHeight: 40,
            }
          }
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>

  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};





