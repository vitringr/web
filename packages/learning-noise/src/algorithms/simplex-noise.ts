import { Mathematics } from "@utilities/mathematics";
import { Vector2 } from "@utilities/vector";
import { Easing } from "@utilities/easing";
import { Gradient } from "../gradient";
import { Config } from "../config";
import { Pixel } from "../pixel";
import { Cell } from "../cell";

const pixelsPerCell = Config.pixelsPerRow / Config.cellsPerRow;

export function simplexNoise(context: CanvasRenderingContext2D) {
  const pixels = Pixel.createAll();
  const cells = Cell.createAll();
  const gradients = Gradient.createAll();

  Pixel.renderAll(context, pixels);
  Config.renderCells && Cell.renderAll(context, cells);
  Config.renderPixelBorders && Pixel.renderPixelBorders(context);
  Config.renderGradients && Gradient.renderAll(context, gradients);
}
