import { Colors } from "@utilities/colors";
import { Noise } from "@utilities/noise";

import systemShockPNG from "./system-shock.png";

const defaultConfig = {
  width: 780,
  height: 648,

  imageWidth: 86,
  imageHeight: 72,

  spriteWidth: 11,
  spriteHeight: 11,

  minBrightness: 0.1,

  updateChance: 0.008,

  noiseFrequency: 0.3,

  timeIncrement: 0.01,

  colors: {
    background: "#111111",
    font: "#999999",
  },

  characters: ["1", "2", "3", "a", "b", "c", "A", "B", "X"],
};

type Config = typeof defaultConfig;

function setupContext(canvas: HTMLCanvasElement, config: Config) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function createImageData(context: CanvasRenderingContext2D, image: HTMLImageElement, config: Config) {
  context.drawImage(image, 0, 0, config.imageWidth, config.imageHeight);

  const imageData = context.getImageData(0, 0, config.imageWidth, config.imageHeight).data;

  context.clearRect(0, 0, config.width, config.height);

  const arr: number[][] = [];

  const step = (255 * 3) / config.characters.length;

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i + 0];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const index = i / 4;
    const x = index % config.imageWidth;
    const y = Math.floor(index / config.imageWidth);

    if (!arr[x]) arr[x] = [];
    // arr[x][y] = `rgb(${r},${g},${b})`;
    arr[x][y] = Math.floor((r + g + b) / step);
  }

  return arr;
}

function createSprites(color: string, config: Config) {
  const sprites: HTMLImageElement[] = [];

  const width = config.spriteWidth;
  const height = config.spriteHeight;
  const halfWidth = width * 0.5;
  const halfHeight = height * 0.5;

  const yOffset = height * 0.1;

  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = width;
  offscreenCanvas.height = height;

  const offscreenContext = offscreenCanvas.getContext("2d");
  if (!offscreenContext) throw "Cannot get 2d context!";
  offscreenContext.font = `${width}px Arial, sans-serif`;
  offscreenContext.fillStyle = color;
  offscreenContext.textAlign = "center";
  offscreenContext.textBaseline = "middle";
  offscreenContext.textRendering = "optimizeLegibility";

  for (let i = 0; i < config.characters.length; i++) {
    offscreenContext.fillStyle = config.colors.background;
    offscreenContext.fillRect(0, 0, width, height);
    offscreenContext.fillStyle = color;
    offscreenContext.fillText(config.characters[i], halfWidth, halfHeight + yOffset);

    const img = new Image();
    img.src = offscreenCanvas.toDataURL();

    sprites.push(img);
  }

  return sprites;
}

function createAllSprites(config: Config) {
  const allSprites: HTMLImageElement[][] = [];

  for (let i = 0; i < config.characters.length; i++) {
    const brightness = config.minBrightness + (i * (1 - config.minBrightness)) / config.characters.length;
    const color = Colors.getRGBGrayscale(brightness);
    const sprites = createSprites(color, config);
    allSprites.push(sprites);
  }

  return allSprites;
}

function start(canvas: HTMLCanvasElement, image: HTMLImageElement, config: Config) {
  const context = setupContext(canvas, config);

  const imageData = createImageData(context, image, config);

  const allSprites = createAllSprites(config);

  const xRatio = config.width / config.imageWidth;
  const yRatio = config.height / config.imageHeight;

  let time = 0;
  const animation = () => {
    time += config.timeIncrement;

    for (let x = 0; x < imageData.length; x++) {
      for (let y = 0; y < imageData[x].length; y++) {
        if (Math.random() > config.updateChance) continue;

        const brightness = imageData[x][y];

        const xNoise = x * config.noiseFrequency;
        const yNoise = (y + time) * config.noiseFrequency;
        const character = Math.floor(Noise.Simplex.get(xNoise, yNoise) * config.characters.length);

        const xPosition = x * xRatio;
        const yPosition = y * yRatio;

        context.drawImage(allSprites[brightness][character], xPosition, yPosition);
      }
    }

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}

export function main(canvas: HTMLCanvasElement, config: Partial<Config> = {}) {
  const cfg: Config = { ...defaultConfig, ...config };

  const image = new Image();
  image.src = systemShockPNG;
  image.onload = () => {
    start(canvas, image, cfg);
  };
}
