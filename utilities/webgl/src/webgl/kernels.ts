export function computeKernelWeight(kernel: number[]) {
  const weight = kernel.reduce((prev, curr) => prev + curr);
  return weight <= 0 ? 1 : weight;
}

export const matrices3x3 = {
  identity: [
    0, 0, 0,
    0, 1, 0,
    0, 0, 0,
  ] as const,

  blur: [
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111,
  ] as const,

  emboss: [
    -2, -1, 0,
    -1, 1, 1,
    0, 1, 2,
  ] as const,

  sharpen: [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0,
  ] as const,

  edgeDetection: [
    -1, -1, -1,
    -1, 8, -1,
    -1, -1, -1,
  ] as const,

  horizontalEdgeDetection: [
    -1, -1, -1,
    0, 0, 0,
    1, 1, 1,
  ] as const,

  verticalEdgeDetection: [
    -1, 0, 1,
    -1, 0, 1,
    -1, 0, 1,
  ] as const,
};
