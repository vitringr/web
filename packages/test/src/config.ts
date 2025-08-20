export const defaultConfig = {
  width: 900,
  height: 900,

  maxElements: 3,

  duration: 3_000,

  queue: {
    x: 336,
    y: 336,
    boxWidth: 60,
    boxHeight: 240,
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
