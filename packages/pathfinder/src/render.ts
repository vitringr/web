import { Mathematics } from "@utilities/mathematics";
import { Canvas2D } from "@utilities/canvas2d";
import { Easing } from "@utilities/easing";
import { Config } from "./config";
import { Cell } from "./cell";

const hexOuterDiameter = Config.cellWidth * (2 - Mathematics.COS_30);
const hexOuterRadius = hexOuterDiameter * 0.5;
const hexInnerRadius = hexOuterRadius * Mathematics.COS_30;
const hexInnerDiameter = hexInnerRadius * 2;
const hexAdjacentJoin = hexOuterRadius * 1.5;

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

  private drawCell(cell: Cell) {
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

  private drawHexCell(cell: Cell) {
    this.context.fillStyle = this.getColor(cell);

    if (cell.renderAnimationStep < 1) {
      cell.renderAnimationStep += Config.animationStepIncrement;
    } else {
      cell.renderAnimationStep = 1;
      cell.toRender = false;
    }

    const isEven = cell.y % 2 === 0;
    const xOffset = isEven ? 0 : hexInnerRadius;

    const x = hexInnerRadius + xOffset + cell.x * hexInnerDiameter;
    const y = hexOuterRadius + cell.y * hexAdjacentJoin;

    const size = Mathematics.lerp(0, hexOuterRadius, Easing.easeOutCubic(cell.renderAnimationStep));

    Canvas2D.hexFill(this.context, x, y, size);
  }

  drawCells(cells: Cell[][]) {
    if (Config.grid === 1) {
      for (const row of cells) {
        for (const cell of row) {
          if (cell.toRender) {
            this.drawHexCell(cell);
          }
        }
      }
      return;
    }

    for (const row of cells) {
      for (const cell of row) {
        if (cell.toRender) {
          this.drawCell(cell);
        }
      }
    }
  }
}
