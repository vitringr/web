export namespace Config {
  export const debug = false;

  export const columns: number = 130;
  export const walls: boolean = true;
  //export const spawnerSize: number = 0.014;
  export const spawnerSize: number = 0.04;

  export const limitFPS: boolean = false;
  export const FPS: number = 60;

  export const borderSize: number = -0.02;

  export const maxSoakedCells: number = 2;
  export const soakPerAbsorb: number = 10;

  export enum Elements {
    DEBUG = 0,
    EMPTY = 1,
    BLOCK = 2,
    SAND = 3,
    WATER = 4,
    ICE = 5,
    STEAM = 6,
    FIRE = 7,
  }

  export enum SpawnKeys {
    NONE = -1,
    NUM_0 = Elements.DEBUG,
    NUM_1 = Elements.BLOCK,
    NUM_2 = Elements.BLOCK,
    NUM_3 = Elements.SAND,
    NUM_4 = Elements.WATER,
    NUM_5 = Elements.ICE,
    NUM_6 = Elements.STEAM,
    NUM_7 = Elements.FIRE,
  }
}
