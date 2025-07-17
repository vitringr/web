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
  minSize: 0.5,
  maxSize: 3.0,
  minSpeed: 0.0002,
  maxSpeed: 0.0008,
} as const;
