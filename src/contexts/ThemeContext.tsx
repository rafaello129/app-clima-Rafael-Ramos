import React, { createContext, useState, useMemo, ReactNode } from 'react';


interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}


export const ThemeContext = createContext<ThemeContextType>(null!);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    return savedTheme || 'light';
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      // Guardamos la nueva preferencia en el almacenamiento local.
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };


  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};