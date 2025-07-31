export const defaultConfig = {
  canvasSize: 700,
  gridSize: 350,

  pins: 400,
  pinGap: 20,
  resetVisitsAfter: 100,

  maxIterations: 6,
  incrementIterationsAfter: 600,

  stopAfter: 22_000,

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


