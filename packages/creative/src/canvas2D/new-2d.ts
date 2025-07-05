import { Colors } from "@utilities/colors";
import { Easing } from "@utilities/easing";
import { Noise } from "@utilities/noise";

const config = {
  width: 600,
  height: 600,

  colors: {
    background: "#111111",
  },
} as const;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const getNoise = Noise.Simplex.create();

  const frequency = 0.0123;

  let min = Infinity;
  let max = 0;
  let sum = 0;
  for (let x = 0; x < 1000; x++) {
    for (let y = 0; y < 1000; y++) {
      let noise = getNoise(x * frequency, y * frequency);

      if (noise < min) min = noise;
      if (noise > max) max = noise;
      sum += noise;

      context.fillStyle = Colors.getRGBGrayscale(noise);
      context.fillRect(x, y, 1, 1);
    }
  }

  const average = sum / 1_000_000;
  console.log("average", average);

  console.log("min", min);
  console.log("max", max);
}
