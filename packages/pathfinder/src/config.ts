export namespace Config {
  export enum DistanceMethod {
    EUCLIDEAN,
    MANHATTAN,
  }

  export const cols = 50;
  export const rows = 50;

  export const diagonals = false;

  export const terrain = {
    blocks: 0.1,
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
