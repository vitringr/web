export class Cell {
  readonly x: number;
  readonly y: number;

  readonly type: Cell.Type = Cell.Type.Empty;
  readonly list: Cell.List = Cell.List.None;

  readonly neighbors: Cell.Neighbor[] = [];

  g: number = 0; // movement
  t: number = 0; // terrain
  h: number = 0; // distance
  f: number = 0; // total

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export namespace Cell {
  export enum Type {
    Empty,
    Terrain,
    Block,
  }

  export enum List {
    None,
    Open,
    Closed,
  }

  export type Neighbor = {
    cell: Cell;
    moveCost: number;
  } | null;
}
