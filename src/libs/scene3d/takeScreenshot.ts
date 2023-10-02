import { useFeeneyStore } from '../store/store';
import { Tools } from 'babylonjs';

export const takeScreenshot = () => {
  const scene = useFeeneyStore.getState().scene;
  if (scene) {
    const engine = scene.getEngine();
    const camera = scene.activeCamera;
    if (engine && camera) {
      Tools.CreateScreenshot(
        engine,
        camera,
        { width: 1920, height: 1080 },
        (data) => {
          const a = document.createElement('a');
          a.href = data;
          a.download = 'Screenshot.png'; //File name Here
          a.click();
          a.remove();
        }
      );
    }
  }
};
