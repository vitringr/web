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

  export const width = 900;
  export const height = 600;

  export const cols = 60;
  export const rows = 40;

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
    blocks: 0.3,
    // blocks: 0,
    rough: 0,
  } as const;
}
