/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        baloo: ['Comic Neue', 'Baloo 2', 'system-ui'],
        lato: ['Lato', 'Baloo Tammudu 2', 'system-ui'],
        fredoka: ['Fredoka', 'Baloo Tammudu 2', 'system-ui'],
        baloo2: ['Baloo 2', 'Baloo Tammudu 2', 'system-ui'],
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
