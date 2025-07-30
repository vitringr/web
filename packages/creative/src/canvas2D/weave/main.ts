import { StringWeaveGenerator } from "@packages/string-weave-generator";
import { Canvas2D } from "@utilities/canvas2d";

import imagePNG from "./images/edit.png";

const defaultConfig: StringWeaveGenerator.Config = {
  canvasSize: 800,
  gridSize: 400,

  pins: 500,
  pinGap: 20,
  resetVisitsAfter: 200,

  maxIterations: 6,
  incrementIterationsAfter: 500,

  stopAfter: 30_000,

  inverseColor: false,

  lineWidth: 0.15,

  colors: {
    // background: "#EEEED0",
    // lines: "#00000050",
    background: "#000000",
    lines: "#EEEED050",
  },
};

let config: StringWeaveGenerator.Config;
let scale: number;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.canvasSize;
  canvas.height = config.canvasSize;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.lineWidth = config.lineWidth;
  context.strokeStyle = config.colors.lines;

  return context;
}

function start(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = setupContext(canvas);

  const { links, imageData: _imageData, pins } = StringWeaveGenerator.generate(image, config);
  // StringWeaveGenerator.Debug.renderImageData(context, _imageData)
  // return;

  const visitedIndices: number[] = new Array(links.length).fill(0);

  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.canvasSize, config.canvasSize);

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
        pins[fromIndex].x,
        pins[fromIndex].y,
        pins[toIndex].x,
        pins[toIndex].y,
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

export function main(canvas: HTMLCanvasElement, settings: Partial<StringWeaveGenerator.Config> = {}) {
  config = { ...defaultConfig, ...settings };
  scale = config.canvasSize / config.gridSize;

  const image = new Image(config.gridSize, config.gridSize);
  image.src = imagePNG;
  image.onload = () => {
    start(canvas, image);
  };
}
