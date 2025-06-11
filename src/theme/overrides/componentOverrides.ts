const getIsDarkMode = () =>
  document.documentElement.classList.contains('theme-dark');

export const componentOverrides = {
  values: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  MuiSlider: {
    styleOverrides: {
      thumb: {
        color: '#fff',
      },
    },
  },    
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: '4px',
        color: '#add8e6',
        transition: 'transform 0.3s ease, color 0.3s ease',
        '&:hover': {
          backgroundColor: 'transparent',
          color: 'grey',
          transform: 'scale(1.2)',
        },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: '4px',
        backgroundColor: '#add8e6',
        color: getIsDarkMode() ? '#fff' : '#000',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderColor: '#add8e6',
        minWidth: 'auto',
        padding: '6px 12px',
        borderRadius: '20px',
        '&:hover': {
          borderRadius: '20px',
          backgroundColor: 'rgba(173, 216, 230, 0.1)',
        },
      },
      sizeSmall: {
        padding: '4px 8px',
        fontSize: '0.875rem',
        borderRadius: '20px',
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
  MuiCircularProgress: {
    styleOverrides: {
      root: {
        color: 'blue',
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
      },
    },
  },
};
