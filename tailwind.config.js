/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#020610',
        surface: '#050d1a',
        gridBorder: '#0a1f3d',
        primaryAccent: '#00d4ff',
        aiAccent: '#7c3aed',
        danger: '#ff3d5a',
        warning: '#f59e0b',
        safe: '#10b981',
        textPrimary: '#e2f4ff',
        textMuted: '#4a7fa5',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-red': '0 0 20px rgba(255, 61, 90, 0.3)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
      }
    },
  },
  plugins: [],
}
