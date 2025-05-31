import { Mathematics } from "@utilities/mathematics";
import { Noise } from "@utilities/noise";
import { Vector2 } from "@utilities/vector";

const config = {
  width: 600,
  height: 600,

  rows: 36,
  cols: 36,

  gap: 60,

  vectorMagnitude: 13,

  noiseScale: 0.036,

  timeIncrement: 0.0016,

  lineWidth: 1.2,
  color: "#ACACAC",
  background: "#111111",
} as const;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.strokeStyle = config.color;
  context.lineWidth = config.lineWidth;

  return context;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.background;
  context.fillRect(0, 0, config.width, config.height);
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const xScale = (config.width - config.gap * 2) / config.rows;
  const yScale = (config.height - config.gap * 2) / config.cols;

  const points: Vector2[][] = [];
  for (let x = 0; x <= config.rows; x++) {
    points.push([]);
    for (let y = 0; y <= config.cols; y++) {
      points[x].push(Vector2.Create.zero());
    }
  }

  let time = 0;
  const animation = () => {
    time += config.timeIncrement;

    renderBackground(context);
    context.fillStyle = "#FFFFFF";

    for (let x = 0; x <= config.rows; x++) {
      for (let y = 0; y <= config.cols; y++) {
        const xOrigin = config.gap + x * xScale;
        const yOrigin = config.gap + y * yScale;

        const xNoise = x * config.noiseScale + time;
        const yNoise = y * config.noiseScale + time;
        const noiseValue = Noise.get(xNoise, yNoise);

        const angle = noiseValue * Mathematics.TAU;

        points[x][y].set(
          xOrigin + Math.cos(angle) * config.vectorMagnitude,
          yOrigin + Math.sin(angle) * config.vectorMagnitude,
        );
      }
    }

    for (let x = 0; x <= config.rows; x++) {
      context.beginPath();
      for (let y = 0; y <= config.cols; y++) {
        context.lineTo(points[x][y].x, points[x][y].y);
      }
      context.stroke();
    }

    for (let y = 0; y <= config.cols; y++) {
      context.beginPath();
      for (let x = 0; x <= config.rows; x++) {
        context.lineTo(points[x][y].x, points[x][y].y);
      }
      context.stroke();
    }

    requestAnimationFrame(animation);
  };

  animation();
}
