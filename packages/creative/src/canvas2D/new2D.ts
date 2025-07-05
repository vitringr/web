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

  const frequency = 0.01;

  for (let x = 0; x < 600; x++) {
    for (let y = 0; y < 600; y++) {
      let noise = getNoise(x * frequency, y * frequency);
      context.fillStyle = noise < 0.5 ? Colors.getRGBGrayscale(0.5) : Colors.getRGBGrayscale(0);
      context.fillRect(x, y, 1, 1);
    }
  }

  const animation = () => {
    requestAnimationFrame(animation);
  };

  animation();
}
