import { HemisphericLight, Vector3, Scene } from "babylonjs";

export function useHemiLight(scene: Scene) {
    const light = new HemisphericLight(
        'HemiLight',
        new Vector3(0, 1, -15),
        scene,
    );
    light.intensity = 0.7;

    return light;
}