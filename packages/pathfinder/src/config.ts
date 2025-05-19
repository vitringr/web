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

  export const width = 600;
  export const height = 600;

  export const cols = 30;
  export const rows = 34;

  export const cellWidth = width / cols;

  export const diagonals = false;

  export const distanceMethod: DistanceMethod = DistanceMethod.EUCLIDEAN;

  export const weights = {
    moveCost: 1,
    distanceCost: 1.5,
    terrainCost: 0,
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
    blocks: 0.4,
    rough: 0,

    noiseScalar: 0.27,
  } as const;
}
