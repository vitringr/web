export const defaultConfig = {
  width: 800,
  height: 800,

  size: {
    min: 0.3,
    max: 2.6,
  },

  returnSpeed: {
    min: 0.008,
    max: 0.024,
  },

  repelRadius: 0.08,
  repelSpeed: 0.01,

  textSize: 38,
  textLineHeight: 48,
  textY: 0.13,
  textMaxWidth: 680,
  text: "The question is not what you look at, but what you truly see. For the eye observes only what the mind is prepared to comprehend. Light and shadow, shape and color, are meaningless until interpreted. We do not perceive the world as it is; we perceive it as we are. Our knowledge becomes the lens through which reality is filtered. To see more, then, is not to look harder, but to understand more deeply. For vision is not a gift of the eyes alone, but of the mind behind them.",
} as const;

export type Config = typeof defaultConfig;
