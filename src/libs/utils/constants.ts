import { Vector3 } from 'babylonjs';

export const FORWARD = Vector3.Forward();
export const BACKWARD = Vector3.Backward(); // -Z
export const LEFT = Vector3.Left(); // -X
export const LEFTFWD = new Vector3(-1, 0, 1); // -X
export const RIGHT = Vector3.Right(); // +X
