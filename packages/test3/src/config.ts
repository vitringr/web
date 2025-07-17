export const defaultConfig = {
  width: 800,
  height: 800,

  minSize: 0.5,
  maxSize: 3.0,
  // minSpeed: 0.003,
  // maxSpeed: 0.008,
  minSpeed: 0.02,
  maxSpeed: 0.04,

  textSize: 28,
  textLineHeight: 32,
  textY: 0.25,

  text: 'You know, the more I think about it, the more I believe that no one is actually worried about AIs taking over the world or anything like that, no matter what they say. What they\'re really worried about is that someone might prove, once and for all, that consciousness can arise from matter. And I kind of understand why they find it so terrifying. If we can create a sentient being, where does that leave the soul? Without mystery, how can we see ourselves as anything other than machines? And if we are machines, what hope do we have that death is not the end? What really scares people is not the artificial intelligence in the computer, but the "natural" intelligence they see in the mirror.',
} as const;

export type Config = typeof defaultConfig;
