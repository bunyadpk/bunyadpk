/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#050B14',
        'obsidian-2': '#0A1422',
        cyan: {
          DEFAULT: '#00F2FE',
          glow: '#00F2FE80',
        },
        cobalt: '#1E40AF',
        platinum: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-slow-rev': 'spin-rev 28s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'ticker': 'ticker 38s linear infinite',
        'grid-pan': 'grid-pan 30s linear infinite',
        'spark': 'spark 1.6s ease-out infinite',
      },
      keyframes: {
        'spin-rev': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', boxShadow: '0 0 12px #00F2FE80' },
          '50%': { opacity: '1', boxShadow: '0 0 28px #00F2FE' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'grid-pan': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '60px 60px' },
        },
        spark: {
          '0%': { transform: 'scaleY(0)', opacity: '0' },
          '40%': { transform: 'scaleY(1)', opacity: '1' },
          '100%': { transform: 'scaleY(0.2)', opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'cyan-glow': '0 0 24px rgba(0, 242, 254, 0.35)',
        'cyan-soft': '0 0 14px rgba(0, 242, 254, 0.18)',
      },
    },
  },
  plugins: [],
};
