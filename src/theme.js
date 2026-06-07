import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#dd3e00',
      light: '#ff6a3d',
      dark: '#b52f00',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff7a45',
      light: '#ffb38a',
      dark: '#d9551e',
    },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#0b1120',
      paper: mode === 'light' ? '#ffffff' : '#111827',
    },
    text: {
      primary: mode === 'light' ? '#0f172a' : '#f8fafc',
      secondary: mode === 'light' ? '#64748b' : '#94a3b8',
    },
    divider: mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 800,
      fontSize: 'clamp(2rem, 3vw, 3.2rem)',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 800,
      fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)',
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: mode === 'light' 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
          border: mode === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 12,
        },
      },
    },
  },
});

export const getTheme = (mode) => createTheme(getDesignTokens(mode));

export default getTheme;
