import { Mathematics } from "@utilities/mathematics";
import { Easing } from "@utilities/easing";
import { Cell } from "./cell";
import { Config } from "./config";

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

    const size = Mathematics.lerp(0, Config.cellWidth, Easing.easeOutCubic(cell.renderAnimationStep));

    this.context.fillRect(cell.renderCenterPosition.x, cell.renderCenterPosition.y, size, size);
  }

  drawCells(cells: Cell[][]) {
    for (const row of cells) {
      for (const cell of row) {
        if (cell.toRender) {
          this.drawCell(cell);
        }
      }
    }
  }
}
