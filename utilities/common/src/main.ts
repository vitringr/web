export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function measureFunctionTime(func: () => void, label: string): number {
  const start = performance.now();
  func();
  const end = performance.now();
  const elapsed = end - start;

  console.log(`${label}: ${elapsed.toFixed(3)}ms`);
  return elapsed;
}
