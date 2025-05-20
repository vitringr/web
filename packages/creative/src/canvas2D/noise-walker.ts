import { Canvas2D } from "@utilities/canvas2d";
import { Mathematics } from "@utilities/mathematics";
import { Noise } from "@utilities/noise";

const config = {
  width: 600,
  height: 600,

  particleCount: 300,
  particleWidth: 3,

  radius: 200,
  noiseRadius: 60,

  noiseFrequency: 2,

  timeIncrement: 0.003,

  colors: {
    background: "#111111",
    particle: "#CECECE",
  },
} as const;

const angleStep = Mathematics.TAU / config.particleCount;
const xCenter = config.width * 0.5;
const yCenter = config.height * 0.5;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  let time = 0;
  const animation = () => {
    time += config.timeIncrement;

    const xNoise = Noise.get(time + 10, -time) - 0.5;
    const yNoise = Noise.get(-time, time) - 0.5;

    context.fillStyle = "#00000002";
    context.fillRect(0, 0, config.width, config.height);

    context.fillStyle = "white";
    Canvas2D.circleFill(
      context,
      xCenter + xNoise * 600,
      yCenter + yNoise * 600,
      40,
    );

    context.strokeStyle = "red";
    Canvas2D.circle(
      context,
      xCenter + xNoise * 600,
      yCenter + yNoise * 600,
      45,
    );

    requestAnimationFrame(animation);
  };

  animation();
}
