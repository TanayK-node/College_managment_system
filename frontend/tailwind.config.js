/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#03045E',
          700: '#0077B6',
          500: '#00B4D8',
          300: '#90E0EF',
          100: '#CAF0F8',
        },
      },
    },
  },
  plugins: [],
};