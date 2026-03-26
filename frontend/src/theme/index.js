import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a2e',
      light: '#2d2d4e',
      dark: '#0d0d1a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e8673a',
      light: '#f08860',
      dark: '#c44f25',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2ecc8f',
      light: '#55d9a8',
      dark: '#20a870',
    },
    warning: {
      main: '#f0a500',
      light: '#f5b833',
      dark: '#cc8c00',
    },
    error: {
      main: '#e84040',
      light: '#ee6666',
      dark: '#c42020',
    },
    info: {
      main: '#3a86e8',
      light: '#60a0f0',
      dark: '#256ac4',
    },
    background: {
      default: '#f5f4f0',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#6b6b8a',
    },
    divider: '#e8e8f0',
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.025em' },
    h3: { fontWeight: 600, letterSpacing: '-0.02em' },
    h4: { fontWeight: 600, letterSpacing: '-0.015em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600, letterSpacing: '-0.005em' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    caption: { fontFamily: '"DM Mono", monospace', fontSize: '0.75rem' },
    overline: { fontFamily: '"DM Mono", monospace', letterSpacing: '0.12em', fontSize: '0.7rem' },
    button: { fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 2px rgba(26,26,46,0.06)',
    '0 2px 6px rgba(26,26,46,0.08)',
    '0 4px 12px rgba(26,26,46,0.10)',
    '0 6px 16px rgba(26,26,46,0.12)',
    '0 8px 24px rgba(26,26,46,0.14)',
    '0 12px 32px rgba(26,26,46,0.16)',
    '0 16px 40px rgba(26,26,46,0.18)',
    '0 20px 48px rgba(26,26,46,0.20)',
    '0 24px 56px rgba(26,26,46,0.22)',
    '0 28px 64px rgba(26,26,46,0.24)',
    '0 32px 72px rgba(26,26,46,0.26)',
    '0 36px 80px rgba(26,26,46,0.28)',
    '0 40px 88px rgba(26,26,46,0.30)',
    '0 44px 96px rgba(26,26,46,0.32)',
    '0 48px 104px rgba(26,26,46,0.34)',
    '0 52px 112px rgba(26,26,46,0.36)',
    '0 56px 120px rgba(26,26,46,0.38)',
    '0 60px 128px rgba(26,26,46,0.40)',
    '0 64px 136px rgba(26,26,46,0.42)',
    '0 68px 144px rgba(26,26,46,0.44)',
    '0 72px 152px rgba(26,26,46,0.46)',
    '0 76px 160px rgba(26,26,46,0.48)',
    '0 80px 168px rgba(26,26,46,0.50)',
    '0 84px 176px rgba(26,26,46,0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 22px',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)',
          boxShadow: '0 4px 14px rgba(26,26,46,0.30)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(26,26,46,0.40)',
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #e8673a 0%, #f08860 100%)',
          boxShadow: '0 4px 14px rgba(232,103,58,0.30)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(232,103,58,0.40)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid',
          borderColor: '#e8e8f0',
          boxShadow: '0 2px 8px rgba(26,26,46,0.06)',
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1a1a2e',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1a1a2e',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#6b6b8a',
            fontWeight: 500,
            borderBottom: '2px solid #e8e8f0',
          },
        },
      },
    },
  },
});

export default theme;
