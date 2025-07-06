import { Colors } from "@utilities/colors";
import { Noise } from "@utilities/noise";

const config = {
  width: 600,
  height: 600,

  frequency: 0.02
} as const;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  let min = Infinity;
  let max = -1000;
  let sum = 0;

  for (let x = 0; x < config.width; x++) {
    for (let y = 0; y < config.height; y++) {
      const noise = Noise.Perlin.get(x * config.frequency, y * config.frequency);
      const fractal = Noise.Perlin.getFractal(x * config.frequency, y * config.frequency, 5);

      if (noise < min) min = noise;
      if (noise > max) max = noise;
      sum += noise;

      context.fillStyle = Colors.getRGBGrayscale(fractal);
      context.fillRect(x, y, 1, 1);
    }
  }

  const average = sum / (config.width * config.height);

  console.log("min", min);
  console.log("max", max);
  console.log("average", average);
}
