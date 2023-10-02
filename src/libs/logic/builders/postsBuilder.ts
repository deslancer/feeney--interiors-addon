import {
  AbstractMesh,
  MeshAssetTask,
  Scene,
  TransformNode,
  Vector3,
} from 'babylonjs';
import { useFeeneyStore } from '../../store/store';
import { Singleton } from '../../../decorators/singleton';
import {
  Balustrade,
  PlacementPoints,
  PostsPositionTypes,
  RailingComponentsBuilder,
  Stairway,
} from '../../../types';
import { BACKWARD, FORWARD, LEFT, LEFTFWD, RIGHT } from '../../utils/constants';
import { setDefaultMaterial } from '../../utils/materials';

export interface PostArgs {
  postTask: MeshAssetTask | undefined;
  cornerPostTask: MeshAssetTask | undefined;
  positions: PlacementPoints;
  dimensions: Record<string, number | number[]>;
}

@Singleton
export class PostsBuilder implements RailingComponentsBuilder<PostArgs> {
  private readonly scene: Scene | undefined = undefined;
  private readonly _postsRoot: TransformNode;
  private postWidth: number = 0;
  private halfHeight: number = 0;
  private railingType: string[] = [];

  constructor() {
    this.scene = useFeeneyStore.getState().scene;
    this._postsRoot = new TransformNode('PostsGroup', this.scene);
  }

  build(postsArgs: PostArgs) {
    const { postTask, cornerPostTask, positions, dimensions } = postsArgs;
    const { postMounting, railingType } = useFeeneyStore.getState();
    //console.log(postMounting);
    this.railingType = railingType;
    const stairways = positions[PostsPositionTypes.STAIRS]
      .stairways as Stairway[];
    const balustrades = positions[PostsPositionTypes.PLATFORM]
      .balustrades as Balustrade[];
    this.halfHeight = dimensions['postHalfHeight'] as number;
    this.postWidth = dimensions['postWidth'] as number;
    if (postTask) {
      postTask.onSuccess = (task) => {
        const post = task.loadedMeshes.find((node) =>
          node.name.includes('root')
        );

        if (post) {
          post.name = 'Post';
          setDefaultMaterial(post, this.railingType);

          post.isVisible = false;

          if (stairways.length > 0) {
            stairways.map((stairway) => {
              let points = stairway.points;
              if (postMounting.includes('Fascia')) {
                points = stairway.fasciaPoints;
              }
              points.map((point, index) => {
                const stairsPost = post.clone(
                  'stairsPost_' + index,
                  this._postsRoot
                );

                if (stairsPost) {
                  const direction = stairway.fasciaDirection;

                  this.setPositionAndRotation(
                    stairsPost,
                    point,
                    direction,
                    postMounting,
                    railingType
                  );
                }
              });
            });
          }
          if (balustrades.length > 0) {
            balustrades.map((balustrade) => {
              let points = balustrade.points;
              if (postMounting.includes('Fascia')) {
                points = balustrade.fasciaPoints;
              }
              points.map((point, index) => {
                const balustradePost = post.clone(
                  'balustradePost_' + index,
                  this._postsRoot
                );
                if (balustradePost) {
                  const direction = balustrade.fasciaDirection;

                  this.setPositionAndRotation(
                    balustradePost,
                    point,
                    direction,
                    postMounting,
                    railingType
                  );
                }
              });
            });
          }
          post.dispose();
        }
      };
      postTask.onError = (task, message, exception) => {
        console.log(message, exception);
      };
    }
    if (cornerPostTask) {
      cornerPostTask.onSuccess = (task) => {
        const cornerPost = task.loadedMeshes.find((node) =>
          node.name.includes('root')
        );
        if (cornerPost) {
          cornerPost.dispose();
          /*  const material = cornerPost.getChildMeshes()[0]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          .material as PBRMaterial;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        if (material) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          material.name = 'Black Mat';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          material.albedoColor = Color3.Black();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          material.metallic = 1.0;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        console.log(cornerPoints);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        if (cornerPoints.length > 0) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          cornerPoints.map((point, index) => {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            const post = cornerPost.clone('cornerPost_' + index, null);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            if (post) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              cornerPost.position.set(point.x, point.y + halfHeight, point.z);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              cornerPost.parent = this._postsRoot;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }*/
        }
      };
      cornerPostTask.onError = (task, message, exception) => {
        console.log(message, exception);
      };
    }
  }

  private setPositionAndRotation(
    mesh: AbstractMesh,
    point: string[],
    direction: Vector3,
    postMounting: string,
    railingType: string[]
  ) {
    mesh.position.set(+point[0], +point[1] + this.halfHeight, +point[2]);
    let delta = this.postWidth / 2;

    if (postMounting.includes('Fascia')) {
      if (direction.equals(LEFT) || direction.equals(LEFTFWD)) {
        mesh.position.x -= delta;
        mesh.rotate(Vector3.Up(), -Math.PI / 2);
      } else if (direction.equals(RIGHT)) {
        mesh.position.x += delta;
        mesh.rotate(Vector3.Up(), Math.PI / 2);
      } else if (direction.equals(FORWARD)) {
        mesh.position.z += delta;
      } else if (direction.equals(BACKWARD)) {
        mesh.position.z -= delta;
        mesh.rotate(Vector3.Up(), -Math.PI);
      }
    }
  }

  remove() {
    this._postsRoot.dispose(false, true);
  }
}
