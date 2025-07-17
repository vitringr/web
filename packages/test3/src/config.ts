export type Config = {
  canvasWidth: number;
  canvasHeight: number;

  particles: number;
  size: number;
  speed: number;
};

export const defaultConfig: Config = {
  canvasWidth: 600,
  canvasHeight: 600,

  particles: 10_000,
  size: 3.0,
  speed: 0.001,
} as const;
