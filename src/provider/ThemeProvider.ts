import { createTheme } from '@mui/material/styles';

const isDarkMode = document.documentElement.classList.contains('theme-dark');

const theme = createTheme({
  typography: {
    fontFamily: `'Baloo 2', cursive`,
  },
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: '#3f51b5',
    },
    background: {
      default: isDarkMode ? '#111827' : '#ffffff',
      paper: isDarkMode ? '#1f2937' : '#ffffff',
    },
    text: {
      primary: isDarkMode ? '#ffffff' : '#000000',
      secondary: isDarkMode ? '#d1d5db' : '#4b5563',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          padding: '6px 12px',
        },
        sizeSmall: {
          padding: '4px 8px',
          fontSize: '0.875rem',
        },
      },
    },
  },
});

export default theme;
