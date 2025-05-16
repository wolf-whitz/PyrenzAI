import { createTheme } from '@mui/material/styles';
import { componentOverrides } from './Styles/componentOverrides';
import { CreateLightTheme } from './Styles/Themes/LightTheme';

const isDarkMode = document.documentElement.classList.contains('theme-dark');

export function createCustomTheme() {
  if (isDarkMode) {
    const theme = createTheme({
      typography: {
        fontFamily: 'Baloo Tammudu 2',
      },
      palette: {
        mode: 'dark',
        primary: {
          main: '#111827',
        },
        background: {
          default: '#111827',
          paper: '#1f2937',
        },
        text: {
          primary: '#ffffff',
          secondary: '#d1d5db',
        },
      },
      components: {
        ...componentOverrides,
        MuiButton: {
          styleOverrides: {
            root: {
              color: '#ffffff',
              borderColor: '#ffffff',
            },
          },
        },
        MuiListItem: {
          styleOverrides: {
            root: {
              color: '#ffffff',
            },
          },
        },
        MuiListItemIcon: {
          styleOverrides: {
            root: {
              color: '#ffffff',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: '#111827',
            },
          },
        },
        MuiToolbar: {
          styleOverrides: {
            root: {
              backgroundColor: '#111827',
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: '#111827',
            },
          },
        },
      },
    });

    return theme;
  } else {
    return CreateLightTheme();
  }
}
