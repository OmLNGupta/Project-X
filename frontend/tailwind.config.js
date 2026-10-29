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
        background: '#f8fafc',
        surface: 'rgba(255, 255, 255, 0.7)',
        card: 'rgba(255, 255, 255, 0.65)',
        cardHover: 'rgba(255, 255, 255, 0.85)',
        border: 'rgba(226, 232, 240, 0.8)',
        borderHover: 'rgba(203, 213, 225, 0.9)',
        nvidia: {
          DEFAULT: '#65a30d',
          dark: '#4d7c0f',
          light: '#84cc16',
          glow: 'rgba(101, 163, 13, 0.25)',
        },
        nebius: {
          DEFAULT: '#0284c7',
          dark: '#0369a1',
          light: '#38bdf8',
          glow: 'rgba(2, 132, 199, 0.25)',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pastel-card': '0 8px 30px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
        'pastel-pill': '0 2px 8px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
      },
      animation: {
        'pulse-slow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.04)' },
        }
      }
    },
  },
  plugins: [],
}
