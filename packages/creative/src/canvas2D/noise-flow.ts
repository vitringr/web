import { Colors } from "@utilities/colors";
import { Noise } from "@utilities/noise";

const config = {
  width: 600,
  height: 600,

  cellRows: 60,
  cellCols: 60,

  noiseFrequency: 0.04,
  noiseContrast: 10,

  time: {
    flowHorizontal: 0,
    flowVertical: 0.0008,

    loopNoise: 0.004,
  },
} as const;

const xScale = config.width / config.cellRows;
const yScale = config.height / config.cellCols;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const colors: string[] = [];
  for (let i = 0; i < 0xff; i++) {
    const colorRange = i / 0xff;
    colors.push(Colors.getRGB(1 - colorRange, (1 - colorRange) * 0.3, 0));
  }

  let time = 31600;
  const animation = () => {
    time++;

    for (let x = 0; x <= config.cellRows; x++) {
      for (let y = 0; y <= config.cellCols; y++) {
        const noise = Noise.Simplex.get(
          x * config.noiseFrequency + time * config.time.flowHorizontal,
          y * config.noiseFrequency + time * config.time.flowVertical,
        );

        const value = Math.sin(noise * config.noiseContrast + time * config.time.loopNoise) * 0.5 + 0.5;

        const xPosition = x * xScale;
        const yPosition = y * yScale;

        context.fillStyle = colors[(value * 0xff) | 0];
        context.fillRect(xPosition, yPosition, xScale, yScale);
      }
    }

    requestAnimationFrame(animation);
  };

  animation();
}
