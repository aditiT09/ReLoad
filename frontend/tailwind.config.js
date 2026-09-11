/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F6E56',
        'primary-dark': '#0B5240',
        'primary-tint': '#E6F4F1',
        background: '#F8F9FA',
        'on-surface': '#16212E',
        'on-surface-variant': '#5A6578',
        outline: '#E2E8F0',
        'outline-variant': '#CBD5E1',
        'surface-white': '#FFFFFF',
        'surface-dim': '#F1F5F9',
        'surface-container-high': '#F1F5F9',
        'surface-container-highest': '#E2E8F0',
        'cold-chain': '#2563EB',
        'cold-chain-tint': '#EFF6FF',
        'status-verified': '#0F6E56',
        'status-verified-tint': '#E6F4F1',
        'status-due': '#D97706',
        'status-due-tint': '#FEF3C7',
        'status-alert': '#DC2626',
        'status-alert-tint': '#FEF2F2',
        'admin-console-navy': '#0F172A',
        'neutral-slate': '#64748B',
        'neutral-slate-tint': '#F1F5F9',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite linear',
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
