export const defaultConfig = {
  width: 800,
  height: 800,

  gridWidth: 400,
  gridHeight: 400,

  radiusGap: 10,

  imageScale: 1,
  imageXOffset: 0,
  imageYOffset: 0,

  pins: 500,
  pinGap: 20,
  resetVisitsAfter: 200,

  maxIterations: 6,
  incrementIterationsAfter: 500,

  stopAfter: 30_000,

  inverseColor: false,

  lineWidth: 0.15,

  colors: {
    // background: "#EEEED0",
    // lines: "#00000050",
    background: "#000000",
    lines: "#EEEED050",
  },
};

export type Config = typeof defaultConfig;
