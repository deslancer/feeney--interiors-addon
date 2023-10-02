import {useFeeneyStore} from '../store/store';
import {ProductEntity} from '../../types';
import * as R from 'ramda';
import {InfillProductTypes} from "../../types/InfillProductTypes";

export class Products {
    private URL = 'https://feeney3d.com/api';

    async getAllProducts(): Promise<Array<ProductEntity>> {
        return await fetch(`${this.URL}/products`, {
            headers: {'Content-Type': 'application/json'},
        })
            .then((res) => res.json())
            .then((result) => {
                return result;
            });
    }

    async getIntermediatePost(): Promise<ProductEntity> {
        const products = await this.getAllProducts();
        let currentRailingType: string | string[] = '';
        let currentPostMounting;
        let currentHeight;
        const currentParams = useFeeneyStore.subscribe(
            (state) => state,
            (state) => {
                currentRailingType = state.railingType;
                currentPostMounting = state.postMounting;
                currentHeight = state.railingHeight;
            },
            {
                fireImmediately: true,
            }
        );

        /*console.log(
                                                                                                              'all Posts',
                                                                                                              products
                                                                                                                .filter((prod) => prod.productType === 'Intermediate Post')
                                                                                                                .filter((prod) => prod.railingType.includes(currentRailingType[0]))
                                                                                                            );*/
        const intermediatePostEntity = R.filter(
            R.where({
                railingType: R.equals(
                    typeof currentRailingType === 'string'
                        ? JSON.parse(currentRailingType)
                        : currentRailingType
                ),
                productType: R.equals('Intermediate Post'),
                mountType: R.equals(currentPostMounting),
                heightGroup: R.equals(currentHeight),
            })
        );
        currentParams();
        //console.log('intermediate post', intermediatePostEntity(products));
        return intermediatePostEntity(products)[0];
    }

    async getCornerPost(): Promise<ProductEntity> {
        const products = await this.getAllProducts();
        let currentRailingType;
        let currentPostMounting;
        let currentHeight;
        let cornerPosts;
        const currentParams = useFeeneyStore.subscribe(
            (state) => state,
            (state) => {
                currentRailingType = state.railingType;
                currentPostMounting = state.postMounting;
                currentHeight = state.railingHeight;
                cornerPosts = state.cornerPosts;
            },
            {
                fireImmediately: true,
            }
        );

        const cornerPostEntity = R.filter(
            R.where({
                railingType: R.equals(
                    typeof currentRailingType === 'string'
                        ? JSON.parse(currentRailingType)
                        : currentRailingType
                ),
                productType: R.equals('Corner Post'),
                mountType: R.equals(currentPostMounting),
                heightGroup: R.equals(currentHeight),
                cornerType: R.equals(cornerPosts),
                angleType: R.equals('Inside'),
            })
        );
        currentParams();
        //console.log('corner post', cornerPostEntity(products));
        return cornerPostEntity(products)[0];
    }

    async getBaseRail(): Promise<ProductEntity> {
        const products = await this.getAllProducts();
        let currentRailingType: string | string[] = '';
        const currentParams = useFeeneyStore.subscribe(
            (state) => state,
            (state) => {
                currentRailingType = state.railingType;
            },
            {
                fireImmediately: true,
            }
        );

        const baseRailEntity = R.filter(
            R.where({
                railingType: R.equals(
                    typeof currentRailingType === 'string'
                        ? JSON.parse(currentRailingType)
                        : currentRailingType
                ),
                productType: R.equals('BaseRail'),
            })
        );
        currentParams();
        //console.log('base rail', baseRailEntity(products));
        return baseRailEntity(products)[0];
    }

    async getHandRail(): Promise<ProductEntity> {
        const products = await this.getAllProducts();
        let heightValue = '';
        let type = '';
        let currentRailingType: string[] = [''];
        let handRailEntity: any;
        const currentParams = useFeeneyStore.subscribe(
            (state) => state,
            (state) => {
                heightValue = state.railingHeight;
                type = state.topRail;
                currentRailingType = state.railingType;
            },
            {
                fireImmediately: true,
            }
        );
        currentParams();
        /*console.log(
                                                                                                                                      'all handrails',
                                                                                                                                      products
                                                                                                                                        .filter((prod) => prod.productType === 'Handrail')
                                                                                                                                        .filter((prod) => prod.railingType.includes(currentRailingType[0]))
                                                                                                                                    );*/
        if (type === 'CompositeTop') {
            handRailEntity = R.filter(
                R.where({
                    placementRule: R.equals('Continuous'),
                    handrailType: R.equals('Composite'),
                    heightGroup: R.equals(heightValue),
                })
            );
            return handRailEntity(products)[0];
        } else if (type === 'CompositeBetween') {
            handRailEntity = R.filter(
                R.where({
                    placementRule: R.equals('Between Posts'),
                    handrailType: R.equals('Composite'),
                    heightGroup: R.equals(heightValue),
                })
            );
            return handRailEntity(products)[0];
        } else {
            handRailEntity = products.filter((prod) => {
                return (
                    prod.railingType &&
                    prod.railingType.includes(currentRailingType[0]) &&
                    prod.handrailType === type &&
                    prod.productType === 'Handrail' &&
                    prod.heightGroup === heightValue
                );
            });
            //
            // console.log(handRailEntity);
            return handRailEntity[0];
        }
    }

    async getSingleHorizontalCable(height?: string) {
        const products = await this.getAllProducts();
        let heightValue = '';
        let currentRailingType;

        const currentParams = useFeeneyStore.subscribe(
            (state) => state,
            (state) => {
                heightValue = height ? height : state.railingHeight;
                currentRailingType = state.railingType;
            },
            {
                fireImmediately: true,
            }
        );

        const horizontalCableEntity = R.filter(
            R.where({
                heightGroup: R.equals(heightValue),
                productType: R.equals('Single Horizontal Cable For Stairs'),
            })
        );
        currentParams();
        //console.log('horizontal cable', horizontalCableEntity(products));

        /*console.log(
                                                                                                                                                  'all hor cables',
                                                                                                                                                  products.filter((prod) => prod.productType === 'Horizontal Cable')
                                                                                                                                                );*/
        return horizontalCableEntity(products)[0];
    }

    async getVerticalCable() {
        const products = await this.getAllProducts();
        let heightValue = '';
        let currentRailingType;

        const currentParams = useFeeneyStore.subscribe(
            (state) => state,
            (state) => {
                heightValue = state.railingHeight;
                currentRailingType = state.railingType;
            },
            {
                fireImmediately: true,
            }
        );

        const verticalCableEntity = R.filter(
            R.where({
                heightGroup: R.equals(heightValue),
                productType: R.equals('Vertical Cable'),
            })
        );
        currentParams();
        //console.log('vertical cable', verticalCableEntity(products));

        return verticalCableEntity(products)[0];
    }

    async getHorizontalCableVerticalPicket() {
        const products = await this.getAllProducts();

        let railingHeight: string;
        let railingType: string[];
        let verticalPicketShapeType: string = 'Square';
        let infill: string = '';
        let postMounting: string;
        let product: any;
        const currentParams = useFeeneyStore.subscribe(
            (state) => state,
            (state) => {
                railingHeight = state.railingHeight;
                verticalPicketShapeType = state.verticalPicketShapeType;
                railingType = state.railingType;
                infill = state.infill;
                postMounting = state.postMounting;
            },
            {
                fireImmediately: true,
            }
        );
        currentParams();

        const infillWithBaserail = infill === 'horizontalCableBaserail';
        const fitsPostMount = (picket: ProductEntity) => {
            if (infillWithBaserail) {
                return true;
            } else {
                return (
                    picket.mountType === postMounting ||
                    (picket.mountType === 'Base Mount' &&
                        (postMounting === 'Stantion Mount' ||
                            postMounting === 'Core Mount'))
                );
            }
        };
        product = products.find(
            (p) =>
                p.railingType &&
                p.railingType.includes(railingType[0]) &&
                p.productType === 'Vertical Picket' &&
                p.heightGroup === railingHeight &&
                p.verticalPicketShapeType === verticalPicketShapeType &&
                Boolean(p.verticalPicketForInfillWithBaserail) == infillWithBaserail &&
                fitsPostMount(p)
        );
        //console.log(product);
        if (product) {
            return product;
        }
    }

    async getVerticalPicket() {
        const products = await this.getAllProducts();
        let railingHeight: string;
        let railingType: string[];
        let product: any;

        const currentParams = useFeeneyStore.subscribe(
            (state) => state,
            (state) => {
                railingHeight = state.railingHeight;
                railingType = state.railingType;
            },
            {
                fireImmediately: true,
            }
        );

        product = products.find(
            (p) =>
                p.railingType &&
                p.railingType.includes(railingType[0]) &&
                p.productType === 'Vertical Picket' &&
                p.heightGroup === railingHeight &&
                p.verticalPicketShapeType === 'Square' &&
                p.verticalPicketForInfillWithBaserail
        );

        if (product) {
            currentParams();
            return product;
        }
    }

    async getInfillProduct(infillType: string) {
        const products = await this.getAllProducts();
        const infillTypes: Record<string, string> = InfillProductTypes;

        let railingType: string[];
        let product: any;
        const currentParams = useFeeneyStore.subscribe(
            (state) => state,
            (state) => {
                railingType = state.railingType;
            },
            {
                fireImmediately: true,
            }
        );
        product = products.find(
            (p) =>
                p.railingType &&
                p.railingType.includes(railingType[0]) &&
                p.productType === infillTypes[infillType]
        );

        if (product) {
            currentParams()
            return product;
        }
    }

}
