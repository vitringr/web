import { Canvas2D } from "@utilities/canvas2d";
import { Mathematics } from "@utilities/mathematics";
import { Noise } from "@utilities/noise";

const config = {
  width: 600,
  height: 600,

  rows: 35,
  cols: 35,

  gap: 60,

  vectorMagnitude: 10,

  noiseScale: 0.044,

  timeIncrement: 0.0016,

  lineWidth: 2,
  color: "#acacac",
  background: "#111111",
} as const;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.background;
  context.fillRect(0, 0, config.width, config.height);
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  context.strokeStyle = config.color;
  context.lineWidth = config.lineWidth;

  const xScale = (config.width - config.gap * 2) / config.rows;
  const yScale = (config.height - config.gap * 2) / config.cols;

  let time = 0;
  const animation = () => {
    time += config.timeIncrement;

    renderBackground(context);

    for (let x = 0; x <= config.rows; x++) {
      for (let y = 0; y <= config.cols; y++) {
        const xNoise = x * config.noiseScale + time;
        const yNoise = y * config.noiseScale + time;

        const noiseValue = Noise.Simplex.get(xNoise, yNoise);

        const angle = noiseValue * Mathematics.TAU;

        const xOrigin = config.gap + x * xScale;
        const yOrigin = config.gap + y * yScale;

        const xPosition = xOrigin + Math.cos(angle) * config.vectorMagnitude;
        const yPosition = yOrigin + Math.sin(angle) * config.vectorMagnitude;

        Canvas2D.line(context, xOrigin, yOrigin, xPosition, yPosition);
      }
    }

    requestAnimationFrame(animation);
  };

  animation();
}
