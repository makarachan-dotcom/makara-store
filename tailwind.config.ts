import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ផ្ទៃខាងក្រោយចម្បង - Deep Obsidian */
        obsidian: {
          DEFAULT: '#0B0F19',
          50: '#1a1f2e',
          100: '#151a27',
          200: '#111520',
          300: '#0d1119',
          400: '#090c14',
          500: '#0B0F19',
          600: '#070a12',
          700: '#05070d',
          800: '#030408',
          900: '#010203',
        },
        /* ពន្លឺសម្រាប់ Accent - Neon Cyan */
        neon: {
          DEFAULT: '#00F2FE',
          50: '#e0fcff',
          100: '#b3f8fe',
          200: '#80f4fe',
          300: '#4df0fe',
          400: '#1aecfe',
          500: '#00F2FE',
          600: '#00c2cb',
          700: '#009198',
          800: '#006166',
          900: '#003033',
        },
        /* ស្ថានភាព/Highlight - Mythic Gold */
        gold: {
          DEFAULT: '#FFD700',
          50: '#fff9e0',
          100: '#fff0b3',
          200: '#ffe680',
          300: '#ffdd4d',
          400: '#ffd31a',
          500: '#FFD700',
          600: '#ccac00',
          700: '#998100',
          800: '#665600',
          900: '#332b00',
        },
      },
      fontFamily: {
        khmer: ['Kantumruy Pro', 'Koh Santepheap', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'neon-flicker': 'neonFlicker 1.5s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px #00F2FE, 0 0 10px #00F2FE, 0 0 20px #00F2FE' },
          '50%': { boxShadow: '0 0 10px #00F2FE, 0 0 20px #00F2FE, 0 0 40px #00F2FE' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        neonFlicker: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0,242,254,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,254,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'cyber-grid': '50px 50px',
      },
    },
  },
  plugins: [],
}
export default config
