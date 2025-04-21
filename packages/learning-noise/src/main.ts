import { triangleInfluence } from "./triangle-influence/triangle-influence";
import { simplexNoise } from "./algorithms/simplex-noise";
import { gridSkewing } from "./grid-skewing/grid-skewing";
import { perlinNoise } from "./algorithms/perlin-noise";
import { valueNoise } from "./algorithms/value-noise";
import { mode } from "./config";

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

  switch (mode) {
    case 0:
      return gridSkewing(context);
    case 1:
      return triangleInfluence(context);
    case 2:
      return valueNoise(canvas);
    case 3:
      return perlinNoise(canvas);
    case 4:
      return simplexNoise(canvas);
  }
}
