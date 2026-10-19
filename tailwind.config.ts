import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space)', 'Space Grotesk', '-apple-system', 'sans-serif'],
        space: ['var(--font-space)', 'Space Grotesk', 'sans-serif'],
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'monospace'],
      },
      colors: {
        itsua: {
          primary: '#0E1012',
          secondary: '#2F4CFF',
          tertiary: '#008B6B',
          error: '#C45A00',
          neutral: '#FFFFFF',
          surface: '#FFFFFF',
          'on-surface': '#0E1012',
          border: '#E5E7EB',
          muted: '#6B7280',
          'accent-blue': '#2F4CFF',
          'accent-green': '#008B6B',
          'accent-orange': '#C45A00',
          'dark-canvas': '#07080A',
          'dark-surface': '#0E1012',
          'dark-border': '#1F2429',
          'dark-muted': '#9CA3AF',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#2F4CFF',
          600: '#253dcf',
          700: '#1d30a8',
          800: '#172582',
          900: '#131e66',
          950: '#0b113b',
        },
        coral: {
          50: '#fff5f3',
          100: '#ffe8e5',
          200: '#ffd5ce',
          300: '#ffb5a8',
          400: '#ff8370',
          500: '#2F4CFF',
          600: '#253dcf',
          700: '#1d30a8',
          800: '#172582',
          900: '#131e66',
          950: '#0b113b',
        },
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
