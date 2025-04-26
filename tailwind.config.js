/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        baloo: ['Baloo Da 2', 'cursive'],
        lato: ['Lato', 'sans-serif'],
        fredoka: ['Fredoka', 'sans-serif'],
        baloo2: ['Baloo 2', 'sans-serif'],
      },
      colors: {
        midnight: '#0F0F0F',
        redorange: '#E03201',
        charcoal: '#111827',
      },
    },
  },
  plugins: [],
};
