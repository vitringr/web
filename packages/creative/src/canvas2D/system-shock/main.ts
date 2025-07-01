import { Colors } from "@utilities/colors";
import systemShockPNG from "./system-shock.png";

const config = {
  width: 1152,
  height: 648,

  imageWidth: 128,
  imageHeight: 72,

  spriteWidth: 15,
  spriteHeight: 15,

  colors: {
    background: "#111111",
    font: "#999999",
  },
} as const;

const characters = [
  " ",
  ".",
  "-",
  "~",
  "1",
  "2",
  "3",
  "a",
  "b",
  "c",
  "A",
  "B",
  "S",
] as const;

const xRatio = config.width / config.imageWidth;
const yRatio = config.height / config.imageHeight;

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

function createImageData(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
) {
  context.drawImage(image, 0, 0, config.imageWidth, config.imageHeight);

  const imageData = context.getImageData(
    0,
    0,
    config.imageWidth,
    config.imageHeight,
  ).data;

  context.clearRect(0, 0, config.width, config.height);

  const arr: number[][] = [];

  const step = (255 * 3) / characters.length;

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

function createSprites(color: string) {
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

  for (let i = 0; i < characters.length; i++) {
    offscreenContext.clearRect(0, 0, width, height);
    offscreenContext.fillText(characters[i], halfWidth, halfHeight + yOffset);

    const img = new Image();
    img.src = offscreenCanvas.toDataURL();

    sprites.push(img);
  }

  return sprites;
}

function start(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = setupContext(canvas);

  const imageData = createImageData(context, image);

  const allSprites: HTMLImageElement[][] = [];

  for (let i = 0; i < characters.length; i++) {
    const color = Colors.getRGBGrayscale(0.2 + i * (0.8 / characters.length));
    const sprites = createSprites(color);
    allSprites.push(sprites);
  }

  for (let x = 0; x < imageData.length; x++) {
    for (let y = 0; y < imageData[x].length; y++) {
      const brightness = imageData[x][y];

      context.drawImage(
        allSprites[brightness][brightness],
        x * xRatio,
        y * yRatio,
      );
    }
  }

  const animation = () => {
    // renderBackground(context);
    requestAnimationFrame(animation);
  };

  animation();
}

export function main(canvas: HTMLCanvasElement) {
  const image = new Image();
  image.src = systemShockPNG;
  image.onload = () => {
    start(canvas, image);
  };
}
