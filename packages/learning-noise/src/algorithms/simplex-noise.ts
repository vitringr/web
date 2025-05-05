import { Vector2 } from "@utilities/vector";
import { Config } from "./config";
import { Canvas2D } from "@utilities/canvas2d";

const skewFactor = 0.5 * (Math.sqrt(3) - 1);
const unskewFactor = (3 - Math.sqrt(3)) / 6;

const gradients: Vector2[] = [
  Vector2.Create.north(),
  Vector2.Create.northEast(),
  Vector2.Create.east(),
  Vector2.Create.southEast(),
  Vector2.Create.south(),
  Vector2.Create.southWest(),
  Vector2.Create.west(),
  Vector2.Create.northWest(),
] as const;

// ---------------
// -- Functions --
// ---------------

const _upscale = Config.width;
const _offset = Vector2.Create.one().scale(100);

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = canvas.height = Config.width;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  Canvas2D.flipY(context, canvas.height);

  context.fillStyle = "#111111";
  context.fillRect(0, 0, Config.width, Config.width);

  return context;
}

function generate(input: Vector2) {
  const skewAmount = (input.x + input.y) * skewFactor;
  const skewed = input.clone().increase(skewAmount, skewAmount);

  const base = skewed.floor();

  const unskewAmount = (base.x + base.y) * unskewFactor;
  const origin = base.clone().decrease(unskewAmount, unskewAmount);

  const differenceFromOrigin = input.clone().subtract(origin);
}

export function simplexNoise(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas); // ---------- -- Main -- ----------

  const input = new Vector2(0.5, 0.5);

  const skewAmount = (input.x + input.y) * skewFactor;
  const skewed = input.clone().increase(skewAmount, skewAmount);

  const base = skewed.clone().floor();

  const unskewAmount = (base.x + base.y) * unskewFactor;
  const origin = base.clone().decrease(unskewAmount, unskewAmount);

  const differenceFromOrigin = input.clone().subtract(origin);

  // ------------
  // -- Render --
  // ------------

  const _input = input.clone().scale(_upscale)
  const _skewed = skewed.clone().scale(_upscale)
  const _base = base.clone().scale(_upscale)
  const _origin = origin.clone().scale(_upscale)

  context.fillStyle = "yellow";
  Canvas2D.circleFill(context, _input.x, _input.y, 8);

  context.fillStyle = "red";
  Canvas2D.circleFill(context, _skewed.x, _skewed.y, 8);
}
