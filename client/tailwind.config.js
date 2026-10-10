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
          500: '#8B0000',
          600: '#8B0000',
          700: '#720000',
          800: '#5E0005',
          900: '#470003',
          crimson: '#8B0000',
          ruby: '#8B0000',
          dark: '#5E0005',
          wine: '#470003',
          accent: '#8B0000'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Poppins"', 'sans-serif'],
        poppins: ['"Plus Jakarta Sans"', '"Poppins"', 'sans-serif'],
        superadmin: ['"Plus Jakarta Sans"', '"Poppins"', 'sans-serif'],
        plusjakarta: ['"Plus Jakarta Sans"', '"Poppins"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
