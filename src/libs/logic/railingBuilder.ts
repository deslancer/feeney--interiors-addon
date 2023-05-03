import { ProductEntity } from "../../types/ProductEntity";
import { loadModel } from "./modelLoader";
import { Products } from "./products";

export class RailingBuilder {
    private productsStorage: Products = new Products();
    private railingComponents = {
        intermediatePost: null,
        intermediatePostForStairs: null,
        intermediateAngledPost: null,
        cornerPost: null,
        cornerPostForStairs: null,
        vertCable: null,
        vertCableForStairs: null,
        glass: null,
        laserCut: null,
        baseRail: null,
        verticalPicket: null,
        horizontalCableVerticalPicket: null,
        verticalPicketForStairs: null,
        horizontalCable: null,
        horizontalCableForStairs: null,
        postCapForCornerPost: null,
        postCapForIntermediatePost: null,
        stairGlass: null,
        singleHorizontalCable: null,

    }
    constructor() {
    }
    async buildRailing(){
        const intermediatePostEntity = await this.productsStorage.getIntermediatePost()
        await this.loadRailingComponent(intermediatePostEntity, 'intermediatePost')
    }
    private async loadRailingComponent(modelEntity: ProductEntity,componentType: string): Promise<any>{
        return await loadModel(modelEntity).then((object)=> {

        })
    }
}