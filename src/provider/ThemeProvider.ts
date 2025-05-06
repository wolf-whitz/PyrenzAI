import { createTheme } from '@mui/material/styles';

const isDarkMode = document.documentElement.classList.contains('theme-dark');

export default function createCustomTheme() {
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
      MuiSlider: {
        styleOverrides: {
          thumb: {
            color: '#fff',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            marginBottom: '16px',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: '4px',
            backgroundColor: isDarkMode ? '#333' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
            fontFamily: `'Baloo Da 2', cursive`,
          },
        },
      },
    },
  });

  return theme;
}
