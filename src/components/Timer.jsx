import React from 'react';
import { Paper, Typography } from '@mui/material';

const Timer = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Paper className="timer">
      <Typography variant="h6">
        זמן נותר: {minutes}:{seconds.toString().padStart(2, '0')}
      </Typography>
    </Paper>
  );
};

export default Timer; 