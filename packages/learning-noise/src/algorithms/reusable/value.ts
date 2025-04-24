import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Random } from "@utilities/random";
import { Colors } from "@utilities/colors";
import { Config } from "../config";

const pixelsPerCell = Config.pixelsPerRow / Config.cellsPerRow;
const cellWidth = Config.width / Config.cellsPerRow;

export class Value {
  static createAll() {
    const values: Value[][] = [];

    for (let x = 0; x <= Config.cellsPerRow; x++) {
      values.push([]);
      for (let y = 0; y <= Config.cellsPerRow; y++) {
        values[x].push(new Value(x, y));
      }
    }

    return values;
  }

  static renderAll(context: CanvasRenderingContext2D, values: Value[][]) {
    context.strokeStyle = Config.colors.values;
    context.lineWidth = Config.valueCircleThickness;

    for (const row of values) {
      for (const value of row) {
        value.render(context);
      }
    }
  }

  static getTargetValues(values: Value[][], x: number, y: number) {
    const xCell = Math.floor(x / pixelsPerCell);
    const yCell = Math.floor(y / pixelsPerCell);

    return [
      values[xCell][yCell],
      values[xCell + 1][yCell],
      values[xCell][yCell + 1],
      values[xCell + 1][yCell + 1],
    ];
  }

  readonly value = Random.range(0, 1);
  readonly position = Vector2.Create.zero();

  constructor(
    readonly x: number,
    readonly y: number,
  ) {
    this.position.set(x * cellWidth, y * cellWidth);
  }

  render(context: CanvasRenderingContext2D) {
    context.fillStyle = Colors.getRGBGrayscale(this.value);
    Canvas2D.circleFill(context, this.position.x, this.position.y, Config.valueCircleRadius);

    Canvas2D.circle(context, this.position.x, this.position.y, Config.valueCircleRadius);
  }
}
