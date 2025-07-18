export const defaultConfig = {
  width: 800,
  height: 800,

  size: {
    min: 0.3,
    max: 2.6,
  },

  returnSpeed: {
    min: 0.01,
    max: 0.03,
  },

  repelRadius: 0.08,
  repelSpeed: 0.001,

  textSize: 42,
  textLineHeight: 50,
  textY: 0.13,
  textMaxWidth: 700,
  // text: 'You know, the more I think about it, the more I believe that no one is actually worried about AIs taking over the world or anything like that, no matter what they say. What they\'re really worried about is that someone might prove, once and for all, that consciousness can arise from matter. And I kind of understand why they find it so terrifying. If we can create a sentient being, where does that leave the soul? Without mystery, how can we see ourselves as anything other than machines? And if we are machines, what hope do we have that death is not the end? What really scares people is not the artificial intelligence in the computer, but the "natural" intelligence they see in the mirror.',
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
} as const;

export type Config = typeof defaultConfig;

