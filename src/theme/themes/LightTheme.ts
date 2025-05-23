import { createTheme } from '@mui/material/styles';
import { componentOverrides } from '../overrides/componentOverrides';

export function CreateLightTheme() {
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#3f51b5',
      },
      background: {
        default: '#ffffff',
        paper: '#ffffff',
      },
      text: {
        primary: '#000000',
        secondary: '#4b5563',
      },
    },
    components: {
      ...componentOverrides,
      MuiButton: {
        styleOverrides: {
          root: {
            color: '#ffffff',
            backgroundColor: '#000000',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#ffffff',
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: '#ffffff',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            color: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.87)',
          },
        },
      },
    },
  });

  return theme;
}
