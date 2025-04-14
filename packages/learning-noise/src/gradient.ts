import { Mathematics } from "@utilities/mathematics";
import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Random } from "@utilities/random";
import { Config } from "./config";

const pixelsPerCell = Config.pixelsPerRow / Config.cellsPerRow;
const cellWidth = Config.width / Config.cellsPerRow;

export class Gradient {
  static createAll() {
    const gradients: Gradient[][] = [];

    for (let x = 0; x <= Config.cellsPerRow; x++) {
      gradients.push([]);
      for (let y = 0; y <= Config.cellsPerRow; y++) {
        gradients[x].push(new Gradient(x, y));
      }
    }

    return gradients;
  }

  static renderAll(context: CanvasRenderingContext2D, gradients: Gradient[][]) {
    context.strokeStyle = context.fillStyle = Config.colors.gradients;
    context.lineWidth = Config.gradientArrowWidth;

    for (const row of gradients) {
      for (const gradient of row) {
        gradient.render(context);
      }
    }
  }

  static getTargetGradients(gradients: Gradient[][], x: number, y: number) {
    const xCell = Math.floor(x / pixelsPerCell);
    const yCell = Math.floor(y / pixelsPerCell);

    return [
      gradients[xCell][yCell],
      gradients[xCell + 1][yCell],
      gradients[xCell][yCell + 1],
      gradients[xCell + 1][yCell + 1],
    ];
  }

  readonly vector = Vector2.zero();
  readonly position = Vector2.zero();

  constructor(
    readonly x: number,
    readonly y: number,
  ) {
    this.position.set(x * cellWidth, y * cellWidth);

    const angle = Random.range(0, Mathematics.TAU);
    this.vector.set(Math.cos(angle), Math.sin(angle));
  }

  render(context: CanvasRenderingContext2D) {
    Canvas2D.fillCircle(
      context,
      this.position.x,
      this.position.y,
      Config.gradientCircleRadius,
    );

    const arrow = this.vector
      .clone()
      .scale(Config.gradientArrowLength)
      .add(this.position);
    Canvas2D.line(context, this.position.x, this.position.y, arrow.x, arrow.y);
  }
}
