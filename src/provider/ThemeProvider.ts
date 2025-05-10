import { createTheme } from '@mui/material/styles';
import { componentOverrides } from './Styles/componentOverrides';
import createLightTheme from './Styles/Themes/LightTheme';

const isDarkMode = document.documentElement.classList.contains('theme-dark');

export default function createCustomTheme() {
  if (isDarkMode) {
    const theme = createTheme({
      typography: {
        fontFamily: `'Baloo 2', cursive`,
      },
      palette: {
        mode: 'dark',
        primary: {
          main: '#3f51b5',
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
      components: componentOverrides,
    });

    return theme;
  } else {
    return createLightTheme();
  }
}
