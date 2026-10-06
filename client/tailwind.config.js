/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          crimson: '#8B0000',
          ruby: '#9E000D',
          dark: '#5E0005',
          wine: '#470003',
          accent: '#c8102e'
        }
      },
      fontFamily: {
        sans: ['"Poppins"', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
