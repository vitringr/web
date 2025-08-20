export const defaultConfig = {
  width: 900,
  height: 900,

  maxElements: 3,

  maxDuration: 300,

  queue: {
    x: 490,
    y: 30,
    boxWidth: 80,
    boxHeight: 180,
    gap: 24,
  },

  colors: {
    background: "#151515",

    stroke: "#AAAAAA",

    Q: "#11AAFF",
    W: "#CC11CC",
    E: "#FF6611",
  },
};

export type Config = typeof defaultConfig;
