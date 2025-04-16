import { Mathematics } from "@utilities/mathematics";
import { Easing } from "@utilities/easing";
import { Config } from "./config";
import { Cell } from "./cell";
import { Canvas2D } from "@utilities/canvas2d";

export class Renderer {
  constructor(private context: CanvasRenderingContext2D) { }

  private getColor(cell: Cell) {
    if (cell.type === Cell.Type.Block) return Config.colors.block;
    if (cell.list === Cell.List.Open) return Config.colors.open;
    if (cell.list === Cell.List.Closed) return Config.colors.closed;
    if (cell.type === Cell.Type.Empty) return Config.colors.empty;
    if (cell.type === Cell.Type.Rough) return Config.colors.rough;
    return Config.colors.debug;
  }

  drawCell(cell: Cell) {
    this.context.fillStyle = this.getColor(cell);

    if (cell.renderAnimationStep < 1) {
      cell.renderAnimationStep += Config.animationStepIncrement;
    } else {
      cell.renderAnimationStep = 1;
      cell.toRender = false;
    }

    const size = Mathematics.lerp(
      0,
      Config.cellWidth,
      Easing.easeOutCubic(cell.renderAnimationStep),
    );

    this.context.fillRect(cell.renderCenterPosition.x, cell.renderCenterPosition.y, size, size);
  }

  drawHexCell(cell: Cell) {
    this.context.fillStyle = this.getColor(cell);

    // WIP
    this.context.strokeStyle = "yellow";

    if (cell.renderAnimationStep < 1) {
      cell.renderAnimationStep += Config.animationStepIncrement;
    } else {
      cell.renderAnimationStep = 1;
      cell.toRender = false;
    }

    // WIP
    const diameter = Config.cellWidth * (2 - Mathematics.COS_30)
    const outerRadius = diameter * 0.5
    const innerRadius = outerRadius * Mathematics.COS_30

    const isEven = cell.y % 2 === 0;
    const xOffset = isEven ? 0 : innerRadius;

    const x = innerRadius + xOffset + cell.x * (innerRadius * 2);
    const y = outerRadius + cell.y * (outerRadius * 1.5);

    // WIP
    Canvas2D.fillHex(this.context, x, y, outerRadius);
  }

  drawCells(cells: Cell[][]) {
    for (const row of cells) {
      for (const cell of row) {
        if (cell.toRender) {
          this.drawHexCell(cell);
        }
      }
    }
  }
}
