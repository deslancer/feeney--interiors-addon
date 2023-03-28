import {Scene} from "babylonjs";
import { Mesh } from "babylonjs/Meshes/mesh";

export function setupColliders(scene: Scene) {
    const colliders = scene.getNodeByName('Colliders')?.getChildren() as Array<Mesh>;
    colliders?.map((mesh)=>{
        mesh.checkCollisions = true;
    })
}