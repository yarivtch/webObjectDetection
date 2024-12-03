import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Camera from './components/Camera';
import DetectionSettings from './components/DetectionSettings';
import Timer from './components/Timer';
import Feedback from './components/Feedback';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3', // כחול בהיר
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#34495e',
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

function App() {
  const [targetObject, setTargetObject] = useState('');
  const [timeout, setTimeout] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isDetected, setIsDetected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleStart = () => {
    if (targetObject) {
      setIsActive(true);
      setTimeLeft(timeout);
      setIsDetected(false);
      
      // התחל את הטיימר
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(timeout);
    setIsDetected(false);
    setTargetObject('');
  };

  const handleDetection = (prediction) => {
    if (isActive && !isDetected) {
      setIsDetected(true);
      setIsActive(false); // עצור את החיפוש כשנמצא האובייקט
    }
  };

  useEffect(() => {
    // כשמתחילים זיהוי, נמזער את התפריט
    if (isActive) {
      setIsMinimized(true);
    }
  }, [isActive]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Camera 
          targetObject={isActive ? targetObject : null}
          onDetection={handleDetection}
        />
        
        <DetectionSettings
          targetObject={targetObject}
          onObjectChange={setTargetObject}
          timeout={timeout}
          onTimeoutChange={setTimeout}
          onStart={handleStart}
          onReset={handleReset}
          disabled={isActive}
          isMinimized={isMinimized}
          setIsMinimized={setIsMinimized}
        />

        {(isActive || isDetected) && (
          <>
            <Timer timeLeft={timeLeft} />
            <Feedback isDetected={isDetected} />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App; 