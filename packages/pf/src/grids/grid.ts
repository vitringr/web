import * as noise from "../libs/noise/noise";
import config from "../config";
import { Utils } from "../utils";
import { IGrid } from "../interfaces/grid.interface";
import { CellType, ICell, Neighbor } from "../interfaces/cell.interface";
import { Cell } from "../cell";
import { ISelector } from "../interfaces/selector.interface";

export abstract class Grid implements IGrid, ISelector {
  protected readonly _cols: number;
  protected readonly _rows: number;
  protected readonly _cells: ICell[][] = [];

  constructor(cols: number, rows: number) {
    this._cols = cols;
    this._rows = rows;
  }

  createCells() {
    for (let x = 0; x < this._cols; x++) {
      this._cells.push([]);
      for (let y = 0; y < this._rows; y++) {
        const cell = new Cell(x, y);
        this._cells[x].push(cell);
      }
    }
  }

  protected _createNeighbor(cell: ICell | null, moveCost: number): Neighbor {
    if (!cell) return null;
    return { cell: cell, moveCost: moveCost } as Neighbor;
  }

  protected _isValidCoordinate(x: number, y: number) {
    return x >= 0 && x < this._cols && y >= 0 && y < this._rows;
  }

  protected _getCell(x: number, y: number) {
    return this._isValidCoordinate(x, y) ? this._cells[x][y] : null;
  }

  protected _generateRandomBlocks() {
    const percent = config.map.blocks.random.percent;
    for (let x = 0; x < this._cols; x++) {
      for (let y = 0; y < this._rows; y++) {
        const cell = this._cells[x][y];
        if (Math.random() < percent) {
          cell.setType(CellType.Block);
          cell.markDisplay();
          cell.skipAnimation();
        }
      }
    }
  }

  protected _generateNoiseBlocks() {
    const percent = config.map.blocks.noise.percent;
    const scalar = config.map.blocks.noise.scalar;
    for (let x = 0; x < this._cols; x++) {
      for (let y = 0; y < this._rows; y++) {
        const cell = this._cells[x][y];
        if (noise.get(x, y, scalar) < percent) {
          cell.setType(CellType.Block);
          cell.markDisplay();
          cell.skipAnimation();
        }
      }
    }
  }

  protected _generateRandomTerrain() {
    const percent = config.map.terrain.random.percent;
    for (let x = 0; x < this._cols; x++) {
      for (let y = 0; y < this._rows; y++) {
        const cell = this._cells[x][y];
        if (cell.isType(CellType.Block)) continue;
        if (Math.random() < percent) {
          cell.setType(CellType.Terrain);
          cell.setT(1); // TODO: turn this into a gradient
          cell.markDisplay();
          cell.skipAnimation();
        }
      }
    }
  }

  protected _generateNoiseTerrain() {
    const percent = config.map.terrain.noise.percent;
    const scalar = config.map.terrain.noise.scalar;

    let xOffset = config.map.terrain.noise.offsetFromBlocks.x;
    let yOffset = config.map.terrain.noise.offsetFromBlocks.y;
    if (config.map.terrain.noise.offsetFromBlocks.random) {
      xOffset *= Math.random();
      yOffset *= Math.random();
    }

    for (let x = 0; x < this._cols; x++) {
      for (let y = 0; y < this._rows; y++) {
        const cell = this._cells[x][y];
        if (cell.isType(CellType.Block)) continue;
        if (noise.get(x + xOffset, y + xOffset, scalar) < percent) {
          cell.setType(CellType.Terrain);
          cell.setT(1); // TODO: turn this into a gradient
          cell.markDisplay();
          cell.skipAnimation();
        }
      }
    }
  }

  abstract setupNeighbors(): void;

  abstract getCellAt(xCoordinate: number, yCoordinate: number): ICell | null;

  generateBlocks(type: string) {
    switch (type) {
      case "random":
        this._generateRandomBlocks();
        break;
      case "noise":
        this._generateNoiseBlocks();
        break;
      default:
        break;
    }
  }

  generateTerrain(type: string) {
    switch (type) {
      case "random":
        this._generateRandomTerrain();
        break;
      case "noise":
        this._generateNoiseTerrain();
        break;
      default:
        break;
    }
  }

  getCells() {
    return this._cells;
  }

  precalculateAllDistancesTo(target: ICell) {
    const distanceMethod = config.pathfinding.distanceMethod;

    for (let x = 0; x < this._cols; x++) {
      for (let y = 0; y < this._rows; y++) {
        const cell = this._cells[x][y];
        if (distanceMethod === "manhattan") cell.setH(Utils.manhattanDistance(cell, target));
        else if (distanceMethod === "euclidean") cell.setH(Utils.euclideanDistance(cell, target));
      }
    }
  }

  unblockCellRecursive(cell: ICell, recursions: number = 0) {
    // HACK
    // TODO: this needs refactoring.
    cell.setType(CellType.Empty);
    cell.setT(0);
    cell.markDisplay();

    const neighbors = cell.getNeighbors();
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i]?.cell;
      if (!neighbor) continue;

      neighbor.setType(CellType.Empty);
      neighbor.setT(0);
      neighbor.markDisplay();

      if (recursions > 0) this.unblockCellRecursive(neighbor, recursions - 1);
    }
  }
}
