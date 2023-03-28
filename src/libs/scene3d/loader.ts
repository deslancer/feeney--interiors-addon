import { Scene, SceneLoader } from "babylonjs";
import 'babylonjs-loaders';
import { useFeeneyStore } from "../store/store";

export async function loadInteriorModel(scene: Scene, url: string) {
    const setProgress  = useFeeneyStore.getState().setProgress;

   /* if (url){
        return await SceneLoader.ImportMeshAsync(
            undefined,
            url,
            undefined,
            scene, (progress) => {
                const loaded = progress.loaded;
                const total = progress.total;

                if (total !== 0) {
                    const percent = (loaded * 100) / total;
                    setProgress(percent);
                }
            }
            );
    }else {
        throw ( new Error("URL for loading main scene wasn't provided") )
    }*/
    return await SceneLoader.ImportMeshAsync(
        undefined,
        './assets/',
        "feeney_interior.glb",
        scene, (progress) => {
            const loaded = progress.loaded;
            const total = progress.total;

            if (total !== 0) {
                const percent = (loaded * 100) / total;
                setProgress(percent);
            }
        }
    )
}