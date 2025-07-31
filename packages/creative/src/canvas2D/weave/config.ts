export const defaultConfig = {
  canvasSize: 800,
  gridSize: 400,

  pins: 500,
  pinGap: 20,
  resetVisitsAfter: 200,

  maxIterations: 6,
  incrementIterationsAfter: 500,

  stopAfter: 30_000,

  inverseColor: false,

  lineWidth: 0.15,

  colors: {
    background: "#EEEED0",
    lines: "#00000050",
    // background: "#000000",
    // lines: "#EEEED050",
  },
};

export type Config = typeof defaultConfig;


