// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3F51B5', // Deep Blue
    },
    secondary: {
      main: '#FF4081', // Pink
    },
    background: {
      default: '#F5F5F5', // Light Grey
      paper: '#FFFFFF',   // White
    },
    text: {
      primary: '#212121', // Dark Grey
      secondary: '#757575', // Medium Grey
    },
    error: {
      main: '#D32F2F', // Red
    },
    warning: {
      main: '#F57C00', // Orange
    },
    info: {
      main: '#1976D2', // Blue
    },
    success: {
      main: '#388E3C', // Green
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(4px)',
        },
      },
    },
  },
});

export default theme;
