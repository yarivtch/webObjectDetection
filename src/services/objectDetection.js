import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';

export class ObjectDetectionService {
  constructor() {
    this.model = null;
  }

  async initialize() {
    if (!this.model) {
      this.model = await cocossd.load();
    }
  }

  async detectObjects(video) {
    if (!this.model) throw new Error('המודל לא אותחל');
    
    try {
      return await this.model.detect(video);
    } catch (error) {
      console.error('שגיאה בזיהוי:', error);
      return [];
    }
  }
} 