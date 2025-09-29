import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', 
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f4f6f8', 
      paper: '#ffffff',   
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', 
    },
    secondary: {
      main: '#f48fb1', 
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',   
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0b0b0',
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});