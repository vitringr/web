export const defaultConfig = {
  width: 900,
  height: 900,

  timeIncrement: 1,

  colors: {
    background: "#151515",
  },
};

export type Config = typeof defaultConfig;

export enum Keys {
  Q = "q",
  W = "w",
  E = "e",

  J = "j",
  K = "k",
}
