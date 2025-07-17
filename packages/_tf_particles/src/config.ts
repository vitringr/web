export type Config = {
  canvasWidth: number;
  canvasHeight: number;

  particles: number;
  minSize: number,
  maxSize: number,
  minSpeed: number;
  maxSpeed: number;
};

export const defaultConfig: Config = {
  canvasWidth: 800,
  canvasHeight: 800,

  particles: 10000,
  minSize: 1.0,
  maxSize: 2.0,
  minSpeed: 0.0005,
  maxSpeed: 0.001,
} as const;
