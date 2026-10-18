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
        background: '#070a12',
        surface: '#0d1322',
        card: '#121a2d',
        cardHover: '#17223b',
        border: '#1e293b',
        borderHover: '#334155',
        nvidia: {
          DEFAULT: '#76b900',
          dark: '#5a8d00',
          light: '#9be31a',
          glow: 'rgba(118, 185, 0, 0.25)',
        },
        nebius: {
          DEFAULT: '#00d2ff',
          dark: '#0094b8',
          light: '#5ce1e6',
          glow: 'rgba(0, 210, 255, 0.25)',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
