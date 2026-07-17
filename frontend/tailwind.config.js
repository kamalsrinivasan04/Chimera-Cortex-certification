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
        primary: {
          50: '#fff4eb',
          100: '#ffe6d3',
          200: '#ffd0aa',
          300: '#ffb06d',
          400: '#ff8b4d',
          500: '#ff6a1f',
          600: '#ff4a03',
          700: '#d63d04',
          800: '#ae3009',
          900: '#8d280a',
          950: '#4a1304',
        },
        slate: {
          50: '#fefefe',
          100: '#e7e7e7',
          200: '#d2d2d2',
          300: '#a8a8a8',
          400: '#7a7a7a',
          500: '#555555',
          600: '#3b3b3b',
          700: '#2a2a2a',
          800: '#1b1b1b',
          850: '#151515',
          855: '#131313',
          900: '#101010',
          950: '#080808',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
