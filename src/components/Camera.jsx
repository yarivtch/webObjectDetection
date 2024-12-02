import React, { useEffect, useRef, useState } from 'react';
import { ObjectDetectionService } from '../services/objectDetection';

const Camera = ({ targetObject, onDetection }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const detectionRef = useRef(null);
  const [isObjectDetected, setIsObjectDetected] = useState(false);
  const [continuousDetectionTime, setContinuousDetectionTime] = useState(0);
  const lastDetectionTime = useRef(0);
  
  const REQUIRED_SECONDS = 3; // זמן נדרש בשניות
  const CONFIDENCE_THRESHOLD = 0.7; // סף ביטחון

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          videoRef.current.onloadedmetadata = () => {
            if (canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          };
        }

        const detectionService = new ObjectDetectionService();
        await detectionService.initialize();
        setDetector(detectionService);
        console.log('מודל הזיהוי אותחל בהצלחה');

      } catch (error) {
        console.error('שגיאה באתחול המצלמה:', error);
        alert('לא הצלחנו לגשת למצלמה. אנא ודא שנתת הרשאות מתאימות.');
      }
    };
    
    setupCamera();
    
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const detectFrame = async () => {
      if (!detector || !videoRef.current || !canvasRef.current) return;
      
      if (targetObject && videoRef.current.readyState === 4) {
        const predictions = await detector.detectObjects(videoRef.current);
        drawPredictions(predictions);
      } else {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
      
      detectionRef.current = requestAnimationFrame(detectFrame);
    };

    if (targetObject) {
      console.log('מתחיל חיפוש עבור:', targetObject);
      detectFrame();
    } else {
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
      }
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    return () => {
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
      }
    };
  }, [detector, targetObject]);

  const drawPredictions = (predictions) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    let targetFound = false;

    predictions.forEach(prediction => {
      const isTarget = prediction.class.toLowerCase() === targetObject?.toLowerCase();
      
      if (isTarget && prediction.score > CONFIDENCE_THRESHOLD) {
        targetFound = true;
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 4;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        
        // עדכון זמן הזיהוי הרציף
        const currentTime = Date.now();
        if (currentTime - lastDetectionTime.current < 1100) { // מרווח קצת יותר מ-1 שנייה
          setContinuousDetectionTime(prev => {
            const newTime = prev + (currentTime - lastDetectionTime.current) / 1000;
            if (newTime >= REQUIRED_SECONDS && !isObjectDetected) {
              setIsObjectDetected(true);
              onDetection(prediction);
            }
            return newTime;
          });
        } else {
          setContinuousDetectionTime(0); // איפוס אם היה פער בזיהוי
        }
        lastDetectionTime.current = currentTime;
        
      } else {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      }
      
      // ציור הריבוע
      ctx.beginPath();
      ctx.rect(
        prediction.bbox[0],
        prediction.bbox[1],
        prediction.bbox[2],
        prediction.bbox[3]
      );
      ctx.fill();
      ctx.stroke();
      
      // הצגת טקסט עם זמן הזיהוי הרציף
      ctx.fillStyle = isTarget ? '#00FF00' : '#FF0000';
      ctx.font = '18px Arial';
      let text = `${prediction.class} ${Math.round(prediction.score * 100)}%`;
      if (isTarget && !isObjectDetected) {
        text += ` (${Math.min(REQUIRED_SECONDS, Math.round(continuousDetectionTime))}/${REQUIRED_SECONDS}s)`;
      }
      ctx.fillText(
        text,
        prediction.bbox[0],
        prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
      );
    });

    // אם לא נמצא האובייקט המבוקש, מאפסים את הזמן
    if (!targetFound && !isObjectDetected) {
      setContinuousDetectionTime(0);
    }
  };

  // איפוס בעת החלפת אובייקט לחיפוש
  useEffect(() => {
    setIsObjectDetected(false);
    setContinuousDetectionTime(0);
    lastDetectionTime.current = 0;
  }, [targetObject]);

  return (
    <div className="camera-container">
      <video 
        ref={videoRef}
        autoPlay
        playsInline
        muted
      />
      <canvas 
        ref={canvasRef}
        className="detection-canvas"
      />
      {!isObjectDetected && continuousDetectionTime > 0 && (
        <div className="detection-progress">
          מזהה... {Math.min(REQUIRED_SECONDS, Math.round(continuousDetectionTime))}/{REQUIRED_SECONDS} שניות
        </div>
      )}
    </div>
  );
};

export default Camera; 