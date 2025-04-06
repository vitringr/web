export enum CellType {
  Empty,
  Terrain,
  Block,
}

export enum CellList {
  None,
  Open,
  Closed,
}

export interface ICell {
  readonly x: number;
  readonly y: number;

  isType(type: CellType): boolean;
  // TODO: will not need a terrain type if every cell can be terrain
  setType(type: CellType): void;
  inList(list: CellList): boolean;
  setList(list: CellList): void;
  isPath(): boolean;
  setPath(path: boolean): void;

  getG(): number;
  setG(value: number): void;
  getT(): number;
  setT(value: number): void;
  getH(): number;
  setH(value: number): void;
  getF(): number;

  getParent(): ICell | null;
  setParent(cell: ICell): void;

  getNeighbors(): Neighbor[];
  setNeighbors(neighbors: Neighbor[]): void;

  shouldDisplay(): boolean;
  markDisplay(): void;
  incrementAnimation(value: number): number;
  skipAnimation(): void;

  equals(otherCell: ICell): boolean;
}

export type Neighbor = {
  cell: ICell;
  moveCost: number;
} | null;
