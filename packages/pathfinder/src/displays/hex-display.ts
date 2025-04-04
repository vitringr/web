import config from "../config";
import { ICell } from "../interfaces/cell.interface";
import { Mathematics } from "../libs/utils/mathematics";
import { Display } from "./display";

const hexCosines: number[] = [];
const hexSines: number[] = [];

const div6 = Mathematics.TAU / 6;
const div12 = Mathematics.TAU / 12;

for (let i = 0; i < 6; i++) {
  const angle = div6 * i - div12; // -30 degrees for pointy-top
  hexCosines.push(Math.cos(angle));
  hexSines.push(Math.sin(angle));
}

export class HexDisplay extends Display {
  private readonly _diameter = (config.canvas.width / this._cols) * (2 - Mathematics.COS_30);
  private readonly _outerRadius = this._diameter / 2;
  private readonly _innerRadius = this._outerRadius * Mathematics.COS_30;

  protected _drawCell(cell: ICell, color: string) {
    const xOffset = cell.y % 2 === 0 ? 0 : this._innerRadius;
    const xCenter = this._outerRadius + xOffset + cell.x * (2 * this._innerRadius);
    const yCenter = this._outerRadius + cell.y * (1.5 * this._outerRadius);

    const step = this._easeFunction(cell.incrementAnimation(this._animationIncrement));
    const animationRadius = this._outerRadius * step;

    if (this._lastFillColor !== color) {
      this._context.fillStyle = color;
      this._lastFillColor = color;
    }

    this._context.beginPath();
    this._context.moveTo(xCenter + animationRadius * hexCosines[0], yCenter + animationRadius * hexSines[0]);
    for (let i = 1; i < 6; i++) {
      this._context.lineTo(xCenter + animationRadius * hexCosines[i], yCenter + animationRadius * hexSines[i]);
    }
    this._context.closePath();
    this._context.fill();
  }
}
