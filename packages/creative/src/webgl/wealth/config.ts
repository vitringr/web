export const defaultConfig = {
  width: 600,
  height: 600,

  size: {
    min: 0.3,
    max: 2.6,
  },

  returnSpeed: {
    min: 0.004,
    max: 0.012,
  },

  repelRadius: 0.06,
  repelSpeed: 0.003,

  noiseFrequency: 4,
  timeIncrement: 0.001,
  textNoiseEffect: 0.0001,
  messNoiseEffect: 0.00003,

  textSize: 34,
  textLineHeight: 44,
  textY: 0.115,
  textMaxWidth: 490,
  text: "The masses clamor for gold, begging us to turn their leaden coins to wealth. Little do they know - we who master the Art seek to transmute something far more precious. They think our Art is about turning lead into gold, when truly it is about turning fools into sages. The first is impossible; the second merely improbable. ",
};

export type Config = typeof defaultConfig;
