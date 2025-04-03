export function bool(): boolean {
  return Math.random() >= 0.5;
}

export function percent(percentage: number): boolean {
  return Math.random() <= percentage * 0.01;
}

export function range(from: number, to: number): number {
  return from + Math.random() * (to - from);
}

export function rangeInt(from: number, to: number): number {
  return Math.floor(range(from, to));
}
