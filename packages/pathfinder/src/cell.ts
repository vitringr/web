import { Config } from "./config";

export class Cell {
  readonly x: number;
  readonly y: number;

  readonly neighbors: Cell.Neighbor[] = [];

  type: Cell.Type = Cell.Type.Empty;
  list: Cell.List = Cell.List.None;

  g: number = 0; // movement
  t: number = 0; // terrain
  h: number = 0; // distance
  f: number = 0; // total

  toRender: boolean = true;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  sumF() {
    this.f = this.g * Config.weights.g + this.t * Config.weights.t + this.h * Config.weights.h;
  }

  isEqual(otherCell: Cell) {
    return this.x === otherCell.x && this.y === otherCell.y;
  }
}

export namespace Cell {
  export enum Type {
    Empty,
    Rough,
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
