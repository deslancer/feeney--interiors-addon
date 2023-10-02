import {PlacementPoints, ProductEntity, RailingComponentsBuilder} from "../../../../types";
import {MeshAssetTask, Scene} from "babylonjs";
import {Singleton} from "../../../../decorators/singleton";
import {useFeeneyStore} from "../../../store/store";

export interface GlassInfillsProps {
    clearGlassTask: MeshAssetTask | undefined;
    positions: PlacementPoints;
    dimensions: Record<string, number | number[]>;
    baseRailEntity: ProductEntity;
}

@Singleton
export class GlassInfills implements RailingComponentsBuilder<GlassInfillsProps> {
    private readonly scene: Scene | undefined = undefined;

    constructor() {
        this.scene = useFeeneyStore.getState().scene;
    }

    build(args: GlassInfillsProps): void {
        const {
            clearGlassTask, positions,
            dimensions, baseRailEntity
        } = args;

        if (clearGlassTask && positions) {
            clearGlassTask.onSuccess = (task) => {
                const glassNode = task.loadedMeshes.find((node) =>
                    node.name.includes('root')
                );
                console.log(glassNode)
            }
        }
    }

    remove(): void {
    }

}