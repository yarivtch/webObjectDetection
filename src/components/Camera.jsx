import React, { useEffect, useRef, useState } from 'react';
import { ObjectDetectionService } from '../services/objectDetection';

const Camera = ({ targetObject, onDetection }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [detectionStartTime, setDetectionStartTime] = useState(null);
  const [detectionCompleted, setDetectionCompleted] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const detectionInterval = useRef(null);
  const failureSound = useRef(new Audio('/sounds/failure.mp3'));

  const REQUIRED_SECONDS = 3; // זמן אימות קבוע של 3 שניות
  const CONFIDENCE_THRESHOLD = 0.6;

  const SUPPORTED_OBJECTS = [
    'bottle', 'cup', 'wine glass', 'cell phone', 'book', 'chair', 
    'laptop', 'mouse', 'keyboard', 'remote', 'clock', 'vase',
    'scissors', 'teddy bear', 'toothbrush', 'spoon', 'fork', 'knife',
    'bowl', 'banana', 'apple', 'sandwich', 'orange', 'pen'
  ];

  const playFailureSound = () => {
    failureSound.current.currentTime = 0;
    failureSound.current.play().catch(err => console.log('Audio play failed:', err));
  };

  const captureScreenshot = (prediction) => {
    if (!videoRef.current || !canvasRef.current) return null;

    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    const padding = 20;
    tempCanvas.width = prediction.bbox[2] + (padding * 2);
    tempCanvas.height = prediction.bbox[3] + (padding * 2);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    ctx.drawImage(
      videoRef.current,
      prediction.bbox[0] - padding,
      prediction.bbox[1] - padding,
      prediction.bbox[2] + (padding * 2),
      prediction.bbox[3] + (padding * 2),
      0, 0,
      tempCanvas.width,
      tempCanvas.height
    );

    return tempCanvas.toDataURL('image/png');
  };

  const drawPredictions = (predictions) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    let targetFound = false;

    predictions.forEach(prediction => {
      const isTarget = prediction.class.toLowerCase() === targetObject?.toLowerCase();

      if (detectionCompleted && !isTarget) return;

      if (isTarget && prediction.score > CONFIDENCE_THRESHOLD) {
        targetFound = true;

        if (!detectionStartTime && !detectionCompleted) {
          setDetectionStartTime(Date.now());
        }

        const elapsed = (Date.now() - detectionStartTime) / 1000;

        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;
        ctx.strokeRect(
          prediction.bbox[0],
          prediction.bbox[1],
          prediction.bbox[2],
          prediction.bbox[3]
        );

        if (elapsed >= REQUIRED_SECONDS && !detectionCompleted) {
          setDetectionCompleted(true);

          const screenshot = captureScreenshot(prediction);
          setCapturedImage(screenshot);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(
            prediction.bbox[0],
            prediction.bbox[1] - 40,
            prediction.bbox[2],
            40
          );

          ctx.fillStyle = '#00FF00';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(
            'זיהוי הושלם!',
            prediction.bbox[0] + prediction.bbox[2] / 2,
            prediction.bbox[1] - 15
          );

          onDetection({ ...prediction, screenshot });
        }
      } else if (!detectionCompleted) {
        if (SUPPORTED_OBJECTS.includes(prediction.class.toLowerCase())) {
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            prediction.bbox[0],
            prediction.bbox[1],
            prediction.bbox[2],
            prediction.bbox[3]
          );

          playFailureSound();
        }
      }
    });

    if (!targetFound && !detectionCompleted) {
      setDetectionStartTime(null);
    }
  };

  useEffect(() => {
    let isModelLoading = false;

    const loadModel = async () => {
      if (isModelLoading) return;

      try {
        isModelLoading = true;
        console.log('Loading object detection model...');
        const model = await ObjectDetectionService.loadModel();
        console.log('Model loaded successfully');
        setDetector(model);
      } catch (error) {
        console.error('Failed to load model:', error);
      } finally {
        isModelLoading = false;
      }
    };

    loadModel();

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = () => {
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          };
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();
  }, []);

  useEffect(() => {
    if (!detector || !targetObject) return;

    const detectObjects = async () => {
      if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== 4) return;

      try {
        const predictions = await detector.detect(videoRef.current);
        drawPredictions(predictions);
      } catch (error) {
        console.error('Detection error:', error);
      }
    };

    detectionInterval.current = setInterval(detectObjects, 100);

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, [detector, targetObject]);

  return (
    <div className="camera-container">
      <video 
        ref={videoRef}
        className="camera-video"
        autoPlay
        playsInline
        muted
      />
      <canvas 
        ref={canvasRef}
        className="camera-canvas"
      />
      {capturedImage && detectionCompleted && (
        <div className="captured-image-container">
          <img 
            src={capturedImage} 
            alt="Detected Object"
            className="captured-image"
          />
        </div>
      )}
    </div>
  );
};

export default Camera;