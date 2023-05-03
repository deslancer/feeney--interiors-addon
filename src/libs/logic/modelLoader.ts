import { SceneLoader, Node } from "babylonjs";
import { useFeeneyStore } from "../store/store";
import 'babylonjs-loaders';
import { ProductEntity } from "../../types/ProductEntity";
import * as R from 'ramda'
import { ProjectAssets } from "../../types/ProjectAssets";

type AssetType = {
    name: string
    size: number
    status: string
    type: string
    url: string
}
export async function loadModel(entity: ProductEntity){
    const { scene, project } = useFeeneyStore.getState();

    if (entity && scene && project){
        const modelName = entity.modelObj.split('.')[0]
        const filterAssets = R.compose(
            R.pluck('assetsUrls'),
            R.filter(R.where({
                name: R.equals('Feeney_Models'),
            }))
        )
        const assets: Array<ProjectAssets> = project[0].assets;
        const assetsUrls: Array<AssetType> = JSON.parse(filterAssets(assets)[0] as string);
        const asset: AssetType | undefined = assetsUrls.find(asset => asset.url.includes(modelName))
        if (asset){
            await SceneLoader.AppendAsync(
                asset.url,
                undefined,
                scene, (progress) => {
                    const loaded = progress.loaded;
                    const total = progress.total;

                    if (total !== 0) {
                        const percent = (loaded * 100) / total;
                    }
                }
            )
        }

    }
}