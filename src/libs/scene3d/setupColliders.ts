import {Scene} from 'babylonjs';
import {Mesh} from 'babylonjs/Meshes/mesh';

export function setupColliders(scene: Scene) {

    const colliders = scene.getNodes().filter(node => node.name.includes("Collider"))
    colliders?.map((node) => {
        const meshes = node.getChildren() as Mesh[]
        meshes.map(mesh => {
            mesh.checkCollisions = true;
            mesh.isVisible = false
        })
    });
}
