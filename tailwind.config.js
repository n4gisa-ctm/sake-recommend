/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#fdf8f7', 100: '#faeaea', 200: '#f4d5d5', 300: '#ebb5b8',
          400: '#d98a93', 500: '#c25e6e', 600: '#a3455a', 700: '#84374a',
        },
        cream: {
          50: '#fdfbf7', 100: '#f9f4ec', 200: '#f0e8da', 300: '#e4d7c3',
        },
        gold: {
          300: '#dcc891', 400: '#c9a96e', 500: '#b8954a', 600: '#9c7d3a',
        },
        sake: {
          100: '#f7e9d7', 200: '#ecd0b0', 300: '#d9b07a',
        },
        night: {
          900: '#0d0a08', 800: '#100d0a', 700: '#14110e',
          600: '#1a1510', 500: '#241f1a', 400: '#2e2820',
          300: '#4a4039',
        },
      },
    },
  },
  plugins: [],
};
