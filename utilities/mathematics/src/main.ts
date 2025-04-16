export const PI = 3.141592653589793;
export const TAU = 6.283185307179586;

export const SQRT_2 = 1.4142135623730951;
export const SQRT_3 = 1.7320508075688772;

export const SIN_60 = 0.8660254037844386;
export const COS_60 = 0.5;
export const SIN_45 = 0.7071067811865476;
export const COS_45 = SIN_45;
export const SIN_30 = COS_60;
export const COS_30 = SIN_60;

export function degreesToRadians(degrees: number) {
  return degrees * (TAU / 360);
}

export function radiansToDegrees(radians: number) {
  return radians * (360 / TAU);
}

export function lerp(a: number, b: number, step: number) {
  return a + step * (b - a);
}

export function dot(ax: number, ay: number, bx: number, by: number) {
  return ax * bx + ay * by;
}

export function euclideanDistance(
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  const xDifference = ax - bx;
  const yDifference = ay - by;
  return Math.sqrt(xDifference * xDifference + yDifference * yDifference);
}

export function manhattanDistance(
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

export function euclideanModulo(a: number, b: number) {
  return ((a % b) + b) % b;
}
