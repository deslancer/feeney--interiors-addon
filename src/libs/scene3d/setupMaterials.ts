import { Scene } from "babylonjs";

export function setupMaterials(scene: Scene) {
    const colliderMaterial = scene.getMaterialByName("collider");
    if (colliderMaterial) colliderMaterial.alpha = 0.0
}