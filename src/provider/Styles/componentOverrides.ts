const isDarkMode = document.documentElement.classList.contains('theme-dark');

export const componentOverrides = {
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
        backgroundColor: isDarkMode ? '#333' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
        fontFamily: `'Baloo Da 2', cursive`,
      },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      root: {
        color: '#ffffff',
        fontFamily: `'Baloo Da 2', cursive`,
        '&:hover': {
          textDecoration: 'none',
        },
      },
    },
  },
};
