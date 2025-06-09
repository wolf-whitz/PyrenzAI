import { createTheme } from '@mui/material/styles';
import { componentOverrides } from '../overrides/componentOverrides';
import { CreateLightTheme } from '../themes/LightTheme';

export function GetTheme() {
  const themeAttr = document.documentElement.getAttribute('data-mui-theme');

  const isLightMode = themeAttr === 'theme-light';

  if (isLightMode) {
    return CreateLightTheme();
  } else {
    return createTheme({
      typography: {
        fontFamily: 'Comic Neue, system-ui',
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
  }
}
