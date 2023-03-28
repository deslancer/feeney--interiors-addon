import { CubeTexture, Scene } from "babylonjs";

export function useSkybox(scene: Scene){
    scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(
        'assets/textures/royal_esplanade.env',
        scene,
    );
}