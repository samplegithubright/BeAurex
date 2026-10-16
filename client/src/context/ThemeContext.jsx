import React, { createContext, useContext, useEffect, useState } from 'react';

export const DEFAULT_THEME_CONFIG = {
  primaryColor: '#8B0000',
  secondaryColor: '#590104',
  accentColor: '#D97706',
  cardRadius: '24px',
  cardRadiusClass: 'rounded-3xl',
  cardDensity: 'comfortable',
  cardElevation: 'soft',
  fontSize: 'standard',
  lastUpdated: ''
};

export const applyThemeToDOM = (cfg) => {
  if (!cfg) return;
  const root = document.documentElement;

  const primary = cfg.primaryColor || '#8B0000';
  const secondary = cfg.secondaryColor || '#590104';
  const accent = cfg.accentColor || '#D97706';
  const radius = cfg.cardRadius || '24px';
  const fontScale = cfg.fontSize === 'compact' ? '0.92' : cfg.fontSize === 'large' ? '1.08' : '1';

  root.style.setProperty('--brand-primary', primary);
  root.style.setProperty('--brand-secondary', secondary);
  root.style.setProperty('--brand-accent', accent);
  root.style.setProperty('--card-radius', radius);
  root.style.setProperty('--ui-font-scale', fontScale);

  // Dynamic CSS injection for arbitrary Tailwind classes and card looks across the entire site
  let styleEl = document.getElementById('beaurex-dynamic-theme-system');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'beaurex-dynamic-theme-system';
    document.head.appendChild(styleEl);
  }

  // Calculate elevation style
  let elevationCss = '';
  if (cfg.cardElevation === 'border') {
    elevationCss = `
      .saas-card, .theme-card-custom, [class*="rounded-3xl"].bg-white, [class*="rounded-2xl"].bg-white {
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        border: 1px solid #e2e8f0 !important;
      }
    `;
  } else if (cfg.cardElevation === 'glass') {
    elevationCss = `
      .saas-card, .theme-card-custom, [class*="rounded-3xl"].bg-white, [class*="rounded-2xl"].bg-white {
        backdrop-filter: blur(16px) !important;
        background-color: rgba(255, 255, 255, 0.90) !important;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08) !important;
        border: 1px solid rgba(255, 255, 255, 0.6) !important;
      }
    `;
  } else if (cfg.cardElevation === 'deep') {
    elevationCss = `
      .saas-card, .theme-card-custom, [class*="rounded-3xl"].bg-white, [class*="rounded-2xl"].bg-white {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08) !important;
      }
    `;
  } else if (cfg.cardElevation === 'glow') {
    elevationCss = `
      .saas-card, .theme-card-custom, [class*="rounded-3xl"].bg-white, [class*="rounded-2xl"].bg-white {
        box-shadow: 0 12px 30px -5px ${primary}33 !important;
        border-color: ${primary}40 !important;
      }
    `;
  } else {
    // soft shadow default
    elevationCss = `
      .saas-card, .theme-card-custom, [class*="rounded-3xl"].bg-white, [class*="rounded-2xl"].bg-white {
        box-shadow: 0 4px 15px -2px rgba(0, 0, 0, 0.06) !important;
      }
    `;
  }

  // Card density spacing
  let densityCss = '';
  if (cfg.cardDensity === 'compact') {
    densityCss = `
      .theme-density-card {
        padding: 0.75rem !important;
      }
    `;
  } else if (cfg.cardDensity === 'spacious') {
    densityCss = `
      .theme-density-card {
        padding: 1.75rem !important;
      }
    `;
  }

  styleEl.textContent = `
    :root {
      --brand-primary: ${primary};
      --brand-secondary: ${secondary};
      --brand-accent: ${accent};
      --card-radius: ${radius};
      --ui-font-scale: ${fontScale};
    }

    html {
      font-size: var(--ui-font-scale) !important;
    }

    /* Primary color backgrounds across landing, merchant, customer & team */
    .bg-\\[\\#8B0000\\], .bg-\\[\\#8b0000\\], .bg-\\[\\#720000\\], .bg-\\[\\#690005\\], .bg-\\[\\#590104\\], .bg-\\[\\#981b2a\\], .bg-\\[\\#a30d0d\\] {
      background-color: var(--brand-primary) !important;
    }

    /* Hover primary states */
    .hover\\:bg-\\[\\#720000\\]:hover, .hover\\:bg-\\[\\#700000\\]:hover, .hover\\:bg-\\[\\#8B0000\\]:hover, .hover\\:bg-\\[\\#590104\\]:hover, .hover\\:bg-\\[\\#690005\\]:hover {
      background-color: var(--brand-secondary) !important;
    }

    /* Text colors */
    .text-\\[\\#8B0000\\], .text-\\[\\#8b0000\\], .text-\\[\\#720000\\] {
      color: var(--brand-primary) !important;
    }
    .hover\\:text-\\[\\#8B0000\\]:hover, .hover\\:text-\\[\\#720000\\]:hover {
      color: var(--brand-primary) !important;
    }

    /* Border colors */
    .border-\\[\\#8B0000\\], .border-\\[\\#8b0000\\], .border-\\[\\#720000\\] {
      border-color: var(--brand-primary) !important;
    }
    .focus\\:border-\\[\\#8B0000\\]:focus {
      border-color: var(--brand-primary) !important;
    }

    /* Rings, outlines & accents */
    .ring-\\[\\#8B0000\\] {
      --tw-ring-color: var(--brand-primary) !important;
    }
    .accent-\\[\\#8B0000\\] {
      accent-color: var(--brand-primary) !important;
    }
    .fill-\\[\\#8B0000\\] {
      fill: var(--brand-primary) !important;
    }
    .stroke-\\[\\#8B0000\\] {
      stroke: var(--brand-primary) !important;
    }
    .selection\\:bg-\\[\\#8B0000\\]::selection {
      background-color: var(--brand-primary) !important;
    }

    /* Gradient definitions */
    .crimson-gradient, .ruby-crimson-bg {
      background-color: var(--brand-primary) !important;
      background-image: linear-gradient(145deg, var(--brand-primary) 0%, var(--brand-secondary) 100%) !important;
    }

    .from-\\[\\#8B0000\\], .from-\\[\\#690005\\], .from-\\[\\#720000\\] {
      --tw-gradient-from: var(--brand-primary) var(--tw-gradient-from-position) !important;
      --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position) !important;
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
    }

    .to-\\[\\#8B0000\\], .to-\\[\\#590104\\], .to-\\[\\#720000\\], .to-\\[\\#981b2a\\], .to-\\[\\#a30d0d\\] {
      --tw-gradient-to: var(--brand-secondary) var(--tw-gradient-to-position) !important;
    }

    .via-\\[\\#8B0000\\] {
      --tw-gradient-stops: var(--tw-gradient-from), var(--brand-primary) var(--tw-gradient-via-position), var(--tw-gradient-to) !important;
    }

    .saas-btn-primary {
      background-color: var(--brand-primary) !important;
    }
    .saas-btn-primary:hover {
      background-color: var(--brand-secondary) !important;
    }

    /* Dynamic Card Corner Radius across Landing Page, Dashboards & Portals */
    .rounded-3xl {
      border-radius: var(--card-radius) !important;
    }
    .rounded-2xl {
      border-radius: calc(var(--card-radius) * 0.75) !important;
    }
    .rounded-xl {
      border-radius: calc(var(--card-radius) * 0.5) !important;
    }
    .saas-card {
      border-radius: var(--card-radius) !important;
    }

    ${elevationCss}
    ${densityCss}
  `;
};

const ThemeContext = createContext({
  theme: 'light',
  themeConfig: DEFAULT_THEME_CONFIG,
  updateThemeConfig: () => {}
});

export function ThemeProvider({ children }) {
  const [themeConfig, setThemeConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_theme_config');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_THEME_CONFIG;
  });

  const updateThemeConfig = (newConfig) => {
    const updated = {
      ...themeConfig,
      ...newConfig,
      lastUpdated: new Date().toISOString()
    };
    setThemeConfig(updated);
    try {
      localStorage.setItem('beaurex_theme_config', JSON.stringify(updated));
    } catch (_) {}
    applyThemeToDOM(updated);
    window.dispatchEvent(new CustomEvent('beaurex_theme_config_updated', { detail: updated }));
    fetch('/api/admin/theme-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(() => {});
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove('dark');
    root.classList.add('light');
    if (body) {
      body.classList.remove('dark');
      body.classList.add('light');
    }

    // Apply active theme immediately
    applyThemeToDOM(themeConfig);

    // Sync across tabs & custom events
    const handleThemeUpdate = (e) => {
      if (e?.detail) {
        setThemeConfig(e.detail);
        applyThemeToDOM(e.detail);
      } else {
        try {
          const saved = localStorage.getItem('beaurex_theme_config');
          if (saved) {
            const parsed = JSON.parse(saved);
            setThemeConfig(parsed);
            applyThemeToDOM(parsed);
          }
        } catch (_) {}
      }
    };

    window.addEventListener('beaurex_theme_config_updated', handleThemeUpdate);
    window.addEventListener('storage', handleThemeUpdate);

    // Try fetching synced theme config from server
    fetch('/api/admin/theme-config')
      .then(r => r.json())
      .then(d => {
        if (d && d.success && d.themeConfig) {
          setThemeConfig(d.themeConfig);
          localStorage.setItem('beaurex_theme_config', JSON.stringify(d.themeConfig));
          applyThemeToDOM(d.themeConfig);
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('beaurex_theme_config_updated', handleThemeUpdate);
      window.removeEventListener('storage', handleThemeUpdate);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'light', themeConfig, updateThemeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle() {
  return null;
}
