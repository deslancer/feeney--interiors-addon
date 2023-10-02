import {useEngine} from './engine';
import {AppScene} from './scene';
import {setLandscape, useReflectionTexture, useSkybox} from './environment';
import {useFeeneyStore} from '../store/store';
import {loadInteriorModel} from './loader';
import {setupColliders} from './setupColliders';
import {useArcRotateCamera, useFirstPersonCamera, useOrthoCamera,} from './cameras';
import {useHemiLight} from './lights';

/**
 * The createApp3D function creates a 3D scene, camera and light.
 * It also adds the BabylonJS inspector to the window object, so you can inspect your scene in the browser console.
 *
 *
 * @return scene

 * @param canvas
 * @param url
 */
export const createApp3D = async (canvas: HTMLCanvasElement, url: string) => {
    const {setIsLoading, sceneMetaData} = useFeeneyStore.getState();

    const engine = useEngine(canvas);
    const appScene = new AppScene();
    appScene.create(engine);
    const scene = appScene.scene;

    if (scene) {
        scene.activeCamera = useArcRotateCamera(canvas, scene);
        useOrthoCamera(canvas, scene);
        useFirstPersonCamera(canvas, scene);
        useHemiLight(scene);
        useReflectionTexture(scene);
        useSkybox(scene);

        loadInteriorModel(scene, url)
            .then(() => {
                setupColliders(scene);
                setIsLoading(false);
                setLandscape(scene);
                //scene.activeCamera = useFirstPersonCamera(canvas, scene);
            })
            .then(() => {
                const assetsUrl = sceneMetaData.assetsUrl
                if (assetsUrl) {
                    loadInteriorModel(scene, assetsUrl).then(() => {
                        setupColliders(scene);
                    })
                }

            });
        engine.runRenderLoop(() => {
            scene.render();
        });

        return scene;
    }
};
