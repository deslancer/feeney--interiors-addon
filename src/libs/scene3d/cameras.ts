import {ArcRotateCamera, FreeCamera, Scene, Vector3} from 'babylonjs';
import {useFeeneyStore} from '../store/store';
import {gsap} from "gsap";

export function useArcRotateCamera(canvas: HTMLCanvasElement, scene: Scene) {
    const camera = new ArcRotateCamera(
        'arcRotateCamera',
        1.13,
        Math.PI / 2.3,
        16,
        new Vector3(0, 0, 0),
        scene
    );

    camera.zoomToMouseLocation = true;
    camera.wheelDeltaPercentage = 0.01;
    camera.alpha = Math.PI;
    camera.beta = 0.685;
    camera.lowerRadiusLimit = 0.1;
    camera.upperRadiusLimit = 500;
    camera.minZ = 0.01;
    camera.attachControl(canvas, false);

    return camera;
}

export const useOrthoCamera = (canvas: HTMLCanvasElement, scene: Scene) => {
    const camera = new ArcRotateCamera(
        'orthoCamera',
        1.13,
        Math.PI / 2.3,
        16,
        new Vector3(0, 0, 0),
        scene
    );
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    const distance = 50;
    const canvasClientRect = scene.getEngine().getRenderingCanvasClientRect();
    if (canvasClientRect) {
        const aspect = canvasClientRect.height / canvasClientRect.width;
        camera.orthoLeft = -distance / 2;
        camera.orthoRight = distance / 2;
        camera.orthoBottom = camera.orthoLeft * aspect;
        camera.orthoTop = camera.orthoRight * aspect;
        camera.panningAxis = new Vector3(1, 1, 0);
        camera.alpha = 0;
        camera.beta = 0;
        camera.upperBetaLimit = Math.PI / 2;
        camera.wheelPrecision = 0.1;
        camera.panningSensibility = 1;
        camera.inertia = 0.1;
        camera.panningInertia = 0.2;
        camera.angularSensibilityX = 500;
        camera.angularSensibilityY = 500;
    }
    return camera;
};

export function useFirstPersonCamera(canvas: HTMLCanvasElement, scene: Scene) {
    const {sceneMetaData} = useFeeneyStore.getState();
    const cameraPositions = sceneMetaData.cameraPositions;
    const camera = new FreeCamera(
        'FPSCamera',
        Vector3.FromArray(cameraPositions[0].position),
        scene
    );
    camera.target = Vector3.FromArray(cameraPositions[0].target);
    camera.attachControl(canvas, true);
    camera.keysUp = [87, 38];
    camera.keysDown = [83, 40];
    camera.keysLeft = [65, 37];
    camera.keysRight = [68, 39];
    camera.inertia = 0.8;
    camera.fov = 0.8;
    camera.minZ = 0;
    camera.angularSensibility = 800;
    camera.speed = 0.2;
    camera.checkCollisions = true;
    //camera.applyGravity = true;
    camera.ellipsoid = new Vector3(0.5, 1, 0.5);
    (<any>camera)._needMoveForGravity = true;
    camera.storeState();
    if (camera.position.y < 5) {
        respawnCamera();
    }
    return camera;
}

export function respawnCamera() {
    const scene = useFeeneyStore.getState().scene;
    if (scene) {
        const camera = scene.activeCamera;
        if (camera) {
            //camera.position = new Vector3(-5, 5, -7);
            camera.restoreState();
        }
    }
}

export function changeCameraPosition(index: number) {
    const {sceneMetaData, scene} = useFeeneyStore.getState();
    const cameraPositions = sceneMetaData.cameraPositions;
    if (scene) {
        const camera = scene.activeCamera as FreeCamera;
        if (camera) {
            const pos = Vector3.FromArray(cameraPositions[index].position);
            const target = Vector3.FromArray(cameraPositions[index].target);
            gsap.to(camera.position, {x: pos.x, y: pos.y, z: pos.z})
            gsap.to(camera.target, {x: target.x, y: target.y, z: target.z})

        }
    }
}
