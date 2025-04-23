/**
 *
 * The ratio of a circle's circumference to its diameter.
 *
 * Also a half circle.
 */
export const PI = 3.141592653589793;
/**
 *
 * The ratio of a circle's circumference to its radius.
 *
 * Also a full circle.
 *
 * Also double PI.
 */
export const TAU = 6.283185307179586;

/**
 *
 * Square root of 2.
 *
 * Also the hypotenuse of a right triangle with side length 1.
 */
export const SQRT_2 = 1.4142135623730951;
/**
 *
 * Square root of 3.
 */
export const SQRT_3 = 1.7320508075688772;

/**
 *
 * Sine of 60 degrees.
 */
export const SIN_60 = 0.8660254037844386;

/**
 *
 * Cosine of 60 degrees.
 */
export const COS_60 = 0.5;

/**
 *
 * Sine of 45 degrees.
 */
export const SIN_45 = 0.7071067811865476;

/**
 *
 * Cosine of 45 degrees (√2/2).
 */
export const COS_45 = SIN_45;

/**
 *
 * Sine of 30 degrees.
 */
export const SIN_30 = COS_60;

/**
 *
 * Cosine of 30 degrees.
 */
export const COS_30 = SIN_60;

/**
 *
 * Converts degrees to radians.
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
export function degreesToRadians(degrees: number) {
  return degrees * (TAU / 360);
}

/**
 *
 * Converts radians to degrees.
 * @param radians Angle in radians
 * @returns Angle in degrees
 */
export function radiansToDegrees(radians: number) {
  return radians * (360 / TAU);
}

/**
 *
 * Performs linear interpolation between two numbers.
 * @param a Start value
 * @param b End value
 * @param step Interpolation factor (0 = a, 1 = b)
 * @returns Interpolated value between a and b
 */
export function lerp(a: number, b: number, step: number) {
  return a + step * (b - a);
}

/**
 *
 * Calculates the dot product of two 2D vectors.
 * @param ax X component of first vector
 * @param ay Y component of first vector
 * @param bx X component of second vector
 * @param by Y component of second vector
 * @returns Dot product of the vectors
 */
export function dot(ax: number, ay: number, bx: number, by: number) {
  return ax * bx + ay * by;
}

/**
 *
 * Calculates Euclidean distance between two 2D points.
 * @param ax X coordinate of first point
 * @param ay Y coordinate of first point
 * @param bx X coordinate of second point
 * @param by Y coordinate of second point
 * @returns Straight-line distance between points
 */
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

/**
 *
 * Calculates Manhattan distance between two 2D points.
 * @param ax X coordinate of first point
 * @param ay Y coordinate of first point
 * @param bx X coordinate of second point
 * @param by Y coordinate of second point
 * @returns Sum of absolute differences along each axis
 */
export function manhattanDistance(
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

/**
 *
 * Calculates Euclidean modulo (always positive remainder).
 * @param a Dividend
 * @param b Divisor
 * @returns Positive remainder of a divided by b
 */
export function euclideanModulo(a: number, b: number) {
  return ((a % b) + b) % b;
}
