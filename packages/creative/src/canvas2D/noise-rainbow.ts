import { Noise } from "@utilities/noise";

type Config = {
  width: number;
  height: number;

  cellRows: number;
  cellCols: number;

  noiseFrequency: number;
  timeIncrement: number;
  colorHSLRange: number;
};

const defaultConfig: Config = {
  width: 600,
  height: 600,

  cellRows: 60,
  cellCols: 60,

  noiseFrequency: 0.015,
  timeIncrement: 0.0025,
  colorHSLRange: 720,
} as const;

let config: Config;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function createColors() {
  const colors: string[] = [];

  for (let i = 0; i < config.colorHSLRange; i++) {
    colors.push(`hsl(${i}, 90%, 50%)`);
  }

  return colors;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const context = setupContext(canvas);

  const colors = createColors();

  const xScale = config.width / config.cellRows;
  const yScale = config.height / config.cellCols;

  let time = 0;
  const animation = () => {
    time += config.timeIncrement;

    for (let x = 0; x <= config.cellRows; x++) {
      for (let y = 0; y <= config.cellCols; y++) {
        const xNoise = x * config.noiseFrequency + time;
        const yNoise = y * config.noiseFrequency + time;
        const noise = Noise.Simplex.get(xNoise, yNoise);

        const xPosition = x * xScale;
        const yPosition = y * yScale;

        context.fillStyle = colors[Math.floor(noise * config.colorHSLRange)];
        context.fillRect(xPosition, yPosition, xScale, yScale);
      }
    }

    requestAnimationFrame(animation);
  };

  animation();
}
