import { CellList, CellType, ICell, Neighbor } from "./interfaces/cell.interface";
import config from "./config";

const gWeight = config.pathfinding.weights.g;
const tWeight = config.pathfinding.weights.t;
const hWeight = config.pathfinding.weights.h;
const animation = config.display.animation.active ? 0 : 1;

export class Cell implements ICell {
  private _type: CellType = CellType.Empty;
  private _list: CellList = CellList.None;
  private _isPath: boolean = false;

  private _g: number = 0; // movement
  private _t: number = 0; // terrain
  private _h: number = 0; // distance
  private _f: number = 0; // total

  private _neighbors: Neighbor[] = [];

  private _parent: Cell | null = null;

  private _displayMark: boolean = false;
  private _animationStep: number = 0;

  constructor(
    readonly x: number,
    readonly y: number,
  ) {}

  // State:

  isType(type: CellType) {
    return this._type === type;
  }
  setType(type: CellType) {
    this._type = type;
  }

  inList(list: CellList) {
    return this._list === list;
  }
  setList(list: CellList) {
    this._list = list;
  }

  isPath() {
    return this._isPath;
  }
  setPath(path: boolean) {
    this._isPath = path;
  }

  // Heuristics:

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

  // Connections:

  getParent() {
    return this._parent;
  }
  setParent(cell: Cell) {
    this._parent = cell as Cell;
  }

  getNeighbors() {
    return this._neighbors;
  }
  setNeighbors(neighbors: Neighbor[]) {
    this._neighbors = neighbors;
  }

  // Display:

  shouldDisplay() {
    return this._displayMark;
  }
  markDisplay() {
    this._displayMark = true;
    this._resetAnimation();
  }
  private unmarkDisplay() {
    this._displayMark = false;
  }

  private _resetAnimation() {
    this._animationStep = animation;
  }
  incrementAnimation(value: number) {
    this._animationStep += value;
    if (this._animationStep >= 1) {
      this.unmarkDisplay();
      this._animationStep = 1;
    }
    return this._animationStep;
  }
  skipAnimation() {
    this._animationStep = 1;
  }

  // Misc:

  equals(otherCell: ICell): boolean {
    if (this.x === otherCell.x && this.y === otherCell.y) return true;
    return false;
  }
}
