import { ptBR } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme(
  {
    cssVariables: true,
    palette: {
      primary: {
        main: '#11807C',
        light: '#3FCFCB',
        dark: '#0B5653',
        contrastText: '#FFFFFF',
      },
      text: {
        primary: '#231F20',
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
          variant: 'outlined',
        },
      },
    },
  },
  ptBR,
);
