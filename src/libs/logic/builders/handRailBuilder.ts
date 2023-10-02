import { useFeeneyStore } from '../../store/store';
import {
  AbstractMesh,
  MeshAssetTask,
  Scene,
  TransformNode,
  Vector3,
} from 'babylonjs';
import { Singleton } from '../../../decorators/singleton';
import { PositionsCalculator } from '../positionsCalculator';
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

export interface HandRailArgs {
  handRailTask: MeshAssetTask | undefined;
  positions: PlacementPoints;
  dimensions: Record<string, number | number[]>;
  entity: ProductEntity;
}

@Singleton
export class HandRailBuilder implements RailingComponentsBuilder<HandRailArgs> {
  private readonly scene: Scene | undefined = undefined;
  private readonly positionsCalc: PositionsCalculator =
    new PositionsCalculator();
  private readonly _handRailsRoot: TransformNode;
  private topRail: string = '';

  constructor() {
    this.scene = useFeeneyStore.getState().scene;
    this._handRailsRoot = new TransformNode('HandRailsGroup', this.scene);
  }

  build(handRailArgs: HandRailArgs) {
    const { handRailTask, positions, dimensions, entity } = handRailArgs;
    const { postMounting, railingType, topRail } = useFeeneyStore.getState();
    this.topRail = topRail;
    if (handRailTask) {
      handRailTask.onSuccess = (task) => {
        const handRailMesh = task.loadedMeshes.find((node) =>
          node.name.includes('root')
        );
        if (handRailMesh) {
          handRailMesh.name = 'HandRail';
          handRailMesh.parent = this._handRailsRoot;

          setDefaultMaterial(handRailMesh, railingType);

          const stairways = positions[PostsPositionTypes.STAIRS]
            .stairways as Stairway[];
          const balustrades = positions[PostsPositionTypes.PLATFORM]
            .balustrades as Balustrade[];
          this._buildForStairs(
            handRailMesh,
            { stairways, balustrades },
            dimensions,
            entity,
            postMounting
          );
          this._buildForPlatform(
            handRailMesh,
            { stairways, balustrades },
            dimensions,
            entity,
            postMounting
          );
          handRailMesh.dispose();
        }
      };
      handRailTask.onError = (task, message, exception) => {
        console.log(message, exception);
      };
    }
  }

  private _buildForStairs(
    mesh: AbstractMesh,
    positions: { stairways: Stairway[]; balustrades: Balustrade[] },
    dimensions: Record<string, number | number[]>,
    entity: ProductEntity,
    postMounting: string
  ) {
    const { stairways } = positions;
    const postWidth = dimensions['postWidth'] as number;
    const postHeight = dimensions['postHeight'] as number;
    const translateOffsetDelta = postWidth * 1.5;
    const railHeight = entity.height / 100;
    const handRailWidth = entity.width / 100;
    let fasciaOffsetDelta = postWidth / 2;

    if (stairways.length > 0) {
      stairways.map((stairway, index) => {
        const heightOffsetDelta = stairway.handRail.needsHeightOffset
          ? railHeight / 2
          : 0;
        let heightOffset = postHeight - postWidth + heightOffsetDelta;
        if (entity.railingType[0].includes('Wood')) {
          heightOffset = postHeight + heightOffsetDelta;
        }
        if (this.topRail === '150s') {
          heightOffset = postHeight - railHeight - postWidth;
        } else if (this.topRail.includes('CompositeTop')) {
          heightOffset += railHeight / 2;
        }
        if (stairway.handRail.intermediate) {
          heightOffset += railHeight;
        }
        const stairsHandRail = mesh.clone('stairsHandRail_' + index, null);
        if (stairsHandRail) {
          stairsHandRail.position.set(
            stairway.center.x,
            stairway.center.y + heightOffset,
            stairway.center.z
          );
          if (!stairway.handRail.intermediate) {
            if (stairway.axis === 'positive') {
              stairsHandRail.translate(
                stairway.direction,
                translateOffsetDelta
              );
            } else if (stairway.axis === 'negative') {
              stairsHandRail.translate(
                stairway.direction,
                -translateOffsetDelta
              );
            } else {
              console.error('Please provide stairway axis');
            }
          }

          let length = stairway.length;
          if (postMounting === 'Fascia Mount') {
            length = stairway.fasciaLength;
          }
          let offset = { operation: 'add', delta: postWidth };
          if (stairway.handRail.intermediate) {
            offset = { operation: 'subtr', delta: postWidth * 2 };
          }
          scaleMeshByValue(stairsHandRail, length, offset, this.positionsCalc);

          orientMeshByDirectionAndAngle(
            stairsHandRail,
            stairway.direction,
            stairway.handRail.angle
          );
          this.setPositionDependsOnMountType(
            postMounting,
            stairway.fasciaDirection,
            stairsHandRail,
            stairway.fasciaCenter,
            fasciaOffsetDelta,
            heightOffset
          );
        }
      });
    }
  }

  private _buildForPlatform(
    node: AbstractMesh,
    positions: { stairways: Stairway[]; balustrades: Balustrade[] },
    dimensions: Record<string, number | number[]>,
    entity: ProductEntity,
    postMounting: string
  ) {
    const { balustrades } = positions;
    const postWidth = dimensions['postWidth'] as number;
    const postHeight = dimensions['postHeight'] as number;
    const railHeight = entity.height / 100;
    let heightOffset = postHeight + railHeight / 2;
    const handRailWidth = entity.width / 100;
    let fasciaOffsetDelta = postWidth / 2;

    if (this.topRail === '150s') {
      heightOffset = postHeight - railHeight;
    }
    if (balustrades.length > 0) {
      balustrades.map((balustrade, index) => {
        const handRailPlatform = node.clone('handRailPlatform_' + index, null);
        if (handRailPlatform) {
          handRailPlatform.position.set(
            balustrade.center.x,
            balustrade.center.y + heightOffset,
            balustrade.center.z
          );
          let length = balustrade.length;
          if (postMounting.includes('Fascia')) {
            length = balustrade.fasciaLength;
          }
          const subtrPostWidth = { operation: 'subtr', delta: postWidth };
          scaleMeshByValue(
            handRailPlatform,
            length,
            this.topRail === '150s'
              ? subtrPostWidth
              : { operation: 'add', delta: 0 },
            this.positionsCalc
          );

          orientMeshByDirectionAndAngle(
            handRailPlatform,
            balustrade.direction,
            0
          );
          this.setPositionDependsOnMountType(
            postMounting,
            balustrade.fasciaDirection,
            handRailPlatform,
            balustrade.fasciaCenter,
            fasciaOffsetDelta,
            heightOffset
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
    delta: number,
    postHeight: number
  ) {
    if (postMounting.includes('Fascia')) {
      if (direction.equals(LEFT) || direction.equals(LEFTFWD)) {
        mesh.position.x = position.x - delta;
        mesh.position.y = position.y + postHeight;
        mesh.position.z = position.z;
      } else if (direction.equals(RIGHT)) {
        mesh.position.x = position.x + delta;
        mesh.position.y = position.y + postHeight;
        mesh.position.z = position.z;
      } else if (direction.equals(FORWARD)) {
        mesh.position.x = position.x;
        mesh.position.y = position.y + postHeight;
        mesh.position.z = position.z + delta;
      } else if (direction.equals(BACKWARD)) {
        mesh.position.x = position.x;
        mesh.position.y = position.y + postHeight;
        mesh.position.z = position.z - delta;
      }
    }
  }

  remove() {
    this._handRailsRoot.dispose(false, true);
  }
}
