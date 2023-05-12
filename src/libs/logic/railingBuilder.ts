import { ProductEntity } from "../../types/ProductEntity";
import { Products } from "./products";
import { AssetsLoader } from "./assetsLoader";
import { MeshAssetTask } from "babylonjs";
import { PostsBuilder } from "./postsBuilder";
import { PositionsCalc } from "./positionsCalc";

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
    private positionsCalc: PositionsCalc = PositionsCalc.instance
    private postsBuilder: PostsBuilder = PostsBuilder.instance;
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
            const intermediatePostEntity = await this.productsStorage.getIntermediatePost();
            const cornerPostEntity = await this.productsStorage.getCornerPost();
            const baseRailEntity = await this.productsStorage.getBaseRail();

            this.railingTasks.intermediatePost = await this.addRailingComponentTask(intermediatePostEntity, 'intermediatePost');
            this.railingTasks.cornerPost = await this.addRailingComponentTask(cornerPostEntity, 'cornerPost');
            this.railingTasks.baseRail = await  this.addRailingComponentTask(baseRailEntity, 'baseRail')
            console.log(await this.addRailingComponentTask(baseRailEntity, 'baseRail'))
            this.positionsCalc.calcForPosts(intermediatePostEntity);

            const postsPositions = this.positionsCalc.getPostsPositions;
            this.positionsCalc.calcForBaseRail()
            this.postsBuilder.build(this.railingTasks.intermediatePost,this.railingTasks.cornerPost, postsPositions)
            await this.assetsLoader.loadAllTasks()
            this.isBuilt = true;

        }
    }

    private async addRailingComponentTask(modelEntity: ProductEntity, componentType: string): Promise<MeshAssetTask | undefined> {
        return this.assetsLoader.addModelToLoader(modelEntity);
    }
}