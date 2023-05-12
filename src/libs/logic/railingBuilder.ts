import { ProductEntity } from "../../types/ProductEntity";
import { Products } from "./products";
import { AssetsLoader } from "./assetsLoader";
import { MeshAssetTask } from "babylonjs";
import { PostsBuilder } from "./postsBuilder";
import { PositionsCalc } from "./positionsCalc";
import { RailingComponents } from "../../types/RailingComponents";

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
    private railingEntities: Record<string, ProductEntity > = {};
    private railingTasks: Record<string, MeshAssetTask | undefined> = {};
    private isBuilt: boolean = false;

    constructor() {
    }

    async buildRailing() {
        if (!this.isBuilt) {

            const intermediatePostEntity = await this.productsStorage.getIntermediatePost();
            const cornerPostEntity = await this.productsStorage.getCornerPost();
            const baseRailEntity = await this.productsStorage.getBaseRail();
            const handRailEntity = await this.productsStorage.getHandRail();




            this.positionsCalc.calcForPosts(intermediatePostEntity);

            const postsPositions = this.positionsCalc.getPostsPositions;
            this.positionsCalc.calcForBaseRail()
            this.postsBuilder.build(this.railingTasks.intermediatePost,this.railingTasks.cornerPost, postsPositions)
            await this.assetsLoader.loadAllTasks()
            this.isBuilt = true;

        }
    }

    private async addRailingComponentTask(modelEntity: ProductEntity, componentType: string) {
        this.railingTasks[componentType] =  this.assetsLoader.addModelToLoader(modelEntity);
    }
    private async addAllRailingTasks() {
        await this.addRailingComponentTask(this.railingEntities[RailingComponents.intermediatePost], 'intermediatePost');
        await this.addRailingComponentTask(this.railingEntities[RailingComponents.cornerPost], 'cornerPost');
        await this.addRailingComponentTask(this.railingEntities[RailingComponents.baseRail], 'baseRail')
        await this.addRailingComponentTask(this.railingEntities[RailingComponents.handRail], 'handRail')
    }
    private async addAllRailingEntities(){
        this.railingEntities[RailingComponents.intermediatePost] = await this.productsStorage.getIntermediatePost();
        this.railingEntities[RailingComponents.cornerPost] = await this.productsStorage.getCornerPost();
        this.railingEntities[RailingComponents.baseRail] = await this.productsStorage.getBaseRail();
        this.railingEntities[RailingComponents.handRail] = await this.productsStorage.getHandRail();
    }
}