import {ProductEntity} from '../../types';
import {Products} from './products';
import {AssetsLoader} from './assetsLoader';
import {MeshAssetTask} from 'babylonjs';
import {PositionsCalculator} from './positionsCalculator';
import {RailingComponents as RC} from '../../types/RailingComponents';
import {Singleton} from '../../decorators/singleton';
import {useFeeneyStore} from '../store/store';
import {Builder} from './builders/Builder';
import {InfillsBuilderArgs} from './builders/Infills/InfillsBuilder';

@Singleton
export class RailingGenerator {
    private products: Products = new Products();
    private assetsLoader: AssetsLoader = new AssetsLoader();
    private positionsCalculator: PositionsCalculator = new PositionsCalculator();
    private builder: Builder = new Builder();
    private railingEntities: Record<string, ProductEntity> = {};
    private railingTasks: Record<string, MeshAssetTask | undefined> = {};
    private isBuilt = false;

    /**
     *  RC - Means Railing Components
     *  @alias RailingComponents
     * */
    async buildRailing() {
        if (!this.isBuilt) {
            const {setIsRailingBuilding} = useFeeneyStore.getState();
            setIsRailingBuilding(true);

            await this.addAllRailingEntities();
            await this.addAllEntitiesToTasks();

            this.positionsCalculator.calculate(
                this.railingEntities[RC.intermediatePost]
            );
            const placementPoints = this.positionsCalculator.points;

            const postsArgs = {
                postTask: this.railingTasks[RC.intermediatePost],
                cornerPostTask: this.railingTasks[RC.cornerPost],
                positions: placementPoints,
                dimensions: this.positionsCalculator.dimensions,
            };
            const handRailArgs = {
                handRailTask: this.railingTasks[RC.handRail],
                positions: placementPoints,
                dimensions: this.positionsCalculator.dimensions,
                entity: this.railingEntities[RC.handRail],
            };
            const baseRailArgs = {
                baseRailTask: this.railingTasks[RC.baseRail],
                positions: placementPoints,
                dimensions: this.positionsCalculator.dimensions,
                entity: this.railingEntities[RC.baseRail],
            };
            const infillsArgs: InfillsBuilderArgs = {
                infillsTasks: {
                    horizontalCable: this.railingTasks[RC.horizontalCable],
                    hcVerticalPicket: this.railingTasks[RC.horizontalCableVerticalPicket],
                    verticalPicket: this.railingTasks[RC.verticalPicket],
                    verticalCable: this.railingTasks[RC.verticalCable],
                    clearGlass: this.railingTasks[RC.glass]
                },
                productEntities: {
                    bottomRail: this.railingEntities[RC.baseRail],
                },
                positions: placementPoints,
                dimensions: this.positionsCalculator.dimensions,
            };

            this.builder
                .buildAll({
                    postsArgs,
                    handRailArgs,
                    baseRailArgs,
                    infillsArgs,
                })
                .then(() => {
                    this.isBuilt = true;
                });
            this.assetsLoader.loadAllTasks();
        } else {
            this.builder.destroyAll().then(() => {
                this.isBuilt = false;
                this.buildRailing();
            });
        }
    }

    private async addRailingComponentTask(
        modelEntity: ProductEntity,
        componentType: RC
    ) {
        this.railingTasks[componentType] =
            this.assetsLoader.addModelToLoader(modelEntity);
    }

    private async addAllRailingEntities() {
        this.railingEntities[RC.intermediatePost] =
            await this.products.getIntermediatePost();
        this.railingEntities[RC.cornerPost] = await this.products.getCornerPost();
        this.railingEntities[RC.baseRail] = await this.products.getBaseRail();
        this.railingEntities[RC.handRail] = await this.products.getHandRail();
        this.railingEntities[RC.horizontalCable] =
            await this.products.getSingleHorizontalCable();
        this.railingEntities[RC.horizontalCableVerticalPicket] =
            await this.products.getHorizontalCableVerticalPicket();
        this.railingEntities[RC.verticalCable] =
            await this.products.getVerticalCable();
        this.railingEntities[RC.verticalPicket] =
            await this.products.getVerticalPicket();

    }

    private async addAllEntitiesToTasks() {
        await this.addRailingComponentTask(
            this.railingEntities[RC.intermediatePost],
            RC.intermediatePost
        );
        await this.addRailingComponentTask(
            this.railingEntities[RC.cornerPost],
            RC.cornerPost
        );
        await this.addRailingComponentTask(
            this.railingEntities[RC.baseRail],
            RC.baseRail
        );
        await this.addRailingComponentTask(
            this.railingEntities[RC.handRail],
            RC.handRail
        );
        await this.addRailingComponentTask(
            this.railingEntities[RC.horizontalCable],
            RC.horizontalCable
        );
        await this.addRailingComponentTask(
            this.railingEntities[RC.horizontalCableVerticalPicket],
            RC.horizontalCableVerticalPicket
        );
        await this.addRailingComponentTask(
            this.railingEntities[RC.verticalCable],
            RC.verticalCable
        );
        await this.addRailingComponentTask(
            this.railingEntities[RC.verticalPicket],
            RC.verticalPicket
        );
    }
}
