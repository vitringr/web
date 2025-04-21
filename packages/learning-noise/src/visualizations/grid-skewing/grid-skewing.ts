import { Mathematics } from "@utilities/mathematics";
import { Canvas2D } from "@utilities/canvas2d";
import { Easing } from "@utilities/easing";
import { Config } from "./config";

type Point = {
  x: number;
  y: number;
  xOriginal: number;
  yOriginal: number;
};

const F = (Math.sqrt(3) - 1) * 0.5;

function background(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.background;
  context.fillRect(0, 0, Config.width, Config.width);
}

function createPoints() {
  const points: Point[][] = [];

  const gap = Config.width / Config.pointsPerRow + 10;

  for (let x = 0; x <= Config.pointsPerRow; x++) {
    points.push([]);
    for (let y = 0; y <= Config.pointsPerRow; y++) {
      points[x].push({
        x: x * gap,
        y: y * gap,
        xOriginal: x * gap,
        yOriginal: y * gap,
      });
    }
  }

  return points;
}

function renderPoints(context: CanvasRenderingContext2D, points: Point[][]) {
  context.fillStyle = Config.color;

  for (const row of points) {
    for (const point of row) {
      Canvas2D.circleFill(context, point.x, point.y, Config.radius);
    }
  }
}

function renderLines(context: CanvasRenderingContext2D, points: Point[][]) {
  context.strokeStyle = "#FFEE00";
  context.lineWidth = 0.5;
  for (let x = 0; x < Config.pointsPerRow; x++) {
    for (let y = 0; y < Config.pointsPerRow; y++) {
      const point = points[x][y];

      const right = points[x + 1][y];
      Canvas2D.line(context, point.x, point.y, right.x, right.y);

      if (x > 0) {
        const botLeft = points[x - 1][y + 1];
        Canvas2D.line(context, point.x, point.y, botLeft.x, botLeft.y);
      }

      const down = points[x][y + 1];
      Canvas2D.line(context, point.x, point.y, down.x, down.y);
    }
  }
}

function resetCoordinates(points: Point[][]) {
  for (const row of points) {
    for (const point of row) {
      point.x = point.xOriginal;
      point.y = point.yOriginal;
    }
  }
}

function skewStep(point: Point, F: number) {
  const S = (point.x + point.y) * F;

  const xp = point.x + S;
  const yp = point.y + S;

  point.x = xp;
  point.y = yp;
}

export function gridSkewing(context: CanvasRenderingContext2D) {
  const points = createPoints();

  let time: number = 0;

  const loop = () => {
    time += Config.timeIncrement;

    const step = (Math.sin(time) + 1) * 0.5;

    const rangeF = Mathematics.lerp(0, F, Easing.smoothstep(step));

    resetCoordinates(points);

    for (const row of points) {
      for (const point of row) {
        skewStep(point, rangeF);
      }
    }

    background(context);
    renderLines(context, points);
    renderPoints(context, points);

    requestAnimationFrame(loop);
  };

  loop();
}
