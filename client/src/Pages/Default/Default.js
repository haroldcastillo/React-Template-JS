import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useThemeContext } from '../../Config/ThemeProvider';

export default function Default() {
  // const { toggleTheme } = useThemeContext();
  const { toggleTheme } = useThemeContext();
  return (
    <Paper variant="elevation" elevation={3}>
      <Typography variant="body1" color="primary">Title</Typography>
      <Typography variant="body1" color="initial">Hello Code Sandbox</Typography>
      <Button variant="text" onClick={toggleTheme} color="primary">
        Change Theme Mode
      </Button>
    </Paper>
  );
}
