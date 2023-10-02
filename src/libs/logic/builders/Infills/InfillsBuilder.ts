import {PlacementPoints, ProductEntity, RailingComponentsBuilder,} from '../../../../types';
import {Singleton} from '../../../../decorators/singleton';
import {HorizontalCable} from './HorizontalCable';
import {useFeeneyStore} from '../../../store/store';
import {VerticalCable} from './VerticalCable';
import {MeshAssetTask} from 'babylonjs';
import {VerticalPickets} from "./VerticalPickets";
import {GlassInfills} from "./GlassInfills";

export interface InfillsBuilderArgs {
    infillsTasks: {
        horizontalCable: MeshAssetTask | undefined;
        hcVerticalPicket: MeshAssetTask | undefined;
        verticalCable: MeshAssetTask | undefined;
        verticalPicket: MeshAssetTask | undefined;
        clearGlass: MeshAssetTask | undefined;
    };
    productEntities: {
        bottomRail: ProductEntity;
    };
    positions: PlacementPoints;
    dimensions: Record<string, number | number[]>;
}

@Singleton
export class InfillsBuilder implements RailingComponentsBuilder<any> {
    private horizontalCable: HorizontalCable = new HorizontalCable();
    private verticalCable: VerticalCable = new VerticalCable();
    private verticalPickets: VerticalPickets = new VerticalPickets();
    private glassInfills: GlassInfills = new GlassInfills();

    constructor() {
    }

    build(args: InfillsBuilderArgs): void {
        const {infill} = useFeeneyStore.getState();
        const {
            infillsTasks, productEntities,
            positions, dimensions
        } = args;
        switch (true) {
            case infill === 'horizontalCable':
                this.horizontalCable.build({
                    horizontalCableTask: infillsTasks.horizontalCable,
                    horizontalCableVerticalPicketTask: infillsTasks.hcVerticalPicket,
                    positions: positions,
                    dimensions: dimensions,
                    bottomRailEntity: productEntities.bottomRail,
                });
                break;
            case infill === 'horizontalCableBaserail':
                this.horizontalCable.build({
                    horizontalCableTask: infillsTasks.horizontalCable,
                    horizontalCableVerticalPicketTask: infillsTasks.hcVerticalPicket,
                    positions: positions,
                    dimensions: dimensions,
                    bottomRailEntity: productEntities.bottomRail,
                });
                break;
            case infill === 'verticalCable':
                this.verticalCable.build({
                    verticalCableTask: infillsTasks.verticalCable,
                    verticalPicketTask: infillsTasks.verticalPicket,
                    positions: positions,
                    dimensions: dimensions,
                    baseRailEntity: productEntities.bottomRail,
                });
                break;
            case infill === 'verticalPicket':
                this.verticalPickets.build({
                    verticalPicketTask: infillsTasks.verticalPicket,
                    positions: positions,
                    dimensions: dimensions,
                    baseRailEntity: productEntities.bottomRail
                })
                break;
            case infill === 'glassClear':
                this.glassInfills.build({
                    clearGlassTask: infillsTasks.clearGlass,
                    positions: positions,
                    dimensions: dimensions,
                    baseRailEntity: productEntities.bottomRail
                })
                break;
            case infill === 'steelMesh':
                break;
            case infill === 'laserCut':
                break;
        }
    }

    remove(): void {
        this.horizontalCable.remove();
        this.verticalCable.remove();
        this.verticalPickets.remove()
    }
}
