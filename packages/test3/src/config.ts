export const defaultConfig = {
  width: 800,
  height: 800,

  size: {
    min: 0.5,
    max: 3.0,
  },

  returnSpeed: {
    min: 0.01,
    max: 0.03,
  },

  repelSpeed: {
    min: 0.1,
    max: 0.3,
  },

  repelRadius: 0.06,

  textSize: 28,
  textLineHeight: 32,
  textY: 0.24,
  textMaxWidth: 600,
  text: 'You know, the more I think about it, the more I believe that no one is actually worried about AIs taking over the world or anything like that, no matter what they say. What they\'re really worried about is that someone might prove, once and for all, that consciousness can arise from matter. And I kind of understand why they find it so terrifying. If we can create a sentient being, where does that leave the soul? Without mystery, how can we see ourselves as anything other than machines? And if we are machines, what hope do we have that death is not the end? What really scares people is not the artificial intelligence in the computer, but the "natural" intelligence they see in the mirror.',
} as const;

export type Config = typeof defaultConfig;
