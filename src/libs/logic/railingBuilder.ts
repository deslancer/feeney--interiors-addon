import { ProductEntity } from "../../types/ProductEntity";
import { Products } from "./products";
import { AssetsLoader } from "./assetsLoader";
import { MeshAssetTask } from "babylonjs";
import { PostsBuilder } from "./postsBuilder";

export class RailingBuilder {
    private static _instance: RailingBuilder;
    /**
     * The instance function is a property getter that creates and caches a singleton instance of the class.
     *
     * @return The singleton instance of the class
     *
     */
    public static get instance(): RailingBuilder {
        if (this._instance == null) {
            this._instance = new RailingBuilder();
        }
        return this._instance;
    }

    private productsStorage: Products = new Products();
    private assetsLoader: AssetsLoader = AssetsLoader.instance;
    private postsBuilder: PostsBuilder = new PostsBuilder();
    private railingTasks: Record<string, MeshAssetTask | undefined> = {
        intermediatePost: undefined,
        intermediatePostForStairs: undefined,
        intermediateAngledPost: undefined,
        cornerPost: undefined,
        cornerPostForStairs: undefined,
        vertCable: undefined,
        vertCableForStairs: undefined,
        glass: undefined,
        laserCut: undefined,
        baseRail: undefined,
        verticalPicket: undefined,
        horizontalCableVerticalPicket: undefined,
        verticalPicketForStairs: undefined,
        horizontalCable: undefined,
        horizontalCableForStairs: undefined,
        postCapForCornerPost: undefined,
        postCapForIntermediatePost: undefined,
        stairGlass: undefined,
        singleHorizontalCable: undefined,
    }
    private isBuilt: boolean = false;

    constructor() {
    }

    async buildRailing() {
        if (!this.isBuilt) {
            const intermediatePostEntity = await this.productsStorage.getIntermediatePost()
            this.railingTasks.intermediatePost = await this.addRailingComponentTask(intermediatePostEntity, 'intermediatePost');
            this.postsBuilder.build(this.railingTasks.intermediatePost)
            await this.assetsLoader.loadAllTasks()
            this.isBuilt = true;
        }
    }

    private async addRailingComponentTask(modelEntity: ProductEntity, componentType: string): Promise<MeshAssetTask | undefined> {
        return this.assetsLoader.addModelToLoader(modelEntity);
    }
}