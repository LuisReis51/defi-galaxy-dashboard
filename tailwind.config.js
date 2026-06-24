/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'space-black': '#020408',
        'space-deep': '#06090f',
        'neon-cyan': '#00f5ff',
        'neon-green': '#00ff88',
        'neon-gold': '#ffd700',
        'neon-purple': '#bf00ff',
        'neon-red': '#ff3355',
        'panel-bg': 'rgba(6, 18, 34, 0.85)',
        'panel-border': 'rgba(0, 245, 255, 0.2)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Exo 2"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanLine 2s linear infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.92' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 245, 255, 0.5)',
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.5)',
        'neon-gold': '0 0 20px rgba(255, 215, 0, 0.5)',
        'panel': '0 0 40px rgba(0, 245, 255, 0.1), inset 0 0 40px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
