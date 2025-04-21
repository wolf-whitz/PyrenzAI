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
    },
  },
  plugins: [],
};
