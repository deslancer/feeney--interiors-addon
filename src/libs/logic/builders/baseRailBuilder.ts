import {
  AbstractMesh,
  MeshAssetTask,
  Scene,
  TransformNode,
  Vector3,
} from 'babylonjs';
import { PositionsCalculator } from '../positionsCalculator';
import { useFeeneyStore } from '../../store/store';
import { Singleton } from '../../../decorators/singleton';
import {
  Balustrade,
  PlacementPoints,
  PostsPositionTypes,
  ProductEntity,
  RailingComponentsBuilder,
  Stairway,
} from '../../../types';
import {
  orientMeshByDirectionAndAngle,
  scaleMeshByValue,
} from '../../utils/transforms';
import { BACKWARD, FORWARD, LEFT, LEFTFWD, RIGHT } from '../../utils/constants';
import { setDefaultMaterial } from '../../utils/materials';

export interface BaseRailArgs {
  baseRailTask: MeshAssetTask | undefined;
  positions: PlacementPoints;
  dimensions: Record<string, number | number[]>;
  entity: ProductEntity;
}

@Singleton
export class BaseRailBuilder implements RailingComponentsBuilder<BaseRailArgs> {
  private readonly scene: Scene | undefined = undefined;
  private readonly positionsCalc: PositionsCalculator =
    new PositionsCalculator();
  private readonly _baseRailsRoot: TransformNode;

  constructor() {
    this.scene = useFeeneyStore.getState().scene;
    this._baseRailsRoot = new TransformNode('BaseRailsGroup', this.scene);
  }

  build(baseRailArgs: BaseRailArgs) {
    const { baseRailTask, positions, dimensions, entity } = baseRailArgs;
    const { postMounting, railingType, infill } = useFeeneyStore.getState();
    if (baseRailTask) {
      baseRailTask.onSuccess = (task) => {
        const baseRailMesh = task.loadedMeshes.find((node) =>
          node.name.includes('root')
        );

        const stairways = positions[PostsPositionTypes.STAIRS]
          .stairways as Stairway[];
        const balustrades = positions[PostsPositionTypes.PLATFORM]
          .balustrades as Balustrade[];
        if (baseRailMesh && infill !== 'horizontalCableWithoutBaserail') {
          baseRailMesh.name = 'BaseRail';
          setDefaultMaterial(baseRailMesh, railingType);

          baseRailMesh.isVisible = false;
          this._buildOnStairs(
            baseRailMesh,
            { stairways, balustrades },
            dimensions,
            postMounting,
            entity
          );
          this._buildOnPlatforms(
            baseRailMesh,
            { stairways, balustrades },
            dimensions,
            postMounting,
            entity
          );
          baseRailMesh.dispose();
        }
      };
      baseRailTask.onError = (task, message, exception) => {
        console.log(message, exception);
      };
    }
  }

  private _buildOnStairs(
    mesh: AbstractMesh,
    positions: { stairways: Stairway[]; balustrades: Balustrade[] },
    dimensions: Record<string, number | number[]>,
    postMounting: string,
    entity: ProductEntity
  ) {
    const { stairways } = positions;
    const postWidth = dimensions['postWidth'] as number;
    const baseRailWidth = entity.width / 100;
    let fasciaOffsetDelta = postWidth / 2;
    if (stairways.length > 0) {
      stairways.map((stairway, index) => {
        const stairsBaseRail = mesh.clone(
          'stairsBaseRail_' + index,
          this._baseRailsRoot
        );
        if (stairsBaseRail) {
          let length = stairway.length;
          if (postMounting === 'Fascia Mount') {
            length = stairway.fasciaLength;
          }

          stairsBaseRail.position.set(
            stairway.center.x,
            stairway.center.y + stairway.stepHeight,
            stairway.center.z
          );
          scaleMeshByValue(
            stairsBaseRail,
            length,
            { operation: 'subtr', delta: postWidth },
            this.positionsCalc
          );

          orientMeshByDirectionAndAngle(
            stairsBaseRail,
            stairway.direction,
            stairway.baseRail.angle
          );
          this.setPositionDependsOnMountType(
            postMounting,
            stairway.fasciaDirection,
            stairsBaseRail,
            stairway.fasciaCenter,
            fasciaOffsetDelta
          );
        }
      });
    }
  }

  private _buildOnPlatforms(
    node: AbstractMesh,
    positions: { stairways: Stairway[]; balustrades: Balustrade[] },
    dimensions: Record<string, number | number[]>,
    postMounting: string,
    entity: ProductEntity
  ) {
    const { balustrades } = positions;
    const postWidth = dimensions['postWidth'] as number;
    const baseRailWidth = entity.width / 100;
    let fasciaOffsetDelta = postWidth / 2;
    if (balustrades.length > 0) {
      balustrades.map((balustrade, index) => {
        const baseRailPlatform = node.clone(
          'baseRailPlatform_' + index,
          this._baseRailsRoot
        );
        if (baseRailPlatform) {
          let length = balustrade.length;
          if (postMounting.includes('Fascia Mount')) {
            length = balustrade.fasciaLength;
          }
          baseRailPlatform.position.set(
            balustrade.center.x,
            balustrade.center.y + balustrade.stepHeight,
            balustrade.center.z
          );

          scaleMeshByValue(
            baseRailPlatform,
            length,
            { operation: 'subtr', delta: postWidth },
            this.positionsCalc
          );

          orientMeshByDirectionAndAngle(
            baseRailPlatform,
            balustrade.direction,
            0
          );
          this.setPositionDependsOnMountType(
            postMounting,
            balustrade.fasciaDirection,
            baseRailPlatform,
            balustrade.fasciaCenter,
            fasciaOffsetDelta
          );
        }
      });
    }
  }

  private setPositionDependsOnMountType(
    postMounting: string,
    direction: Vector3,
    mesh: AbstractMesh,
    position: Vector3,
    delta: number
  ) {
    if (postMounting.includes('Fascia')) {
      if (direction.equals(LEFT) || direction.equals(LEFTFWD)) {
        mesh.position.x = position.x - delta;
        mesh.position.z = position.z;
      } else if (direction.equals(RIGHT)) {
        mesh.position.x = position.x + delta;
        mesh.position.z = position.z;
      } else if (direction.equals(FORWARD)) {
        mesh.position.x = position.x;
        mesh.position.z = position.z + delta;
      } else if (direction.equals(BACKWARD)) {
        mesh.position.x = position.x;
        mesh.position.z = position.z - delta;
      }
    }
  }

  remove() {
    this._baseRailsRoot.dispose(false, true);
  }
}
