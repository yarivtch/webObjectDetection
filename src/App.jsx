import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Camera from './components/Camera';
import DetectionSettings from './components/DetectionSettings';
import Timer from './components/Timer';
import Feedback from './components/Feedback';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [targetObject, setTargetObject] = useState('');
  const [timeout, setTimeout] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isDetected, setIsDetected] = useState(false);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Camera 
          targetObject={isActive ? targetObject : null}
          onDetection={handleDetection}
        />
        
        <div className="controls">
          <DetectionSettings
            targetObject={targetObject}
            onObjectChange={setTargetObject}
            timeout={timeout}
            onTimeoutChange={setTimeout}
            onStart={handleStart}
            onReset={handleReset}
            disabled={isActive}
          />
        </div>

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