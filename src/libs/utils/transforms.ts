import { AbstractMesh, TransformNode, Vector3 } from 'babylonjs';
import { BACKWARD, FORWARD, LEFT, RIGHT } from './constants';
import { PositionsCalculator } from '../logic/positionsCalculator';
import * as R from 'ramda';

export const orientMeshByDirectionAndAngle = (
  mesh: AbstractMesh,
  direction: Vector3,
  angle: number = 0
): void => {
  if (mesh && direction) {
    switch (true) {
      case direction.equals(FORWARD):
        mesh.rotate(new Vector3(0, 1, 0), Math.PI / 2);
        mesh.rotate(direction, angle);
        break;
      case direction.equals(BACKWARD):
        mesh.rotate(new Vector3(0, 1, 0), -Math.PI / 2);
        mesh.rotate(direction, angle); //TODO if angle > 0 add Math.PI
        break;
      case direction.equals(LEFT):
        mesh.rotate(new Vector3(0, 0, -1), angle);
        break;
      case direction.equals(RIGHT):
        mesh.rotate(new Vector3(0, 0, -1), angle);
        break;
    }
  } else {
    console.error('Mesh || Direction is undefined or not provided');
  }
};
export const scaleMeshByValue = (
  mesh: AbstractMesh,
  value: number,
  offset: { operation: string; delta: number },
  calculator: PositionsCalculator,
  parameter: string = 'length'
): void => {
  if (mesh && value && offset) {
    if (parameter === 'length') {
      const meshSize: number = calculator.meshSizeInMeters(mesh).length;
      const calculatedLength =
        offset.operation == 'subtr'
          ? R.subtract(value, offset.delta)
          : R.add(value, offset.delta);

      if (meshSize < value) {
        do {
          mesh.scaling.x += 0.01;
        } while (calculator.meshSizeInMeters(mesh).length < calculatedLength);
      } else {
        do {
          mesh.scaling.x -= 0.01;
        } while (calculator.meshSizeInMeters(mesh).length > calculatedLength);
      }
    } else {
      const meshSize: number = calculator.meshSizeInMeters(mesh).depth;

      const calculatedLength =
        offset.operation == 'subtr'
          ? R.subtract(value, offset.delta)
          : R.add(value, offset.delta);

      if (meshSize < value) {
        do {
          mesh.scaling.y += 0.01;
          console.log('plus', calculator.meshSizeInMeters(mesh));
        } while (calculator.meshSizeInMeters(mesh).height < calculatedLength);
      } else {
        do {
          mesh.scaling.y -= 0.01;
          console.log('minus', calculator.meshSizeInMeters(mesh));
        } while (calculator.meshSizeInMeters(mesh).height > calculatedLength);
      }
    }
  } else {
    if (!mesh) {
      console.error('Mesh is undefined or not provided');
    }
    if (!value) {
      console.error('Value is undefined or not provided');
    }
    if (!offset) {
      console.error('Offset is undefined or not provided');
    }
  }
};
export const setPositionDependsOnDirection = (
  direction: Vector3,
  mesh: TransformNode | AbstractMesh,
  delta: number
) => {
  if (direction.equals(LEFT)) {
    mesh.position.x -= delta;
  } else if (direction.equals(RIGHT)) {
    mesh.position.x += delta;
  } else if (direction.equals(FORWARD)) {
    mesh.position.z += delta;
  } else if (direction.equals(BACKWARD)) {
    mesh.position.z -= delta;
  }
};
