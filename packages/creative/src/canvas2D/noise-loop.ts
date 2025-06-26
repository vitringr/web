import { Mathematics } from "@utilities/mathematics";
import { Noise } from "@utilities/noise";

const config = {
  width: 600,
  height: 600,

  particleCount: 300,
  particleWidth: 3,

  radius: 200,
  noiseRadius: 50,

  noiseFrequency: 1.8,

  timeIncrement: 0.003,

  lineWidth: 3,

  colors: {
    background: "#111111",
    particle: "#CECECE",
  },
} as const;

const getNoise = Noise.simplex();

const angleStep = Mathematics.TAU / config.particleCount;
const xCenter = config.width * 0.5;
const yCenter = config.height * 0.5;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.fillStyle = config.colors.particle;
  context.strokeStyle = config.colors.particle;
  context.lineWidth = config.lineWidth;

  return context;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  let time = 0;

  const animation = () => {
    time += config.timeIncrement;

    renderBackground(context);

    context.beginPath();

    for (let i = 0; i <= config.particleCount; i++) {
      const angle = angleStep * i;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const noiseValue =
        config.noiseRadius *
        getNoise(
          cos * config.noiseFrequency + time,
          sin * config.noiseFrequency - time,
        );

      context.lineTo(
        xCenter + cos * (config.radius + noiseValue),
        yCenter + sin * (config.radius + noiseValue),
      );
    }

    context.stroke();

    requestAnimationFrame(animation);
  };

  animation();
}
