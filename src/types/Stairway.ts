import { Vector3 } from 'babylonjs';

type Rail = {
  angle: number;
  needsAngleOffset: boolean;
  offset: number;
  needsHeightOffset: boolean;
  intermediate?: boolean;
};

export type Stairway = {
  points: string[][];
  fasciaPoints: string[][];
  fasciaDirection: Vector3;
  fasciaCenter: Vector3;
  fasciaLength: number;
  baseRail: Rail;
  handRail: Rail;
  center: Vector3;
  direction: Vector3;
  length: number;
  stepHeight: number;
  axis: string;
  tails: boolean;
  sectionsCenter: Vector3[];
  sectionsLengths: number[];
  sectionsAngles: number[];
  fasciaSectionsCenter: Vector3[];
  fasciaSectionsLengths: number[];
  fasciaSectionsAngles: number[];
};
