import { useFeeneyStore } from "../store/store";
import { ProductEntity } from "../../types/ProductEntity";
import * as R from 'ramda'

export class Products {
    private URL: string = 'https://feeney3d.com/api'

    async getAllProducts(): Promise<Array<ProductEntity>> {
        return await fetch(`${this.URL}/products`, {
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => res.json())
            .then((result) => {
                return result
            })
    }

    async getIntermediatePost() {
        const products = await this.getAllProducts();
        let currentRailingType;
        let currentPostMounting;
        let currentHeight;
        const currentParams = useFeeneyStore.subscribe((state) => state, (state) => {
                currentRailingType = state.railingType;
                currentPostMounting = state.postMounting;
                currentHeight = state.railingHeight;
            },
            {
                fireImmediately: true,
            })

        const intermediatePostEntity = R.filter(R.where({
            railingType: R.equals(currentRailingType),
            productType: R.equals('Intermediate Post'),
            mountType: R.equals(currentPostMounting),
            heightGroup: R.equals(currentHeight),
        }))
        currentParams()
        //console.log(intermediatePostEntity(products))
        return intermediatePostEntity(products)[0]
    }
    async getCornerPost(){
        const products = await this.getAllProducts();
        let currentRailingType;
        let currentPostMounting;
        let currentHeight;
        let cornerPosts;
        const currentParams = useFeeneyStore.subscribe((state) => state, (state) => {
                currentRailingType = state.railingType;
                currentPostMounting = state.postMounting;
                currentHeight = state.railingHeight;
                cornerPosts = state.cornerPosts;
            },
            {
                fireImmediately: true,
            })

        const cornerPostEntity = R.filter(R.where({
            railingType: R.equals(currentRailingType),
            productType: R.equals('Corner Post'),
            mountType: R.equals(currentPostMounting),
            heightGroup: R.equals(currentHeight),
            cornerType: R.equals(cornerPosts),
            angleType: R.equals('Outside'),
        }))
        currentParams();

        return cornerPostEntity(products)[0];
    }
    async getBaseRail(){
        const products = await this.getAllProducts();
        let currentRailingType;
        const currentParams = useFeeneyStore.subscribe((state) => state, (state) => {
                currentRailingType = state.railingType;
            },
            {
                fireImmediately: true,
            })
        const baseRailEntity = R.filter(R.where({
            railingType: R.equals(currentRailingType),
            productType: R.equals('BaseRail'),
        }))
        currentParams();
        return baseRailEntity(products)[0];
    }
}
