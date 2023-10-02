import {AbstractMesh, MeshAssetTask, Scene, TransformNode} from 'babylonjs';
import {Singleton} from '../../../../decorators/singleton';
import {PositionsCalculator} from '../../positionsCalculator';
import {useFeeneyStore} from '../../../store/store';
import {
  Balustrade,
  HorizontalCablePlatformCount,
  HorizontalCableStairsCount,
  PlacementPoints,
  ProductEntity,
  RailingComponentsBuilder,
  Stairway,
} from '../../../../types';
import {
  orientMeshByDirectionAndAngle,
  scaleMeshByValue,
  setPositionDependsOnDirection,
} from '../../../utils/transforms';
import {setDefaultMaterial} from '../../../utils/materials';

export interface HorizontalCableArgs {
    horizontalCableTask: MeshAssetTask | undefined;
    horizontalCableVerticalPicketTask: MeshAssetTask | undefined;
    positions: PlacementPoints;
    dimensions: Record<string, number | number[]>;
    bottomRailEntity: ProductEntity;
}

@Singleton
export class HorizontalCable implements RailingComponentsBuilder<HorizontalCableArgs> {
    private readonly positionsCalc: PositionsCalculator =
        new PositionsCalculator();
    private readonly scene: Scene | undefined = undefined;
    private railingHeight: string = '';
    private readonly _infillsRoot: TransformNode;
    private offsetDelta = 0;
    private infillType: string = 'horizontalCableBaserail';
    private topRail: string = '200s';

    constructor() {
        this.scene = useFeeneyStore.getState().scene;
        this._infillsRoot = new TransformNode('HorizontalCableGroup', this.scene);
    }

    build(horizontalCableArgs: HorizontalCableArgs) {
        const {
            horizontalCableTask,
            horizontalCableVerticalPicketTask,
            positions,
            dimensions,
            bottomRailEntity,
        } = horizontalCableArgs;

        const {railingType, railingHeight, postMounting, infill, topRail} =
            useFeeneyStore.getState();
        this.railingHeight = railingHeight;
        this.topRail = topRail;
        const postWidth = dimensions['postWidth'] as number;
        this.offsetDelta = postWidth;
        this.infillType = infill;
        if (railingType[0].includes('Wood') || postMounting.includes('Fascia')) {
            this.offsetDelta = postWidth / 2;
        }
        if (horizontalCableTask && positions) {
            horizontalCableTask.onSuccess = (task) => {
                const oneCable = task.loadedMeshes.find((node) =>
                    node.name.includes('root')
                );
                const stairways: Stairway[] = positions.stairs.stairways;
                const balustrades: Balustrade[] = positions.platform.balustrades;

                if (oneCable) {
                    oneCable.name = 'HorizontalCable';

                    setDefaultMaterial(oneCable, railingType);

                    stairways.map((stairway) => {
                        this._buildStairSections(
                            oneCable,
                            stairway,
                            dimensions,
                            postMounting,
                            railingType
                        );
                    });

                    balustrades.map((balustrade, index) => {
                        this._buildPlatformSections(
                            oneCable,
                            balustrade,
                            dimensions,
                            postMounting,
                            railingType
                        );
                    });
                    oneCable.dispose();
                }
            };
        }
        if (horizontalCableVerticalPicketTask && positions && bottomRailEntity) {
            horizontalCableVerticalPicketTask.onSuccess = (task: MeshAssetTask) => {
                const onePicket = task.loadedMeshes.find((node) =>
                    node.name.includes('root')
                );

                if (onePicket && !railingType[0].includes('Steel')) {
                    onePicket.name = 'VerticalPicketForHorizontalInfill';

                    setDefaultMaterial(onePicket, railingType);

                    this._buildVerticalPickets(
                        onePicket,
                        positions,
                        dimensions,
                        bottomRailEntity,
                        postMounting,
                        railingType
                    );
                }
                onePicket?.dispose();
            };
        }
    }

    private _buildStairSections(
        mesh: AbstractMesh,
        stairway: Stairway,
        dimensions: Record<string, number | number[]>,
        postMount: string,
        railingType: string[]
    ) {
        const postHeight = dimensions['postHeight'] as number;
        const isFasciaMount = postMount.includes('Fascia');
        const cableCount = HorizontalCableStairsCount[this.railingHeight];
        let heightDelta = stairway.stepHeight;

        let cablesGap = (postHeight - 0.15) / cableCount;
        let sectionsCenters = stairway.sectionsCenter;
        let sectionsLengths = stairway.sectionsLengths;
        let sectionsAngles = stairway.sectionsAngles;

        if (isFasciaMount) {
            sectionsCenters = stairway.fasciaSectionsCenter;
            sectionsLengths = stairway.fasciaSectionsLengths;
            sectionsAngles = stairway.fasciaSectionsAngles;
            heightDelta = stairway.stepHeight + 0.214;
            cablesGap = (postHeight - heightDelta - stairway.stepHeight) / cableCount;
        }

        sectionsCenters.map((pos, index) => {
            const sectionNode = new TransformNode(
                'stairSectionNode_' + index,
                this.scene
            );
            const firstCable = mesh.clone('H_Cable_Stairs_', null);

            if (firstCable) {
                firstCable.parent = sectionNode;
                firstCable.position.set(0, heightDelta, 0);
                scaleMeshByValue(
                    firstCable,
                    sectionsLengths[index],
                    {operation: 'subtr', delta: 0},
                    this.positionsCalc
                );

                orientMeshByDirectionAndAngle(
                    firstCable,
                    stairway.direction,
                    sectionsAngles[index]
                );
                for (let i = 0; i < cableCount; i++) {
                    const cable = firstCable.clone('H_Cable_Stairs_' + i, null);
                    if (cable) {
                        cable.position.set(0, (firstCable.position.y += cablesGap), 0);
                        cable.parent = sectionNode;
                    }
                }
                sectionNode.position.set(pos.x, pos.y, pos.z);
                if (isFasciaMount) {
                    setPositionDependsOnDirection(
                        stairway.fasciaDirection,
                        sectionNode,
                        this.offsetDelta
                    );
                }
                sectionNode.parent = this._infillsRoot;
            }
        });
    }

    private _buildPlatformSections(
        mesh: AbstractMesh,
        balustrade: Balustrade,
        dimensions: Record<string, number | number[]>,
        postMount: string,
        railingType: string[]
    ) {
        const postHeight = dimensions['postHeight'] as number;
        const postWidth = dimensions['postWidth'] as number;
        const cableCount = HorizontalCablePlatformCount[this.railingHeight];
        const isFasciaMount = postMount.includes('Fascia');
        let sectionsCenters = balustrade.sectionsCenter;
        let sectionsLengths = balustrade.sectionsLengths;
        let heightDelta = balustrade.stepHeight;

        let cablesGap = (postHeight - balustrade.stepHeight * 1.5) / cableCount;

        if (isFasciaMount) {
            sectionsCenters = balustrade.fasciaSectionsCenter;
            sectionsLengths = balustrade.fasciaSectionsLengths;
            heightDelta = balustrade.stepHeight + 0.214;
            cablesGap =
                (postHeight - heightDelta - balustrade.stepHeight / 2) / cableCount;
        }

        sectionsCenters.map((position, index) => {
            const sectionNode = new TransformNode('platformSectionNode', this.scene);

            const bottomCable = mesh.clone('H_Cable_Platform_', null);

            if (bottomCable) {
                bottomCable.parent = sectionNode;
                bottomCable.position.set(0, heightDelta, 0);
                scaleMeshByValue(
                    bottomCable,
                    sectionsLengths[index],
                    {operation: 'subtr', delta: 0},
                    this.positionsCalc
                );

                orientMeshByDirectionAndAngle(bottomCable, balustrade.direction, 0);
                for (let i = 0; i < cableCount; i++) {
                    const cable = bottomCable.clone('H_Cable_Stairs_' + i, null);
                    if (cable) {
                        cable.position.set(0, (bottomCable.position.y += cablesGap), 0);
                        cable.parent = sectionNode;
                    }
                }
                sectionNode.position.set(position.x, position.y, position.z);
                if (isFasciaMount) {
                    setPositionDependsOnDirection(
                        balustrade.fasciaDirection,
                        sectionNode,
                        this.offsetDelta
                    );
                }
                sectionNode.parent = this._infillsRoot;
            }
        });
    }

    private _buildVerticalPickets(
        mesh: AbstractMesh,
        positions: PlacementPoints,
        dimensions: Record<string, number | number[]>,
        bottomRailEntity: ProductEntity,
        postMount: string,
        railingType: string[]
    ) {
        const postHeight = dimensions['postHeight'] as number;
        const stairways: Stairway[] = positions.stairs.stairways;
        const balustrades: Balustrade[] = positions.platform.balustrades;
        const minSectionLength = 0.5;
        const bottomRailHeight = bottomRailEntity.height / 100;
        const is150s = this.topRail === '150s';
        const isFasciaMount = postMount.includes('Fascia');

        stairways.map((stairway, index) => {
            let sectionsCenters = stairway.sectionsCenter;
            if (isFasciaMount) {
                sectionsCenters = stairway.fasciaSectionsCenter;
            }
            sectionsCenters.map((center) => {
                const picket = mesh.clone('HCPicket_' + index, this._infillsRoot);
                let offsetY =
                    postHeight / 2 + stairway.stepHeight - bottomRailEntity.height / 100;
                if (railingType[0].includes('Wood') || isFasciaMount) {
                    offsetY = postHeight / 2 + stairway.stepHeight + bottomRailHeight * 2;
                }
                if (picket) {
                    picket.scaling.y = is150s || isFasciaMount ? 0.87 : 0.95;
                    picket.position.set(center.x, center.y + offsetY, center.z);
                    if (isFasciaMount) {
                        setPositionDependsOnDirection(
                            stairway.fasciaDirection,
                            picket,
                            this.offsetDelta
                        );
                    }
                }
            });
        });

        balustrades.map((balustrade, index) => {
            let sectionsCenters = balustrade.sectionsCenter;
            if (isFasciaMount) {
                sectionsCenters = balustrade.fasciaSectionsCenter;
            }
            sectionsCenters.map((position) => {
                if (balustrade.sectionsLengths[index] > minSectionLength) {
                    let offsetY = postHeight / 2 + balustrade.stepHeight / 2;
                    if (railingType[0].includes('Wood') || isFasciaMount) {
                        offsetY =
                            postHeight / 2 + balustrade.stepHeight + bottomRailHeight * 2;
                    }
                    if (this.infillType === 'horizontalCableWithoutBaserail') {
                        offsetY = postHeight / 2;
                    }
                    if (is150s) {
                        offsetY = postHeight / 2;
                    }
                    const picket = mesh.clone('HCPicket_' + index, this._infillsRoot);
                    if (picket) {
                        picket.scaling.y = is150s ? 0.925 : 1.0;
                        picket.position.set(position.x, position.y + offsetY, position.z);
                        if (isFasciaMount) {
                            setPositionDependsOnDirection(
                                balustrade.fasciaDirection,
                                picket,
                                this.offsetDelta
                            );
                        }
                    }
                }
            });
        });
    }

    remove() {
        this._infillsRoot.dispose(false, true);
    }
}
