import { createTheme, ThemeProvider } from '@mui/material/styles';
import { componentOverrides } from '../overrides/componentOverrides';
import { CreateLightTheme } from '../themes/LightTheme';

const isDarkMode = document.documentElement.classList.contains('theme-dark');

export function GetTheme() {
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
       
      },
    });

    return theme;
  } else {
    return CreateLightTheme();
  }
}
