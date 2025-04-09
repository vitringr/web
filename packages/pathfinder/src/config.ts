export namespace Config {
  export enum DistanceMethod {
    EUCLIDEAN,
    MANHATTAN,
  }

  export enum Runtime {
    INSTANT,
    ANIMATED,
  }

  export const runtime: Runtime = Runtime.ANIMATED;

  export const width = 600;
  export const height = 600;

  export const cols = 50;
  export const rows = 50;

  export const cellWidth = width / rows;

  export const diagonals = false;

  export const colors = {
    debug: "#FF00FF",
    empty: "#313244",
    block: "#11111B",
    rough: "#116611",
    open: "#B4BEFE",
    closed: "#89B4FA",
  };

  export const terrain = {
    blocks: 0.3,
    rough: 0.0,
  } as const;

  export const algorithm = {
    distanceMethod: DistanceMethod.MANHATTAN as DistanceMethod,
    weights: {
      g: 2,
      t: 40,
      h: 10,
    },
  } as const;
}
