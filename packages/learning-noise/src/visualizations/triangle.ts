import { Mathematics } from "@utilities/mathematics";
import { Canvas2D } from "@utilities/canvas2d";
import { Config } from "../config";
import { Vector2 } from "@utilities/vector";

const config = {
  FPS: 144,

  triangleSide: 240,
  pointRadius: 4,

  triangleColor: "#EEEE00",
  pointerColor: "#FF00FF",
  background: "#333333",
};

const pointer = Vector2.infinity();

const centerPoint = new Vector2(Config.width * 0.5, Config.width * 0.55);

const angles = [
  Mathematics.degreesToRadians(150),
  Mathematics.degreesToRadians(270),
  Mathematics.degreesToRadians(30),
];

const A = new Vector2(
  centerPoint.x + Math.cos(angles[0]) * config.triangleSide,
  centerPoint.y + Math.sin(angles[0]) * config.triangleSide,
);
const B = new Vector2(
  centerPoint.x + Math.cos(angles[1]) * config.triangleSide,
  centerPoint.y + Math.sin(angles[1]) * config.triangleSide,
);
const C = new Vector2(
  centerPoint.x + Math.cos(angles[2]) * config.triangleSide,
  centerPoint.y + Math.sin(angles[2]) * config.triangleSide,
);

function renderTriangle(context: CanvasRenderingContext2D) {
  Canvas2D.triangle(context, A.x, A.y, B.x, B.y, C.x, C.y);
  Canvas2D.circleFill(context, A.x, A.y, config.pointRadius);
  Canvas2D.circleFill(context, B.x, B.y, config.pointRadius);
  Canvas2D.circleFill(context, C.x, C.y, config.pointRadius);
}

function renderCenter(context: CanvasRenderingContext2D) {
  Canvas2D.circleFill(
    context,
    centerPoint.x,
    centerPoint.y,
    config.pointRadius,
  );
}

function renderPointer(context: CanvasRenderingContext2D) {
  Canvas2D.circleFill(context, pointer.x, pointer.y, config.pointRadius);
}

function renderDistanceLines(context: CanvasRenderingContext2D) {
  Canvas2D.line(context, pointer.x, pointer.y, A.x, A.y);
  Canvas2D.line(context, pointer.x, pointer.y, B.x, B.y);
  Canvas2D.line(context, pointer.x, pointer.y, C.x, C.y);
}

function background(context: CanvasRenderingContext2D) {
  context.fillStyle = config.background;
  context.fillRect(0, 0, Config.width, Config.width);
}

function setupInput(canvas: HTMLCanvasElement) {
  const bounds = canvas.getBoundingClientRect();
  canvas.addEventListener("pointermove", (event: PointerEvent) => {
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
  });
}

function getDistances(pointer: Vector2, A: Vector2, B: Vector2, C: Vector2) {
  const aDistance = Mathematics.euclideanDistance(
    pointer.x,
    pointer.y,
    A.x,
    A.y,
  );
  const bDistance = Mathematics.euclideanDistance(
    pointer.x,
    pointer.y,
    B.x,
    B.y,
  );
  const cDistance = Mathematics.euclideanDistance(
    pointer.x,
    pointer.y,
    C.x,
    C.y,
  );

  return { a: aDistance, b: bDistance, c: cDistance };
}

export function triangle(context: CanvasRenderingContext2D) {
  setupInput(context.canvas);

  const loop = () => {
    background(context);

    context.strokeStyle = config.triangleColor;
    context.fillStyle = config.triangleColor;
    renderTriangle(context);
    renderCenter(context);

    context.fillStyle = config.pointerColor;
    renderPointer(context);

    context.strokeStyle = config.pointerColor;
    renderDistanceLines(context);

    const distances = getDistances(pointer, A, B, C);
    const totalDistance = distances.a + distances.b + distances.c;

    const aDot = Mathematics.dot(pointer.x, pointer.y, A.x, A.y);
    const bDot = Mathematics.dot(pointer.x, pointer.y, B.x, B.y);
    const cDot = Mathematics.dot(pointer.x, pointer.y, C.x, C.y);
  };
  setInterval(loop, 1000 / config.FPS);
}
