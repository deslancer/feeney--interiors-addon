import { Scene, Color4, Engine, Vector3 } from "babylonjs";

export function useScene(engine: Engine) {
    const scene = new Scene(engine);
    scene.clearColor = new Color4(1.0, 1.0, 1.0, 1);
    scene.gravity = new Vector3(0, -0.982, 0);
    scene.collisionsEnabled = true;
    return scene
}