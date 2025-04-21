import { triangleInfluence } from "./triangle-influence/triangle-influence";
import { simplexNoise } from "./algorithms/simplex-noise";
import { gridSkewing } from "./grid-skewing/grid-skewing";
import { perlinNoise } from "./algorithms/perlin-noise";
import { valueNoise } from "./algorithms/value-noise";
import { mode } from "./config";

export function main(canvas: HTMLCanvasElement) {
  switch (mode) {
    case 0:
      return gridSkewing(canvas);
    case 1:
      return triangleInfluence(canvas);
    case 2:
      return valueNoise(canvas);
    case 3:
      return perlinNoise(canvas);
    case 4:
      return simplexNoise(canvas);
  }
}
