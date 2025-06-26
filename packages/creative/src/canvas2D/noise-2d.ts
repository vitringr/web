import { Colors } from "@utilities/colors";
import { Noise } from "@utilities/noise";

const config = {
  width: 600,
  height: 600,

  cellRows: 60,
  cellCols: 60,

  noiseScale: 0.05,

  timeIncrement: 0.003,
} as const;

const xScale = config.width / config.cellRows;
const yScale = config.height / config.cellCols;

const noise = Noise.simplex();

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
    colors.push(Colors.getRGB(colorRange, colorRange, colorRange));
  }

  let time = 0;
  const animation = () => {
    time += config.timeIncrement;

    for (let x = 0; x <= config.cellRows; x++) {
      for (let y = 0; y <= config.cellCols; y++) {
        const xNoise = x * config.noiseScale + time;
        const yNoise = y * config.noiseScale + time;

        const noiseValue = noise(xNoise, yNoise);

        const xPosition = x * xScale;
        const yPosition = y * yScale;

        context.fillStyle = colors[(noiseValue * 0xff) | 0];
        context.fillRect(xPosition, yPosition, xScale, yScale);
      }
    }

    requestAnimationFrame(animation);
  };

  animation();
}
