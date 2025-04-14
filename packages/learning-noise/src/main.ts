import { Mathematics } from "@utilities/mathematics";
import { Vector2 } from "@utilities/vector";
import { Easing } from "@utilities/easing";
import { Gradient } from "./gradient";
import { Config } from "./config";
import { Pixel } from "./pixel";
import { Value } from "./value";
import { Cell } from "./cell";

const pixelsPerCell = Config.pixelsPerRow / Config.cellsPerRow;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = canvas.height = Config.width;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.fillStyle = "#111111";
  context.fillRect(0, 0, Config.width, Config.width);

  return context;
}

function easingFunction(stepValue: number) {
  if (Config.easingFunction === 0) return Easing.linear(stepValue);
  if (Config.easingFunction === 1) return Easing.smoothstep(stepValue);
  return stepValue;
}

function valueNoise(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const pixels = Pixel.createAll();
  const cells = Cell.createAll();
  const values = Value.createAll();

  for (const row of pixels) {
    for (const pixel of row) {
      const xPos = (pixel.x % pixelsPerCell) / pixelsPerCell;
      const yPos = (pixel.y % pixelsPerCell) / pixelsPerCell;

      const [v00, v10, v01, v11] = Value.getTargetValues(
        values,
        pixel.x,
        pixel.y,
      );

      const ix0 = Mathematics.lerp(v00.value, v10.value, easingFunction(xPos));
      const ix1 = Mathematics.lerp(v01.value, v11.value, easingFunction(xPos));
      const value = Mathematics.lerp(ix0, ix1, easingFunction(yPos));

      pixel.color = value;
    }
  }

  Pixel.renderAll(context, pixels);
  Config.renderCells && Cell.renderAll(context, cells);
  Config.renderPixelBorders && Pixel.renderPixelBorders(context);
  Config.renderValues && Value.renderAll(context, values);
}

function gradientNoise(canvas: HTMLCanvasElement) {
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

      const ix0 = Mathematics.lerp(dot00, dot10, easingFunction(xPos));
      const ix1 = Mathematics.lerp(dot01, dot11, easingFunction(xPos));
      const value = Mathematics.lerp(ix0, ix1, easingFunction(yPos));

      pixel.color = (value + 1) / 2;
    }
  }

  Pixel.renderAll(context, pixels);
  Config.renderCells && Cell.renderAll(context, cells);
  Config.renderPixelBorders && Pixel.renderPixelBorders(context);
  Config.renderGradients && Gradient.renderAll(context, gradients);
}

export function main(canvas: HTMLCanvasElement) {
  switch (Config.algorithm) {
    case 0:
      return valueNoise(canvas);
    case 1:
      return gradientNoise(canvas);
  }
}
