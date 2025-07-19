import { Colors } from "@utilities/colors";
import { Noise } from "@utilities/noise";

const defaultConfig = {
  width: 800,
  height: 800,
  frequency: 0.02,
};

type Config = typeof defaultConfig;

function setupContext(canvas: HTMLCanvasElement, config: Config) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

export function main(canvas: HTMLCanvasElement, config: Partial<Config> = {}) {
  const cfg: Config = { ...defaultConfig, ...config };

  const context = setupContext(canvas, cfg);

  let min = Infinity;
  let max = -1000;
  let sum = 0;

  for (let x = 0; x < cfg.width; x++) {
    for (let y = 0; y < cfg.height; y++) {
      const noise = Noise.Perlin.get(x * cfg.frequency, y * cfg.frequency);
      const fractal = Noise.Perlin.getFractal(x * cfg.frequency, y * cfg.frequency, 5);

      if (noise < min) min = noise;
      if (noise > max) max = noise;
      sum += noise;

      context.fillStyle = Colors.getRGBGrayscale(fractal);
      context.fillRect(x, y, 1, 1);
    }
  }

  const average = sum / (cfg.width * cfg.height);

  console.log("min", min);
  console.log("max", max);
  console.log("average", average);
}
