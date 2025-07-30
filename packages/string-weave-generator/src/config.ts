// TODO: Remove unecessary

// TODO: Should always be a square, since it's drawn
// around a circle. So refactor the width/height into
// a single size.

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
    background: "#EEEED0",
    lines: "#00000050",
  },

  debug: {
    renderImageData: false,
    renderConnections: false,
    renderLattice: false,
    renderPins: false,

    latticeLineWidth: 0.2,
    connectionsLineWidth: 0.1,

    pinSize: 3,

    colors: {
      lattice: "#888888",
      connections: "#CC0000",

      pins: "#FFAA00",

      imageWhite: "#000000",
      imageDark: "#FFFFFF",
    },
  },
};

export type Config = typeof defaultConfig;
