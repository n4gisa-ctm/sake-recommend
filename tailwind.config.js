/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 生成り（和紙）— 背景の基調
        washi: {
          50: '#fdfaf3', 100: '#f9f4e9', 200: '#f6f1e6',
          300: '#efe8d8', 400: '#e5dcc6', 500: '#d6cbae',
        },
        // 藍 — メインアクセント
        ai: {
          100: '#dce6f2', 200: '#b9cce4', 300: '#8fa8c8',
          400: '#4a6ba0', 500: '#375a8f', 600: '#2c4a7c',
          700: '#233c66', 800: '#1b2f52',
        },
        // 墨 — テキスト
        sumi: {
          300: '#9a938a', 500: '#5a554c', 700: '#33302b', 900: '#26231e',
        },
        // 金 — サブアクセント（降る銘柄の一部・装飾）
        gold: {
          300: '#dcc891', 400: '#c9a96e', 500: '#b8954a', 600: '#9c7d3a',
        },
        // 桜 — ごく控えめな差し色
        sakura: {
          300: '#ebb5b8', 400: '#d98a93', 500: '#c25e6e', 600: '#a3455a',
        },
      },
    },
  },
  plugins: [],
};
