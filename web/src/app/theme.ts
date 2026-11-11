import { ptBR } from '@mui/material/locale';
import { alpha, createTheme } from '@mui/material/styles';

const BRAND_DARK = '#0B5653';
const TEXT_COLOR = '#231F20';

export const theme = createTheme(
  {
    cssVariables: true,
    palette: {
      primary: {
        main: '#11807C',
        light: '#3FCFCB',
        dark: BRAND_DARK,
        contrastText: '#FFFFFF',
      },
      text: {
        primary: TEXT_COLOR,
      },
      background: {
        default: '#F6F9F9',
        paper: '#FFFFFF',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: 'var(--font-sans)',
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: {
      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: `0 1px 2px ${alpha(TEXT_COLOR, 0.06)}, 0 8px 24px ${alpha(BRAND_DARK, 0.06)}`,
          },
        },
      },
    },
  },
  ptBR,
);
