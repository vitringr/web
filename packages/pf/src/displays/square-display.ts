import config from "../config";
import { Mathematics } from "../libs/utils/mathematics";
import { ICell } from "../interfaces/cell.interface";
import { Display } from "./display";

export class SquareDisplay extends Display {
  protected readonly _maxCellWidth = config.canvas.width / this._cols;
  protected readonly _maxCellHeight = config.canvas.height / this._rows;
  protected readonly _halfCellWidth = this._maxCellWidth / 2;
  protected readonly _halfCellHeight = this._maxCellHeight / 2;

  protected _drawCell(cell: ICell, color: string) {
    const xCenter = cell.x * this._maxCellWidth + this._halfCellWidth;
    const yCenter = cell.y * this._maxCellHeight + this._halfCellHeight;

    const step = this._easeFunction(cell.incrementAnimation(this._animationIncrement));

    const width = Mathematics.lerp(0, this._maxCellWidth, step);
    const height = Mathematics.lerp(0, this._maxCellHeight, step);

    const x = xCenter - width / 2;
    const y = yCenter - height / 2;

    if (this._lastFillColor !== color) {
      this._context.fillStyle = color;
      this._lastFillColor = color;
    }

    this._context.fillRect(x, y, width, height);
    this._context.strokeRect(x, y, width, height);
  }
}
