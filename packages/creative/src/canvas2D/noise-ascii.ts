import { Mathematics } from "../../../../utilities/mathematics/src";
import { Noise } from "@utilities/noise";

const defaultConfig = {
  width: 600,
  height: 600,

  gap: 30,
  gapOffset: 0.9,

  spriteWidth: 15,
  spriteHeight: 15,

  noiseFrequency: 0.03,
  timeIncrement: 0.0015,

  colors: {
    background: "#111111",
    font: "#999999",
  },

  characters: [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
};

type Config = typeof defaultConfig;

let config: Config;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context!";

  return context;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);
}

function setupSprites() {
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
  offscreenContext.fillStyle = config.colors.font;
  offscreenContext.textAlign = "center";
  offscreenContext.textBaseline = "middle";
  offscreenContext.textRendering = "optimizeLegibility";

  for (let i = 0; i < config.characters.length; i++) {
    offscreenContext.clearRect(0, 0, width, height);
    offscreenContext.fillText(config.characters[i], halfWidth, halfHeight + yOffset);

    const img = new Image();
    img.src = offscreenCanvas.toDataURL();

    sprites.push(img);
  }

  return sprites;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const context = setupContext(canvas);

  const sprites = setupSprites();

  const size = (config.width - 2 * config.gap) / config.spriteWidth;
  const gap = config.gap * config.gapOffset;
  const charactersLength = config.characters.length;

  let time = 0;
  const animation = () => {
    time += config.timeIncrement;

    renderBackground(context);

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const xPosition = gap + x * config.spriteWidth;
        const yPosition = gap + y * config.spriteHeight;

        const noiseValue = Noise.Simplex.get(x * config.noiseFrequency + time, y * config.noiseFrequency + time);

        const noiseIndex = Math.floor(Mathematics.lerp(0, charactersLength, noiseValue)) | 0;

        context.drawImage(sprites[noiseIndex], xPosition, yPosition);
      }
    }

    requestAnimationFrame(animation);
  };

  animation();
}
