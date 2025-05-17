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
  MuiButton: {
    styleOverrides: {
      root: {
        borderColor: '#ffffff',
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
};
