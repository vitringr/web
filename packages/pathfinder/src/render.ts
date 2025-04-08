import { Cell } from "./cell";
import { Config } from "./config";

export class Renderer {
  constructor(private context: CanvasRenderingContext2D) {}

  private getColor(cell: Cell) {
    if (cell.type === Cell.Type.Block) return "#11111b";
    if (cell.list === Cell.List.Open) return "#b4befe";
    if (cell.list === Cell.List.Closed) return "#89b4fa";
    if (cell.type === Cell.Type.Empty) return "#313244";
    if (cell.type === Cell.Type.Rough) return "darkgreen";
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
}
