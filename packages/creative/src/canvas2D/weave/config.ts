export const defaultConfig = {
  width: 800,
  height: 800,

  gridWidth: 80,
  gridHeight: 80,

  pins: 20,

  pinGap: 4,

  colors: {
    lattice: "#888888",
  },
};

export type Config = typeof defaultConfig;
