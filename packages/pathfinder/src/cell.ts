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

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  private _updateF() {
    this._f = this._g * gWeight + this._t * tWeight + this._h * hWeight;
  }

  getG() {
    return this._g;
  }
  setG(value: number) {
    this._g = value;
    this._updateF();
  }
  getT() {
    return this._t; // TODO: turn this into a gradient
  }
  setT(value: number) {
    this._t = value;
    this._updateF();
  }
  getH(): number {
    return this._h;
  }
  setH(value: number) {
    this._h = value;
    this._updateF();
  }
  getF() {
    return this._f;
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
