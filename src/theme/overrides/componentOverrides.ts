const getIsDarkMode = () => document.documentElement.classList.contains('theme-dark');

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
        color: '#808080',
        '&:hover': {
          backgroundColor: 'transparent',
          color: 'grey',
        },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: '4px',
        backgroundColor: getIsDarkMode() ? '#add8e6' : '#fff',
        color: getIsDarkMode() ? '#fff' : '#000',
        fontFamily: `'Baloo Da 2', cursive`,
      },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      root: {
        color: '#add8e6',
        fontFamily: `'Baloo Da 2', cursive`,
        '&:hover': {
          textDecoration: 'none',
        },
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
  MuiListItem: {
    styleOverrides: {
      root: {
        color: '#add8e6',
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        color: '#add8e6',
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
};
