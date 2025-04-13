import { Mathematics } from "@utilities/mathematics";
import { Vector2 } from "@utilities/vector";
import { Config } from "./config";
import { Pixel } from "./pixel";
import { Cell } from "./cell";
import { Gradient } from "./gradient";

const pixelsPerCell = Config.pixelsPerRow / Config.cellsPerRow;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = canvas.height = Config.width;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.fillStyle = "#111111";
  context.fillRect(0, 0, Config.width, Config.width);

  return context;
}

export function valueNoise(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const pixels = Pixel.createAll();
  const cells = Cell.createAll();
  const gradients = Gradient.createAll();

  for (const row of pixels) {
    for (const pixel of row) {
      const xPos = (pixel.x % pixelsPerCell) / pixelsPerCell;
      const yPos = (pixel.y % pixelsPerCell) / pixelsPerCell;

      const [g00, g10, g01, g11] = Gradient.getTargetGradients(
        gradients,
        pixel.x,
        pixel.y,
      );

      const d00 = new Vector2(xPos, yPos);
      const d10 = new Vector2(xPos - 1, yPos);
      const d01 = new Vector2(xPos, yPos - 1);
      const d11 = new Vector2(xPos - 1, yPos - 1);

      const dot00 = Mathematics.dot(g00.vector.x, g00.vector.y, d00.x, d00.y);
      const dot10 = Mathematics.dot(g10.vector.x, g10.vector.y, d10.x, d10.y);
      const dot01 = Mathematics.dot(g01.vector.x, g01.vector.y, d01.x, d01.y);
      const dot11 = Mathematics.dot(g11.vector.x, g11.vector.y, d11.x, d11.y);

      function interpolate(a: number, b: number, t: number) {
        const t2 = t * t * (3 - 2 * t);
        return a + (b - a) * t2;
      }

      const ix0 = interpolate(dot00, dot10, xPos);
      const ix1 = interpolate(dot01, dot11, xPos);
      const value = interpolate(ix0, ix1, yPos);

      pixel.color = (value + 1) / 2;
    }
  }

  Pixel.renderAll(context, pixels);
  Config.renderCells && Cell.renderAll(context, cells);
  Config.renderPixelLines && Pixel.renderPixelLines(context);
  Config.renderGradients && Gradient.renderAll(context, gradients);
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const pixels = Pixel.createAll();
  const cells = Cell.createAll();
  const gradients = Gradient.createAll();

  for (const row of pixels) {
    for (const pixel of row) {
      const xPos = (pixel.x % pixelsPerCell) / pixelsPerCell;
      const yPos = (pixel.y % pixelsPerCell) / pixelsPerCell;

      const [g00, g10, g01, g11] = Gradient.getTargetGradients(
        gradients,
        pixel.x,
        pixel.y,
      );

      const d00 = new Vector2(xPos, yPos);
      const d10 = new Vector2(xPos - 1, yPos);
      const d01 = new Vector2(xPos, yPos - 1);
      const d11 = new Vector2(xPos - 1, yPos - 1);

      const dot00 = Mathematics.dot(g00.vector.x, g00.vector.y, d00.x, d00.y);
      const dot10 = Mathematics.dot(g10.vector.x, g10.vector.y, d10.x, d10.y);
      const dot01 = Mathematics.dot(g01.vector.x, g01.vector.y, d01.x, d01.y);
      const dot11 = Mathematics.dot(g11.vector.x, g11.vector.y, d11.x, d11.y);

      function interpolate(a: number, b: number, t: number) {
        const t2 = t * t * (3 - 2 * t);
        return a + (b - a) * t2;
      }

      const ix0 = interpolate(dot00, dot10, xPos);
      const ix1 = interpolate(dot01, dot11, xPos);
      const value = interpolate(ix0, ix1, yPos);

      pixel.color = (value + 1) / 2;
    }
  }

  Pixel.renderAll(context, pixels);
  Config.renderCells && Cell.renderAll(context, cells);
  Config.renderPixelLines && Pixel.renderPixelLines(context);
  Config.renderGradients && Gradient.renderAll(context, gradients);
}
