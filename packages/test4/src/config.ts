export const defaultConfig = {
  width: 800,
  height: 800,

  size: {
    min: 0.3,
    max: 2.6,
  },

  returnSpeed: {
    min: 0.004,
    max: 0.012,
  },

  repelRadius: 0.07,
  repelSpeed: 0.01,

  noiseFrequency: 4,
  timeIncrement: 0.001,
  textNoiseEffect: 0.0001,
  messNoiseEffect: 0.00004,

  textSize: 48,
  textLineHeight: 58,
  textY: 0.16,
  textMaxWidth: 640,
  text: "The necessity of concealing the Art is one of the chief anxieties of alchemists. We are sworn to secrecy by heaven and earth.  An oath has been required of us to reveal nothing clearly to any uninitiated being. The sacrifice of oneself to the pursuit of knowledge is the highest tribute to the gods.",
} as const;

export type Config = typeof defaultConfig;
