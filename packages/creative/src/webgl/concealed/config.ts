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
  messNoiseEffect: 0.00004,

  textSize: 38,
  textLineHeight: 50,
  textY: 0.1,
  textMaxWidth: 540,
  text: "The necessity of concealing the Art is one of the chief anxieties of alchemists. We are sworn to secrecy by heaven and earth. An oath has been required of us to reveal nothing clearly to uninitiated beings. The sacrifice of oneself to the pursuit of knowledge is the highest tribute to the gods.",
} as const;

export type Config = typeof defaultConfig;
