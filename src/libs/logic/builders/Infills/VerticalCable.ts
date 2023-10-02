import {Singleton} from '../../../../decorators/singleton';
import {AbstractMesh, MeshAssetTask, Scene, TransformNode, Vector3} from 'babylonjs';
import {Balustrade, PlacementPoints, ProductEntity, RailingComponentsBuilder, Stairway,} from '../../../../types';
import {useFeeneyStore} from '../../../store/store';
import {BACKWARD, FORWARD, LEFT, RIGHT} from '../../../utils/constants';
import {PositionsCalculator} from "../../positionsCalculator";

export interface VerticalCableArgs {
    verticalCableTask: MeshAssetTask | undefined;
    verticalPicketTask: MeshAssetTask | undefined;
    positions: PlacementPoints;
    dimensions: Record<string, number | number[]>;
    baseRailEntity: ProductEntity;
}

@Singleton
export class VerticalCable implements RailingComponentsBuilder<VerticalCableArgs> {
    private readonly scene: Scene | undefined = undefined;
    private _infillsRoot: TransformNode | null = null;
    private posCalculator: PositionsCalculator = new PositionsCalculator();

    constructor() {
        this.scene = useFeeneyStore.getState().scene;

    }

    build(args: VerticalCableArgs) {
        const {
            verticalCableTask,
            verticalPicketTask,
            positions,
            dimensions,
            baseRailEntity,
        } = args;
        if (verticalCableTask && verticalPicketTask && positions) {
            const {postMounting} = useFeeneyStore.getState();
            this._infillsRoot = new TransformNode('VerticalCableGroup', this.scene);
            verticalCableTask.onSuccess = (task) => {
                const oneCable = task.loadedMeshes.find((node) =>
                    node.name.includes('root')
                );
                const stairways: Stairway[] = positions.stairs.stairways;
                const balustrades: Balustrade[] = positions.platform.balustrades;

                if (oneCable) {
                    oneCable.name = 'VerticalCable';

                    verticalPicketTask.onSuccess = (task) => {
                        const onePicket = task.loadedMeshes.find((node) =>
                            node.name.includes('root')
                        );
                        stairways.map((stairway) => {
                            this._buildStairSections(
                                oneCable,
                                onePicket,
                                stairway,
                                dimensions,
                                postMounting,
                                baseRailEntity
                            );
                        });

                        balustrades.map((balustrade, index) => {
                            this._buildPlatformSections(
                                oneCable,
                                onePicket,
                                balustrade,
                                dimensions,
                                postMounting,
                                baseRailEntity
                            );
                        });
                        oneCable.dispose();
                        onePicket?.dispose();
                    };
                    verticalPicketTask.onError = (task, message, exception) => {
                        console.log('Error in PicketTask');
                        console.log(message, exception);
                    };
                }
            };
            verticalCableTask.onError = (task, message, exception) => {
                console.log(message, exception);
            };
        }
    }

    private _buildStairSections(
        cable: AbstractMesh,
        picket: AbstractMesh | undefined,
        stairway: Stairway,
        dimensions: Record<string, number | number[]>,
        postMount: string,
        baseRailEntity: ProductEntity
    ) {
        const postHeight = dimensions['postHeight'] as number;
        const sectionsCenters = stairway.sectionsCenter;
        const sectionsLengths = stairway.sectionsLengths;
        const heightOffset = postHeight / 2 + stairway.stepHeight / 2;
        let count = 11;
        const sectionsIntermediatePoints: Vector3[][] = []

        const pointsVectors = stairway.points.map((point) =>
            Vector3.FromArray(point.map((point) => Number(point)))
        )

        for (let i = 0; i <= pointsVectors.length - 1; i++) {
            const fromVec = pointsVectors[i];
            const toVec = pointsVectors[i + 1];
            if (toVec) {
                sectionsIntermediatePoints.push(this.posCalculator.interpolateVectors(fromVec, toVec, count))
            }
        }

        sectionsIntermediatePoints.map((section) => {
            const sectionNode = new TransformNode('stairwaySectionNode', this.scene);
            section.map((position, index) => {
                let mesh = cable.clone('V_Cable_Stairs_' + index, null);
                if (index === 3 || index === 7) {
                    if (picket) mesh = picket.clone('VCablePicket_', null);
                }
                if (mesh) {
                    mesh.position.set(
                        position.x,
                        position.y += heightOffset,
                        position.z
                    );

                    mesh.parent = sectionNode;
                }
            })

            sectionNode.parent = this._infillsRoot;
        })
    }

    private _buildPlatformSections(
        cable: AbstractMesh,
        picket: AbstractMesh | undefined,
        balustrade: Balustrade,
        dimensions: Record<string, number | number[]>,
        postMount: string,
        baseRailEntity: ProductEntity
    ) {
        const postHeight = dimensions['postHeight'] as number;
        const heightOffset = postHeight / 2 + balustrade.stepHeight / 2;
        const postWidth = dimensions['postWidth'] as number;
        const minSectionLength = 0.5;
        let sectionsCenters = balustrade.sectionsCenter;
        let sectionsLengths = balustrade.sectionsLengths;
        let count = 11;
        sectionsCenters.map((position, index) => {
            const sectionNode = new TransformNode('platformSectionNode', this.scene);
            const secLengthWithoutPosts = sectionsLengths[index] - postWidth * 1.5;
            let offset = secLengthWithoutPosts / count;
            const vCable = cable.clone('V_Cable_Platform_', null);
            if (sectionsLengths[index] < minSectionLength) {
                count = 4;
                offset = sectionsLengths[index] / count;
            }
            if (vCable) {
                vCable.parent = sectionNode;
                vCable.position.set(0, heightOffset, 0);
                vCable.scaling.y = 1.1;
                for (let i = 0; i < count; i++) {
                    let mesh = vCable.clone('H_Cable_Stairs_' + i, null);
                    if (i === 3 || i === 7) {
                        if (picket) mesh = picket.clone('VCablePicket_', null);
                    }
                    if (mesh) {
                        if (balustrade.direction.equals(FORWARD)) {
                            mesh.position.set(
                                vCable.position.x,
                                vCable.position.y,
                                (vCable.position.z -= offset)
                            );
                        } else if (balustrade.direction.equals(BACKWARD)) {
                            mesh.position.set(
                                vCable.position.x,
                                vCable.position.y,
                                (vCable.position.z += offset)
                            );
                        } else if (balustrade.direction.equals(LEFT)) {
                            mesh.position.set(
                                (vCable.position.x += offset),
                                vCable.position.y,
                                vCable.position.z
                            );
                        } else if (balustrade.direction.equals(RIGHT)) {
                            mesh.position.set(
                                (vCable.position.x -= offset),
                                vCable.position.y,
                                vCable.position.z
                            );
                        }
                        mesh.parent = sectionNode;
                    }
                }
                if (balustrade.direction.equals(FORWARD)) {
                    sectionNode.position.set(
                        position.x,
                        position.y,
                        (position.z += balustrade.sectionsLengths[index] / 2)
                    );
                } else if (balustrade.direction.equals(BACKWARD)) {
                    sectionNode.position.set(
                        position.x,
                        position.y,
                        (position.z -= balustrade.sectionsLengths[index] / 2)
                    );
                } else if (balustrade.direction.equals(LEFT)) {
                    sectionNode.position.set(
                        (position.x -= balustrade.sectionsLengths[index] / 2),
                        position.y,
                        position.z
                    );
                } else if (balustrade.direction.equals(RIGHT)) {
                    sectionNode.position.set(
                        (position.x += balustrade.sectionsLengths[index] / 2),
                        position.y,
                        position.z
                    );
                }

                sectionNode.parent = this._infillsRoot;
            }
        });
    }

    remove() {
        this._infillsRoot?.dispose(false, true);
    }
}
