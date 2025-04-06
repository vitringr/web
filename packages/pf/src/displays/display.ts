import config from "../config";
import { CellList, CellType, ICell } from "../interfaces/cell.interface";
import { IDisplay } from "../interfaces/display.interface";
import { Utils } from "../utils";

export abstract class Display implements IDisplay {
  protected _lastFillColor: string = "";

  protected readonly _cols = config.map.columns;
  protected readonly _rows = Utils.calculateRowsCount(
    config.canvas.width,
    config.canvas.height,
    config.map.columns,
    config.map.grid === "hex",
  );
  protected readonly _cellColors = config.display.colors.cells;
  protected readonly _animationIncrement = config.display.animation.increment;

  constructor(protected readonly _context: CanvasRenderingContext2D) {
    _context.strokeStyle = config.display.colors.border;
    _context.lineWidth = config.display.lineWidth > 0 ? config.display.lineWidth : 0.1;
  }

  protected _getCellColor(cell: ICell): string {
    if (cell.isType(CellType.Block)) return this._cellColors.block;

    if (cell.isPath()) return this._cellColors.path;

    if (cell.inList(CellList.Open)) return this._cellColors.open;

    if (cell.inList(CellList.Closed)) return this._cellColors.closed;

    if (cell.isType(CellType.Empty)) return this._cellColors.empty;

    if (cell.isType(CellType.Terrain)) return this._cellColors.terrain;

    return this._cellColors.debug;
  }

  protected _easeFunction(value: number) {
    return value * value * value;
  }

  protected abstract _drawCell(cell: ICell, color: string): void;

  drawCells(cells: ICell[][]) {
    for (let x = 0; x < this._cols; x++) {
      for (let y = 0; y < this._rows; y++) {
        const cell: ICell = cells[x][y];
        if (cell.shouldDisplay()) {
          const color = this._getCellColor(cell);
          this._drawCell(cell, color);
        }
      }
    }
  }

  clear() {
    this._context.fillStyle = config.display.colors.background;
    this._context.fillRect(0, 0, config.canvas.width, config.canvas.height);
  }
}
