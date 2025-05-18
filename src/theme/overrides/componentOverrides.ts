const isDarkMode = document.documentElement.classList.contains('theme-dark');

export const componentOverrides = {
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
        color: '#add8e6', 
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
        backgroundColor: isDarkMode ? '#add8e6' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
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
      },
      sizeSmall: {
        padding: '4px 8px',
        fontSize: '0.875rem',
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
