// src/theme.ts
'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1d4ed8', // A nice Tailwind blue-700
    },
  },
});

export default theme;