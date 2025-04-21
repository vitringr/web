import { triangleInfluence } from "./triangle-influence/triangle-influence";
import { simplexNoise } from "./algorithms/simplex-noise";
import { gridSkewing } from "./grid-skewing/grid-skewing";
import { gridReflection } from "./grid-reflection/main";
import { perlinNoise } from "./algorithms/perlin-noise";
import { valueNoise } from "./algorithms/value-noise";
import { mode } from "./config";

export function main(canvas: HTMLCanvasElement) {
  switch (mode) {
    case 0:
      return valueNoise(canvas);
    case 1:
      return perlinNoise(canvas);
    case 2:
      return simplexNoise(canvas);
    case 3:
      return gridSkewing(canvas);
    case 4:
      return gridReflection(canvas);
    case 5:
      return triangleInfluence(canvas);
  }
}
