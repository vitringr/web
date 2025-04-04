import { CellList, CellType, ICell } from "../interfaces/cell.interface";
import { IPathfinder } from "../interfaces/pathfinder.interface";
import { Utilities } from "../libs/utils/utilities";

export class AStar implements IPathfinder {
  private readonly _open: ICell[] = [];
  private readonly _closed = new Set<ICell>();

  private _ended: boolean = false;

  constructor(
    start: ICell,
    private readonly target: ICell,
  ) {
    this._open.push(start);
    start.setList(CellList.Open);
  }

  private _getBestFromOpen() {
    let minFCell = this._open[0];
    for (let i = 1; i < this._open.length; i++) {
      const cell = this._open[i];
      if (cell.getF() < minFCell.getF()) minFCell = cell;
    }
    return minFCell;
  }

  private _reconstructPathFrom(cell: ICell) {
    let current: ICell | null = cell;
    while (current) {
      current.setPath(true);
      current.markDisplay();
      current = current.getParent();
    }
  }

  private _end() {
    this._ended = true;
  }

  hasEnded(): boolean {
    return this._ended;
  }

  iterate() {
    if (this._ended) return;

    if (this._open.length <= 0) {
      this._end();
      return;
    }

    let current = this._getBestFromOpen();

    if (current.equals(this.target)) {
      this._end();
      this._open.length = 0;
      this._reconstructPathFrom(current);
      return;
    }

    Utilities.removeFromArray(this._open, current);
    this._closed.add(current);
    current.setList(CellList.Closed);
    current.markDisplay();

    const neighbors = current.getNeighbors();
    for (let n = 0; n < neighbors.length; n++) {
      const exists = neighbors[n];
      if (!exists) continue;

      const neighbor = exists.cell;
      const moveCost = exists.moveCost;

      if (!neighbor || neighbor.isType(CellType.Block) || neighbor.inList(CellList.Closed)) continue;

      const gSum = current.getG() + moveCost;

      if (!neighbor.inList(CellList.Open)) {
        this._open.push(neighbor);
        neighbor.setList(CellList.Open);
        neighbor.markDisplay();
        neighbor.setParent(current);
        neighbor.setG(gSum);
      } else if (gSum <= neighbor.getG()) {
        neighbor.setParent(current);
        neighbor.setG(gSum);
      }
    }

    return;
  }
}
