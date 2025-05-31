import { Noise } from "@utilities/noise";

const config = {
  width: 600,
  height: 600,

  count: 6000,

  range: 550,

  timeIncrement: 0.0028,

  noiseVolatility: 0.66,

  orbMinRadius: 1.5,
  orbAddedRadius: 1.5,

  colors: {
    background: "#111111",
    orb: "#ffffff",
  },
} as const;

const xCenter = config.width * 0.5;
const yCenter = config.height * 0.5;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function clear(context: CanvasRenderingContext2D) {
  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const xSeeds: number[] = [];
  const ySeeds: number[] = [];

  for (let i = 0; i < config.count; i++) {
    xSeeds.push(Math.random());
    ySeeds.push(Math.random());
  }

  let time = 0;
  let counter = 0;
  const animation = () => {
    time += config.timeIncrement;
    if (time >= Math.PI) {
      time = 0;
      counter++;
    }

    const sin = Math.sin(time);
    const sinCubed = sin * sin * sin;

    clear(context);
    context.fillStyle = config.colors.orb;

    for (let i = 0; i < config.count; i++) {
      const xNoise = Noise.get(
        counter + xSeeds[i] * config.noiseVolatility - time,
        counter + ySeeds[i] * config.noiseVolatility + time,
      );

      const yNoise = Noise.get(
        counter + xSeeds[i] * config.noiseVolatility + time,
        counter + ySeeds[i] * config.noiseVolatility + time,
      );

      const x = xCenter + (xNoise - 0.5) * config.range * sinCubed;
      const y = yCenter + (yNoise - 0.5) * config.range * sinCubed;

      const radius = config.orbMinRadius + config.orbAddedRadius * (1 - sin);

      context.fillRect(x, y, radius, radius);
    }

    requestAnimationFrame(animation);
  };

  animation();
}
