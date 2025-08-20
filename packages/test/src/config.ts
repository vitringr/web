export const defaultConfig = {
  width: 900,
  height: 900,

  orbDuration: 300,

  orbs: {
    x: 510,
    y: 30,
    boxWidth: 80,
    boxHeight: 180,
    gap: 24,
  },

  spells: {
    triple: { x: 85, y: 850, hintX: -14 },
    double: { x: 245, y: 760, hintX: -7 },
    single: { x: 365, y: 670, hintX: 0 },
    radius: 30,
    hintScale: 0.2,
    hintGap: 15,
    gap: 80,
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
