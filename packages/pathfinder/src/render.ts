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
    return "#FF00FF";
  }

  drawCell(cell: Cell) {
    this.context.fillStyle = this.getColor(cell);
    this.context.fillRect(
      cell.x * Config.cellWidth,
      cell.y * Config.cellWidth,
      Config.cellWidth,
      Config.cellWidth,
    );
  }

  drawCells(cells: Cell[][]) {
    let count = 0;
    for (const row of cells) {
      for (const cell of row) {
        if (cell.toRender) {
          this.drawCell(cell);
          cell.toRender = false;
          count++;
        }
      }
    }
    console.log("count:", count);
  }
}
