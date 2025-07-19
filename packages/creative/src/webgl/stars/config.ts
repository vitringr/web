export const defaultConfig = {
  width: 800,
  height: 800,

  particles: 1200,

  minSize: 0.2,
  maxSize: 2.4,
  minSpeed: 0.00005,
  maxSpeed: 0.0003,
} as const;

export type Config = typeof defaultConfig;
