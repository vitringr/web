export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function measureFunction(func: () => void, label: string): number {
  const start = performance.now();
  func();
  const end = performance.now();
  const elapsed = end - start;

  console.log(`${label}: ${elapsed.toFixed(3)}ms`);
  return elapsed;
}

export function stackOverflow() {
  stackOverflow();
}

type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

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
