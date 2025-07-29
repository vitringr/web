export const defaultConfig = {
  width: 800,
  height: 800,

  gridWidth: 300,
  gridHeight: 300,
  imageScale: 0.8,

  pins: 300,
  pinGap: 80,
  resetVisitsAfter: 50,

  lineWidth: 0.2,

  stopAfter: 20_000,

  imageMinColor: 150,
  imageInverse: false,

  averageColor: true,

  colors: {
    background: "#AAAAAA",
    lines: "#00000050",
  },

  debug: {
    renderMain: false,
    renderImageData: true,
    renderPins: true,
    renderConnections: false,
    renderLattice: false,

    latticeLineWidth: 0.2,
    connectionsLineWidth: 0.1,

    colors: {
      lattice: "#888888",
      connections: "#CC0000",

      pins: "#FFAA10",

      imageWhite: "#000000",
      imageDark: "#FFFFFF"

    },
  },
};

export type Config = typeof defaultConfig;
