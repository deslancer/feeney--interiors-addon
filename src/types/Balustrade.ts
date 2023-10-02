import { Vector3 } from 'babylonjs';

export type Balustrade = {
  points: string[][];
  fasciaPoints: string[][];
  fasciaDirection: Vector3;
  fasciaCenter: Vector3;
  fasciaLength: number;
  center: Vector3;
  direction: Vector3;
  length: number;
  stepHeight: number;
  sectionsCenter: Vector3[];
  sectionsLengths: number[];
  fasciaSectionsCenter: Vector3[];
  fasciaSectionsLengths: number[];
};
