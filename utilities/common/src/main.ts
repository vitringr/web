/**
 *
 * Waits for the specified number of milliseconds.
 * @param ms Number of milliseconds to wait
 * @returns Promise that resolves after the delay
 */
export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 *
 * Measures and logs the execution time of a function.
 * @param func Function to measure
 * @param label Label for the measurement
 * @returns Execution time in milliseconds
 */
export function measureFunction(func: () => void, label: string): number {
  const start = performance.now();
  func();
  const end = performance.now();
  const elapsed = end - start;

  console.log(`${label}: ${elapsed.toFixed(3)}ms`);
  return elapsed;
}

/**
 *
 * Intentionally causes a stack overflow by infinite recursion.
 * WARNING: Will crash your program.
 */
export function stackOverflow() {
  stackOverflow();
}

/**
 *
 * Represents a successful operation result.
 */
type Success<T> = {
  data: T;
  error: null;
};

/**
 *
 * Represents a failed operation result.
 */
type Failure<E> = {
  data: null;
  error: E;
};

/**
 *
 * Discriminated union type representing either success or failure.
 */
type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 *
 * Safely wraps a promise to always return a Result type.
 * @param promise Promise to execute
 * @returns Result object containing either data or error
 */
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}
