import { Mathematics } from "@utilities/mathematics";
import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";

import { type Config, defaultConfig } from "./config";

import imagePNG from "./images/edit.png";

let config: Config;
let scale: number;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.canvasSize;
  canvas.height = config.canvasSize;
  canvas.style.borderRadius = "50%";

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.lineWidth = config.lineWidth;
  context.strokeStyle = config.colors.lines;

  return context;
}

function createPins() {
  const pins: Vector2[] = [];

  const canvasCenter = new Vector2(config.canvasSize, config.canvasSize).scale(0.5);
  const circleRadius = config.canvasSize * 0.5 - 1;

  const angleStep = Mathematics.TAU / config.pins;

  for (let i = 0; i < config.pins; i++) {
    const angle = angleStep * i;

    const x = canvasCenter.x + Math.cos(angle) * circleRadius;
    const y = canvasCenter.y + Math.sin(angle) * circleRadius;

    pins.push(new Vector2(x, y));
  }

  return pins;
}

function createImageData(image: HTMLImageElement) {
  const auxCanvas = document.createElement("canvas");
  auxCanvas.width = config.gridSize;
  auxCanvas.height = config.gridSize;

  const auxContext = auxCanvas.getContext("2d");
  if (!auxContext) throw new Error("Cannot get 2d context!");

  auxContext.fillStyle = "#FFFFFF";
  auxContext.fillRect(0, 0, config.gridSize, config.gridSize);
  auxContext.drawImage(image, 0, 0, config.gridSize, config.gridSize);

  const imageData = auxContext.getImageData(0, 0, config.gridSize, config.gridSize).data;
  auxContext.clearRect(0, 0, config.gridSize, config.gridSize);

  const data: number[][] = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i + 0];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const index = i / 4;
    const x = index % config.gridSize;
    const y = Math.floor(index / config.gridSize);

    let averageColor = (r + g + b) / (256 * 3);
    if (config.inverseColor) averageColor = Math.abs(averageColor - 1);

    if (!data[x]) data[x] = [];
    data[x][y] = averageColor;
  }

  return data;
}

function getLine(a: Vector2, b: Vector2, steps: number) {
  const points: Vector2[] = [];
  const step = 1 / steps;
  for (let i = 1; i < steps; i++) {
    points.push(Vector2.lerp(a, b, step * i).round());
  }
  return points;
}

function getScaledLine(a: Vector2, b: Vector2, steps: number) {
  return getLine(a, b, steps).map((line) => line.scale(1 / scale).floor());
}

function createLinks(pins: Vector2[], imageData: number[][]) {
  const links: number[][][] = [];

  const visited = new Set<string>();
  for (let a = 0; a < pins.length; a++) {
    for (let b = 0; b < pins.length; b++) {
      if (a === b) continue;

      const difference = Math.abs(a - b);
      const wrappedDifference = Math.min(difference, pins.length - difference);
      if (wrappedDifference <= config.pinGap) continue;

      const key = Math.min(a, b) + "," + Math.max(a, b);
      if (visited.has(key)) continue;
      visited.add(key);

      const aPin = pins[a];
      const bPin = pins[b];
      const chebyshevDistance = Vector2.chebyshevDistance(aPin, bPin);
      const linePoints = getScaledLine(aPin, bPin, chebyshevDistance);

      const sumBrightness = linePoints.reduce((sum, point) => sum + imageData[point.x][point.y], 0);
      const averageBrightness = sumBrightness / linePoints.length;

      if (!links[a]) links[a] = [];
      if (!links[b]) links[b] = [];

      links[a].push([b, averageBrightness]);
      links[b].push([a, averageBrightness]);
    }
  }

  for (const link of links) {
    link.sort((a, b) => a[1] - b[1]);
  }

  const removedBrightnessLinks = links.map((to) => to.map((data) => data[0]));

  return removedBrightnessLinks;
}

function start(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = setupContext(canvas);

  const pins = createPins();
  const imageData = createImageData(image);
  const links = createLinks(pins, imageData);

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

      Canvas2D.line(context, pins[fromIndex].x, pins[fromIndex].y, pins[toIndex].x, pins[toIndex].y);

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
  scale = config.canvasSize / config.gridSize;

  const image = new Image(config.gridSize, config.gridSize);
  image.src = imagePNG;
  image.onload = () => {
    start(canvas, image);
  };
}
