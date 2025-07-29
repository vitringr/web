export const defaultConfig = {
  width: 800,
  height: 800,

  gridWidth: 80,
  gridHeight: 80,

  pins: 300,

  pinGap: 50,

  colors: {
    lattice: "#888888",
  },
};

export type Config = typeof defaultConfig;
