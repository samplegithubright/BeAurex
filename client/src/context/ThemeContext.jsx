import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove('dark');
    root.classList.add('light');
    if (body) {
      body.classList.remove('dark');
      body.classList.add('light');
    }
    const applyTheme = (cfg) => {
      if (!cfg) return;
      const rootEl = document.documentElement;
      if (cfg.primaryColor) {
        rootEl.style.setProperty('--brand-primary', cfg.primaryColor);
        rootEl.style.setProperty('--color-primary', cfg.primaryColor);
      }
      if (cfg.secondaryColor) {
        rootEl.style.setProperty('--brand-secondary', cfg.secondaryColor);
      }
      if (cfg.accentColor) {
        rootEl.style.setProperty('--brand-accent', cfg.accentColor);
      }
      if (cfg.cardRadius) {
        rootEl.style.setProperty('--card-radius', cfg.cardRadius);
      }
      if (cfg.cardBgColor) {
        rootEl.style.setProperty('--card-bg-color', cfg.cardBgColor);
      }
    };

    try {
      const savedTheme = localStorage.getItem('beaurex_theme_config');
      if (savedTheme) applyTheme(JSON.parse(savedTheme));
    } catch (_) {}

    const handleThemeUpdate = (e) => {
      if (e?.detail) applyTheme(e.detail);
    };
    window.addEventListener('beaurex_theme_config_updated', handleThemeUpdate);

    const handleStorageChange = (e) => {
      if (e.key === 'beaurex_theme_config' && e.newValue) {
        try { applyTheme(JSON.parse(e.newValue)); } catch (_) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    try {
      localStorage.setItem('loyalqr_theme', 'light');
    } catch (e) {}

    return () => {
      window.removeEventListener('beaurex_theme_config_updated', handleThemeUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Render nothing since user requested dark theme removal
export function ThemeToggle() {
  return null;
}

