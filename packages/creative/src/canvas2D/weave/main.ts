import { StringWeaveGenerator } from "@packages/string-weave-generator";
import { Config, defaultConfig } from "./config";

import imagePNG from "./images/edit.png";
import { Canvas2D } from "@utilities/canvas2d";

let config: Config;
let cellWidth: number;
let cellHeight: number;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.lineWidth = config.lineWidth;
  context.strokeStyle = config.colors.lines;

  return context;
}

function start(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = setupContext(canvas);

  const { links, imageData: _imageData, pins } = StringWeaveGenerator.generate(image);

  const visitedIndices: number[] = new Array(links.length).fill(0);

  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);

  let loop = 0;
  let frame = 0;
  let fromIndex = 42;
  let iterations = 0;
  const animation = () => {
    if (frame >= config.stopAfter) return;

    loop++;
    iterations = Math.min(1 + Math.floor(loop / config.incrementIterationsAfter), config.maxIterations);

    const iteration = () => {
      frame++;

      const shuffle = visitedIndices[fromIndex] % config.resetVisitsAfter;
      const toIndex = links[fromIndex][shuffle];

      visitedIndices[fromIndex]++;
      visitedIndices[toIndex]++;

      Canvas2D.line(
        context,
        pins[fromIndex].x * cellWidth,
        pins[fromIndex].y * cellHeight,
        pins[toIndex].x * cellWidth,
        pins[toIndex].y * cellHeight,
      );

      fromIndex = toIndex;
    };

    for (let i = 0; i < iterations; i++) {
      iteration();
    }

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };
  cellWidth = config.width / config.gridWidth;
  cellHeight = config.height / config.gridHeight;

  const image = new Image(config.gridWidth, config.gridHeight);
  image.src = imagePNG;
  image.onload = () => {
    start(canvas, image);
  };
}
