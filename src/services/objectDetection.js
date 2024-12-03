import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export class ObjectDetectionService {
  static async loadModel() {
    try {
      await tf.ready();
      
      const model = await cocoSsd.load({
        base: 'lite_mobilenet_v2',
        modelUrl: undefined,
      });
      
      console.log('Model loaded successfully');
      return model;
    } catch (error) {
      console.error('Error loading COCO-SSD model:', error);
      throw error;
    }
  }
} 