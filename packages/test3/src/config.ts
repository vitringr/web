export const defaultConfig = {
  width: 800,
  height: 800,

  minSize: 1.0,
  maxSize: 2.0,
  // minSpeed: 0.0002,
  // maxSpeed: 0.0008,
  minSpeed: 0.002,
  maxSpeed: 0.008,

  text: "Cognitive bias about how people with limited competence in a particular domainan misjudge their abilities.",
  textSize: 30,
} as const;

export type Config = typeof defaultConfig;
