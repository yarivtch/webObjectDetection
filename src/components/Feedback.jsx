import React, { useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';

const Feedback = ({ isDetected }) => {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (isDetected) {
      setOpen(true);
      // הפעלת צליל בעת זיהוי
      const audio = new Audio('/success.mp3');
      audio.play().catch(console.error);
    }
  }, [isDetected]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        severity="success" 
        variant="filled"
        onClose={() => setOpen(false)}
      >
        האובייקט זוהה בהצלחה!
      </Alert>
    </Snackbar>
  );
};

export default Feedback; 