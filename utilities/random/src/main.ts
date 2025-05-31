/**
 * Returns a random boolean value with 50% probability of being true or false
 */
export function bool(): boolean {
  return Math.random() >= 0.5;
}

/**
 * Returns true with a given probability between 0 (never) and 1 (always)
 * @param percent The probability threshold (0 to 1 inclusive)
 */
export function chance(percent: number): boolean {
  return Math.random() <= percent;
}

/**
 * Returns a random floating-point number within a specified range
 * @param from The lower bound (inclusive)
 * @param to The upper bound (exclusive)
 */
export function range(from: number, to: number): number {
  return from + Math.random() * (to - from);
}

/**
 * Returns a random integer within a specified range
 * @param from The lower bound (inclusive)
 * @param to The upper bound (exclusive)
 */
export function rangeInt(from: number, to: number): number {
  return Math.floor(range(from, to));
}
