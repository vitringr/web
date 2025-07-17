export const defaultConfig = {
  width: 800,
  height: 800,

  particles: 5817,
  minSize: 0.5,
  maxSize: 3.0,
  minSpeed: 0.0002,
  maxSpeed: 0.0008,

  text: "Random",
  textSize: 80,
  auxCanvasScale: 1.0,
} as const;

export type Config = typeof defaultConfig;
