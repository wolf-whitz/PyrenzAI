/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        baloo: ['Baloo Tammudu 2'],
        lato: ['Lato'],
        fredoka: ['Fredoka'],
        baloo2: ['Baloo 2'],
      },
      colors: {
        midnight: '#0F0F0F',
        redorange: '#E03201',
        charcoal: '#111827',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },  
    },
  },
  plugins: [],
};
