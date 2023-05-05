import { useEngine } from "./engine";
import { useScene } from "./scene";
import { useArcRotateCamera, useFirstPersonCamera } from "./cameras";
import { useHemiLight } from "./lights";
import { useSkybox } from "./environment";
import { useFeeneyStore } from "../store/store";
import { loadInteriorModel } from "./loader";
import { setupMaterials } from "./setupMaterials";
import { setupColliders } from "./setupColliders";

/**
 * The createApp3D function creates a 3D scene, camera and light.
 * It also adds the BabylonJS inspector to the window object so you can inspect your scene in the browser console.
 *
 * @param canvas: HTMLCanvasElement Pass in the canvas element from the dom
 * @param url: string Pass in the url of the model to be loaded
 *
 * @return A scene

 */
export const createApp3D = async (canvas: HTMLCanvasElement, url: string) => {
    const setIsLoading = useFeeneyStore.getState().setIsLoading;

    const engine = useEngine(canvas)
    const scene = useScene(engine);

    useArcRotateCamera(canvas, scene, "perspective");
    //scene.activeCamera =  useFirstPersonCamera(canvas, scene);
    scene.activeCamera = useArcRotateCamera(canvas, scene, "perspective");

    useHemiLight(scene)
    useSkybox(scene);
    /*loadInteriorModel(scene, url).then(()=> {
        setupMaterials(scene);
        setupColliders(scene)
    })*/
    engine.runRenderLoop(() => {
        scene.render();
    });
    return scene;
};