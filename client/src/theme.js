import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#25A691',
      light: '#54BDB1',
      dark: '#148576',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2481A6',
      light: '#509EBD',
      dark: '#136485',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#B53339',
      light: '#CC5757',
      dark: '#8C2028',
    },
    warning: {
      main: '#B87A33',
      light: '#CC9854',
      dark: '#8C5A20',
    },
    success: {
      main: '#2EA65A',
      light: '#54BD79',
      dark: '#1A8542',
    },
    info: {
      main: '#3169A8',
      light: '#5487CC',
      dark: '#1D4F85',
    },
    text: {
      primary: '#212828',
      secondary: '#728180',
      disabled: '#AABCBA',
    },
    background: {
      default: '#F5FAFA',
      paper: '#FFFFFF',
    },
    divider: '#E0EBEA',
  },

  typography: {
    fontFamily: '"Outfit", sans-serif',
    h1: { fontFamily: '"Nunito", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Nunito", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Nunito", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Nunito", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Nunito", sans-serif', fontWeight: 500 },
    h6: { fontFamily: '"Nunito", sans-serif', fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
})

export default theme