import React, { useState, useEffect } from 'react';
import Camera from './Camera';
import DetectionSettings from './DetectionSettings';
import Timer from './Timer';
import Feedback from './Feedback';

function MainApp() {
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
  );
}

export default MainApp;
