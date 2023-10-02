import {AbstractMesh, MeshAssetTask, Scene, TransformNode, Vector3} from "babylonjs";
import {Balustrade, PlacementPoints, ProductEntity, RailingComponentsBuilder, Stairway} from "../../../../types";
import {PositionsCalculator} from "../../positionsCalculator";
import {useFeeneyStore} from "../../../store/store";
import {setDefaultMaterial} from "../../../utils/materials";
import {Singleton} from "../../../../decorators/singleton";

export interface VerticalPicketsArgs {
    verticalPicketTask: MeshAssetTask | undefined;
    positions: PlacementPoints;
    dimensions: Record<string, number | number[]>;
    baseRailEntity: ProductEntity;
}

@Singleton
export class VerticalPickets implements RailingComponentsBuilder<VerticalPicketsArgs> {
    private readonly scene: Scene | undefined = undefined;
    private _infillsRoot: TransformNode | null = null;
    private posCalculator: PositionsCalculator = new PositionsCalculator();

    constructor() {
        this.scene = useFeeneyStore.getState().scene;

    }

    build(args: VerticalPicketsArgs) {
        const {verticalPicketTask, positions, dimensions, baseRailEntity} = args;
        if (verticalPicketTask && positions) {
            this._infillsRoot = new TransformNode('VerticalPicketsGroup', this.scene);
            const stairways: Stairway[] = positions.stairs.stairways;
            const balustrades: Balustrade[] = positions.platform.balustrades;
            const {postMounting, railingType} = useFeeneyStore.getState();
            verticalPicketTask.onSuccess = (task) => {
                const onePicket = task.loadedMeshes.find((node) =>
                    node.name.includes('root')
                );

                if (onePicket) {
                    setDefaultMaterial(onePicket, railingType)
                    stairways.map((stairway) => {
                        this._buildStairSections(
                            onePicket,
                            stairway,
                            dimensions,
                            postMounting,
                            baseRailEntity
                        );
                    });

                    balustrades.map((balustrade, index) => {
                        this._buildPlatformSections(
                            onePicket,
                            balustrade,
                            dimensions,
                            postMounting,
                            baseRailEntity
                        );
                    });
                    onePicket.dispose();
                }

            }
        }
    }

//TODO refactor to one method
    private _buildStairSections(
        picket: AbstractMesh | undefined,
        stairway: Stairway,
        dimensions: Record<string, number | number[]>,
        postMount: string,
        baseRailEntity: ProductEntity
    ) {
        const postHeight = dimensions['postHeight'] as number;
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
                let mesh = picket?.clone('V_Cable_Stairs_' + index, null);

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
        let sectionsLengths = balustrade.sectionsLengths;
        let count = 11;
        const sectionsIntermediatePoints: Vector3[][] = []

        const pointsVectors = balustrade.points.map((point) =>
            Vector3.FromArray(point.map((point) => Number(point)))
        )

        for (let i = 0; i <= pointsVectors.length - 1; i++) {
            if (sectionsLengths[i - 1] < minSectionLength) {
                count = 4;
            }
            const fromVec = pointsVectors[i];
            const toVec = pointsVectors[i + 1];
            if (toVec) {
                sectionsIntermediatePoints.push(this.posCalculator.interpolateVectors(fromVec, toVec, count))
            }
        }
        sectionsIntermediatePoints.map((section) => {
            const sectionNode = new TransformNode('balustradeSectionNode', this.scene);
            section.map((position, index) => {
                let mesh = picket?.clone('V_Cable_Stairs_' + index, null);

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

    remove() {
        this._infillsRoot?.dispose(false, true);

    }
}