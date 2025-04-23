import { Vector2 } from "@utilities/vector";
import { Config } from "../config";

const pixelsPerCell = Config.pixelsPerRow / Config.cellsPerRow;
const cellWidth = Config.width / Config.cellsPerRow;

export class Cell {
  static createAll() {
    const cells: Cell[][] = [];

    for (let x = 0; x < Config.cellsPerRow; x++) {
      cells.push([]);
      for (let y = 0; y < Config.cellsPerRow; y++) {
        cells[x].push(new Cell(x, y));
      }
    }

    return cells;
  }

  static renderAll(context: CanvasRenderingContext2D, cells: Cell[][]) {
    context.strokeStyle = Config.colors.cellBorders;
    context.lineWidth = Config.cellBordersWidth;

    for (const row of cells) {
      for (const cell of row) {
        cell.render(context);
      }
    }
  }

  static getTargetCell(cells: Cell[][], x: number, y: number) {
    const xCell = Math.floor(x / pixelsPerCell);
    const yCell = Math.floor(y / pixelsPerCell);

    return cells[xCell][yCell];
  }

  readonly position = Vector2.zero();

  constructor(
    readonly x: number,
    readonly y: number,
  ) {
    this.position.set(x * cellWidth, y * cellWidth);
  }

  render(context: CanvasRenderingContext2D) {
    context.strokeRect(this.position.x, this.position.y, cellWidth, cellWidth);
  }
}
