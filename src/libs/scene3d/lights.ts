import { HemisphericLight, Scene, Vector3 } from 'babylonjs';

export function useHemiLight(scene: Scene) {
  const light = new HemisphericLight(
    'HemiLight',
    new Vector3(0, 1, -15),
    scene
  );
  light.intensity = 0.5;

  return light;
}
