import config from "../config";
import { CellList, CellType, ICell } from "../interfaces/cell.interface";
import { IPathfinder } from "../interfaces/pathfinder.interface";
import { Utilities } from "../libs/utils/utilities";
import { Utils } from "../utils";

const euclideanDistance: boolean = config.pathfinding.distanceMethod === "euclidean";

// add interface
export class BidirectionalAStar implements IPathfinder {
  private readonly _open: ICell[] = [];
  private readonly _closed = new Set<ICell>();

  private readonly _openInverse: ICell[] = [];
  private readonly _closedInverse = new Set<ICell>();

  private _ended: boolean = false;

  constructor(
    private readonly _start: ICell,
    private readonly _target: ICell,
  ) {
    this._open.push(_start);
    _start.setList(CellList.Open);

    this._openInverse.push(_target);
    _target.setList(CellList.Open);
  }

  private _getBestFrom(cells: ICell[]) {
    let minFCell = cells[0];
    for (let i = 1; i < cells.length; i++) {
      const cell = cells[i];
      if (cell.getF() < minFCell.getF()) minFCell = cell;
    }
    return minFCell;
  }

  private reconstructPathFrom(cell: ICell) {
    let current: ICell | null = cell;
    while (current) {
      current.setPath(true);
      current.markDisplay();
      current = current.getParent();
    }
  }

  hasEnded(): boolean {
    return this._ended;
  }
  end() {
    this._ended = true;
  }

  containsCell(cell: ICell, open: ICell[], closed: Set<ICell>): boolean {
    let inClosed: boolean = closed.has(cell);

    let inOpen: boolean = false;
    for (let i = 0; i < open.length; i++) {
      if (open[i].equals(cell)) inOpen = true;
    }

    return inClosed || inOpen;
  }

  private processNeighbors(current: ICell, target: ICell, open: ICell[], openOther: ICell[], closedOther: Set<ICell>) {
    const neighbors = current.getNeighbors();
    for (let n = 0; n < neighbors.length; n++) {
      const exists = neighbors[n];
      if (!exists) continue;

      const neighbor = exists.cell;
      const neighborMoveCost = exists.moveCost;

      if (neighbor.isType(CellType.Block)) continue;

      if (this.containsCell(neighbor, openOther, closedOther)) {
        this.end();
        this.reconstructPathFrom(current);
        this.reconstructPathFrom(neighbor);
        return;
      }

      if (neighbor.inList(CellList.Closed)) continue;

      const gSum = current.getG() + neighborMoveCost;
      if (neighbor.getH() <= 0) {
        euclideanDistance
          ? neighbor.setH(Utils.euclideanDistance(neighbor, target))
          : neighbor.setH(Utils.manhattanDistance(neighbor, target));
      }

      if (!neighbor.inList(CellList.Open)) {
        open.push(neighbor);
        neighbor.setList(CellList.Open);
        neighbor.markDisplay();
        neighbor.setParent(current);
        neighbor.setG(gSum);
      } else if (gSum < neighbor.getG()) {
        neighbor.setParent(current);
        neighbor.setG(gSum);
      }
    }
  }

  iterate() {
    if (this._ended) return;

    if (this._open.length <= 0 || this._openInverse.length <= 0) {
      this.end();
      return;
    }

    let current = this._getBestFrom(this._open);
    let currentInverse = this._getBestFrom(this._openInverse);

    if (current.equals(this._target)) {
      this.end();
      this._open.length = 0;
      this.reconstructPathFrom(current);
      return;
    }

    if (currentInverse.equals(this._start)) {
      this.end();
      this._openInverse.length = 0;
      this.reconstructPathFrom(currentInverse);
      return;
    }

    Utilities.removeFromArray(this._open, current);
    this._closed.add(current);
    current.setList(CellList.Closed);
    current.markDisplay();

    Utilities.removeFromArray(this._openInverse, currentInverse);
    this._closedInverse.add(currentInverse);
    currentInverse.setList(CellList.Closed);

    this.processNeighbors(current, this._target, this._open, this._openInverse, this._closedInverse);
    if (this._ended) return;
    this.processNeighbors(currentInverse, this._start, this._openInverse, this._open, this._closed);
  }
}
