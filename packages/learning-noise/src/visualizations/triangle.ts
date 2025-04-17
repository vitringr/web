import { Mathematics } from "@utilities/mathematics";
import { Canvas2D } from "@utilities/canvas2d";
import { Easing } from "@utilities/easing";
import { Config } from "../config";
import { Vector2 } from "@utilities/vector";

const config = {
  FPS: 144,

  triangleSide: 100,

  triangleColor: "#EEEE00",
  background: "#333333",
};

const center = new Vector2(Config.width * 0.5, Config.width * 0.5);

const angles = [
  0,
  Mathematics.degreesToRadians(120),
  Mathematics.degreesToRadians(240),
];

const A = new Vector2(
  center.x + Math.cos(angles[0]) * config.triangleSide,
  center.y + Math.sin(angles[0]) * config.triangleSide,
);
const B = new Vector2(
  center.x + Math.cos(angles[1]) * config.triangleSide,
  center.y + Math.sin(angles[1]) * config.triangleSide,
);
const C = new Vector2(
  center.x + Math.cos(angles[2]) * config.triangleSide,
  center.y + Math.sin(angles[2]) * config.triangleSide,
);

function background(context: CanvasRenderingContext2D) {
  context.fillStyle = config.background;
  context.fillRect(0, 0, Config.width, Config.width);
}

export function triangle(context: CanvasRenderingContext2D) {
  background(context);

  context.strokeStyle = config.triangleColor;
  Canvas2D.triangle(context, A.x, A.y, B.x, B.y, C.x, C.y);

  Canvas2D.circle(context, A.x, A.y, 10)
  Canvas2D.circle(context, B.x, B.y, 10)
  Canvas2D.circle(context, C.x, C.y, 10)

  const loop = () => {};
  setInterval(loop, 1000 / config.FPS);
}
