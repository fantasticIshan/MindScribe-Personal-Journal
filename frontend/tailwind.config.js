/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F6F2E9',
          dark: '#EBE3CF',
        },
        ink: {
          DEFAULT: '#232A3B',
          soft: '#4E5568',
          faint: '#8A8F9E',
        },
        accent: {
          DEFAULT: '#9C6B3E',
          dark: '#7A5230',
          light: '#C79A69',
        },
        sage: {
          DEFAULT: '#5B7A66',
          dark: '#456052',
        },
        brick: {
          DEFAULT: '#A6472F',
          dark: '#843923',
        },
        line: '#DDD3BC',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        journal: ['"Literata"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        page: '0 1px 2px rgba(35, 42, 59, 0.06), 0 8px 24px -12px rgba(35, 42, 59, 0.18)',
      },
      borderRadius: {
        page: '2px',
      },
    },
  },
  plugins: [],
};
