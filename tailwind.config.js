/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // AKILI Brand Colors
        gold: {
          DEFAULT: '#FDB913',
          50: '#FEF5D6',
          100: '#FEEFC0',
          200: '#FDE395',
          300: '#FDD769',
          400: '#FDCB3E',
          500: '#FDB913',
          600: '#D49A03',
          700: '#9F7302',
          800: '#6A4C02',
          900: '#352601',
        },
        akili: {
          black: '#0A0A0A',
          dark: '#121212',
          gray: '#1A1A1A',
        },
        // Pan-African Colors
        pan: {
          red: '#EF4444',
          green: '#10B981',
          gold: '#FDB913',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(253, 185, 19, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(253, 185, 19, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
