import { useEngine } from "./engine";
import { useScene } from "./scene";
import { useArcRotateCamera, useFirstPersonCamera } from "./cameras";
import { useHemiLight } from "./lights";
import { useSkybox } from "./environment";
import { useFeeneyStore } from "../store/store";
import { loadInteriorModel } from "./loader";
import { setupMaterials } from "./setupMaterials";
import { setupColliders } from "./setupColliders";

export const createApp3D = (canvas: HTMLCanvasElement, url: string) => {
    const setIsLoading = useFeeneyStore.getState().setIsLoading;

    const engine = useEngine(canvas)
    const scene = useScene(engine);

    useArcRotateCamera(canvas, scene, "perspective");
    scene.activeCamera =  useFirstPersonCamera(canvas, scene);

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