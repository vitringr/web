export namespace Config {
  export enum Grid {
    RECTANGLE,
    HEXAGON,
  }

  export enum DistanceMethod {
    EUCLIDEAN,
    MANHATTAN,
  }

  export enum Runtime {
    ANIMATED,
    INSTANT,
  }

  export const grid: Grid = Grid.HEXAGON;

  export const runtime: Runtime = Runtime.ANIMATED;

  export const width = 500;
  export const height = 500;

  export const cols = 40;
  export const rows = 30;

  export const cellWidth = width / cols;

  export const diagonals = false;

  export const distanceMethod: DistanceMethod = DistanceMethod.EUCLIDEAN;

  export const weights = {
    g: 2,
    t: 40,
    h: 10,
  } as const;

  export const animationStepIncrement = 0.02;

  export const colors = {
    debug: "#FF00FF",
    empty: "#313244",
    block: "#11111B",
    rough: "#116611",
    open: "#B4BEFE",
    closed: "#89B4FA",
  } as const;

  export const terrain = {
    blocks: 0.3,
    rough: 0.0,
  } as const;
}
