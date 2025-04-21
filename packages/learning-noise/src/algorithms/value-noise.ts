import { Mathematics } from "@utilities/mathematics";
import { Easing } from "@utilities/easing";
import { Config } from "./config";
import { Value } from "./value";
import { Pixel } from "./pixel";
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
export function valueNoise(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const pixels = Pixel.createAll();
  const cells = Cell.createAll();
  const values = Value.createAll();

  for (const row of pixels) {
    for (const pixel of row) {
      const xPos = (pixel.x % pixelsPerCell) / pixelsPerCell;
      const yPos = (pixel.y % pixelsPerCell) / pixelsPerCell;

      const [v00, v10, v01, v11] = Value.getTargetValues(values, pixel.x, pixel.y);

      const ix0 = Mathematics.lerp(v00.value, v10.value, Easing.smoothstep(xPos));
      const ix1 = Mathematics.lerp(v01.value, v11.value, Easing.smoothstep(xPos));
      const value = Mathematics.lerp(ix0, ix1, Easing.smoothstep(yPos));

      pixel.color = value;
    }
  }

  Pixel.renderAll(context, pixels);
  Config.renderCells && Cell.renderAll(context, cells);
  Config.renderPixelBorders && Pixel.renderPixelBorders(context);
  Config.renderValues && Value.renderAll(context, values);
}
