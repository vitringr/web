import { simplexNoise } from "./algorithms/simplex-noise";
import { perlinNoise } from "./algorithms/perlin-noise";
import { valueNoise } from "./algorithms/value-noise";
import { skewing } from "./visualizations/skewing";
import { triangle } from "./visualizations/triangle";
import { Config } from "./config";

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = canvas.height = Config.width;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.fillStyle = "#111111";
  context.fillRect(0, 0, Config.width, Config.width);

  return context;
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  switch (Config.main) {
    case 0:
      return skewing(context);
    case 1:
      return triangle(context);
    case 2:
      return valueNoise(context);
    case 3:
      return perlinNoise(context);
    case 4:
      return simplexNoise(context);
  }
}
