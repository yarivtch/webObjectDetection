export const initCamera = async () => {
  const constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 1920 },
      height: { ideal: 1080 }
    }
  };

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    throw new Error('לא ניתן לגשת למצלמה');
  }
};

export const toggleFlashlight = async (enable) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { torch: enable }
    });
    const track = stream.getVideoTracks()[0];
    await track.applyConstraints({
      advanced: [{ torch: enable }]
    });
  } catch (error) {
    console.error('שגיאה בהפעלת הפנס:', error);
  }
}; 