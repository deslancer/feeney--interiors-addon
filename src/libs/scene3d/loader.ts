import {Scene, SceneLoader, TransformNode, Vector3} from 'babylonjs';
import 'babylonjs-loaders';
import {useFeeneyStore} from '../store/store';

export async function loadInteriorModel(scene: Scene, url: string) {
    const setProgress = useFeeneyStore.getState().setProgress;

    if (url) {
        return await SceneLoader.ImportMeshAsync(
            undefined,
            url,
            undefined,
            scene,
            (progress) => {
                const loaded = progress.loaded;
                const total = progress.total;

                if (total !== 0) {
                    const percent = (loaded * 100) / total;
                    const percentFixed = +percent.toFixed(2);
                    console.log(percentFixed)
                    setProgress(percentFixed);
                }
            }
        ).then((result) => {
            const allMeshes = result.meshes.find(
                (child) => child.name === '__root__'
            ) as TransformNode;
            if (allMeshes) {
                allMeshes.name = 'InteriorGroup';
                allMeshes.rotate(new Vector3(0, 1, 0), Math.PI);
            }
        });
    } else {
        throw new Error("URL for loading main scene wasn't provided");
    }
}
