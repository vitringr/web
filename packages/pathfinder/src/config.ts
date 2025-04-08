export namespace Config {
  export enum DistanceMethod {
    EUCLIDEAN,
    MANHATTAN,
  }

  export const width = 500;
  export const height = 500;

  export const cols = 50;
  export const rows = 50;

  export const cellWidth = 10;

  export const diagonals = false;

  export const terrain = {
    blocks: 0.3,
    rough: 0.1,
  } as const;

  export const algorithm = {
    distanceMethod: DistanceMethod.EUCLIDEAN,
    weights: {
      g: 2,
      t: 40,
      h: 10,
    },
  } as const;
}
