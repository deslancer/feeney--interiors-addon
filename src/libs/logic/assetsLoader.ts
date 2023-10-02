import { useFeeneyStore } from '../store/store';
import {
  AbstractAssetTask,
  AssetsManager,
  MeshAssetTask,
  Scene,
} from 'babylonjs';
import { AppAssetsData, AppData, AssetType, ProductEntity } from '../../types';
import * as R from 'ramda';
import 'babylonjs-loaders';
import { Singleton } from '../../decorators/singleton';

@Singleton
export class AssetsLoader {
  private readonly scene: Scene | undefined;
  private readonly appData: AppData[] | null;
  private assetsManager: AssetsManager;

  constructor() {
    const { scene, appData, setIsRailingBuilding } = useFeeneyStore.getState();
    this.appData = appData;
    this.scene = scene;
    this.assetsManager = new AssetsManager(scene);
    this.assetsManager.useDefaultLoadingScreen = false;
    this.assetsManager.onFinish = function (tasks) {
      setIsRailingBuilding(false);
    };
  }

  addModelToLoader(entity: ProductEntity): MeshAssetTask | undefined {
    if (entity && this.appData) {
      const modelName = entity.modelObj.split('.')[0];
      const filterAssets = R.compose(
        R.pluck('assetsUrls'),
        R.filter(
          R.where({
            name: R.equals('Feeney_Models'),
          })
        )
      );
      const assets: Array<AppAssetsData> = this.appData[0].assets;
      const assetsUrls: Array<AssetType> = JSON.parse(
        filterAssets(assets)[0] as string
      );

      const asset: AssetType | undefined = assetsUrls.find((asset) =>
        asset.url.includes(modelName)
      );

      if (asset) {
        const rootUrl = asset.url.replace(asset.name.split('/')[2], '');
        const name = asset.name.split('/')[2];
        return this.assetsManager.addMeshTask(
          `${name} task`,
          '',
          rootUrl,
          name
        );
      }
    }
  }

  removeFromLoader(task: AbstractAssetTask) {
    this.assetsManager.removeTask(task);
    console.log('Task has been removed');
  }

  loadAllTasks() {
    this.assetsManager.load();
  }
}
