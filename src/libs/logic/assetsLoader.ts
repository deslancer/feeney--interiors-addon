import { useFeeneyStore } from "../store/store";
import { AbstractAssetTask, AssetsManager, MeshAssetTask, Scene } from "babylonjs";
import { Project } from "../../types/Project";
import { ProductEntity } from "../../types/ProductEntity";
import * as R from "ramda";
import { ProjectAssets } from "../../types/ProjectAssets";
import { AssetType } from "../../types/Asset";
import 'babylonjs-loaders';

export class AssetsLoader {
    private readonly scene: Scene | undefined;
    private readonly project: Project[] | null;
    private assetsManager: AssetsManager;
    private static _instance: AssetsLoader;
    public static get instance(): AssetsLoader {
        if (this._instance == null) {
            this._instance = new AssetsLoader();
        }
        return this._instance;
    }
    constructor() {
        const { scene, project } = useFeeneyStore.getState();
        this.project = project
        this.scene = scene;
        this.assetsManager = new AssetsManager(this.scene);
        this.assetsManager.useDefaultLoadingScreen = false;
    }

    addModelToLoader(entity: ProductEntity): MeshAssetTask | undefined {
        if (entity && this.project) {
            const modelName = entity.modelObj.split('.')[0]
            const filterAssets = R.compose(
                R.pluck('assetsUrls'),
                R.filter(R.where({
                    name: R.equals('Feeney_Models'),
                }))
            )
            const assets: Array<ProjectAssets> = this.project[0].assets;
            const assetsUrls: Array<AssetType> = JSON.parse(filterAssets(assets)[0] as string);

            const asset: AssetType | undefined = assetsUrls.find(asset => asset.url.includes(modelName))

            if (asset) {
                const rootUrl = asset.url.replace(asset.name.split('/')[2], '');
                const name = asset.name.split('/')[2]
                return this.assetsManager.addMeshTask(`${name} task`, "", rootUrl, name)
            }
        }
    }

    removeFromLoader(task: AbstractAssetTask) {
        this.assetsManager.removeTask(task)
        console.log('Task has been removed')
    }

    async loadAllTasks() {
        await this.assetsManager.loadAsync()
    }
}