import {Scene, ArcRotateCamera,FreeCamera, Vector3} from 'babylonjs';
export function useArcRotateCamera(canvas :HTMLCanvasElement, scene: Scene, mode: string = "perspective") {
    const camera = new ArcRotateCamera(
        'arcRotateCamera',
        1.13,
        Math.PI / 2.3,
        6,
        new Vector3(0, 0, 0),
        scene,
    );
    if (mode === "perspective"){

        camera.lowerRadiusLimit = 10;
        camera.upperRadiusLimit = 500;
        camera.attachControl(canvas, false);

    }
    else if (mode === "orthographic"){

        camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        const distance = 250;
        const canvasClientRect = scene.getEngine().getRenderingCanvasClientRect()
        if (canvasClientRect){
            const aspect = canvasClientRect.height / canvasClientRect.width;
            camera.orthoLeft = -distance/ 2;
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

    }

    return camera;
}

export function useFirstPersonCamera(canvas: HTMLCanvasElement, scene: Scene){
    const camera = new FreeCamera("FPSCamera", new Vector3(0, 7, 0), scene);
    camera.rotation.y = Math.PI;
    camera.attachControl(canvas, true);
    camera.keysUp = [87, 38];
    camera.keysDown = [83, 40];
    camera.keysLeft = [65, 37];
    camera.keysRight = [68, 39];
    camera.inertia = 0.7;
    camera.fov = 1.0;
    camera.minZ = 0;
    camera.angularSensibility = 500;
    camera.speed = 1.5;
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = new Vector3(0.5, 2.5, 0.5);
    (<any>camera)._needMoveForGravity = true;


    return camera
}