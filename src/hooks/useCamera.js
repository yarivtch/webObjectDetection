import { useState, useEffect } from 'react';
import { ObjectDetectionService } from '../services/objectDetection';

export const useCamera = (targetObject, timeout) => {
  const [isDetected, setIsDetected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeout);
  
  useEffect(() => {
    setTimeLeft(timeout);
  }, [timeout]);
  
  useEffect(() => {
    if (timeout === 0) return;
    
    const detector = new ObjectDetectionService();
    let timer;
    let detectionInterval;
    
    const startDetection = async () => {
      await detector.initialize();
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            clearInterval(detectionInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      detectionInterval = setInterval(async () => {
        const video = document.querySelector('video');
        if (video && targetObject) {
          const result = await detector.detectObjects(video, targetObject);
          if (result) {
            setIsDetected(true);
            clearInterval(timer);
            clearInterval(detectionInterval);
          }
        }
      }, 500);
    };
    
    startDetection();
    
    return () => {
      clearInterval(timer);
      clearInterval(detectionInterval);
    };
  }, [timeout, targetObject]);
  
  return { isDetected, timeLeft };
}; 