/*

Draw image.

Get image data.

Rasterize image into a pixel lattice.

Setup pins.

Save pixel lines from each pin to its possible others.

Save the pixel lines with their average black color.

*/

import { Mathematics } from "@utilities/mathematics";
import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Config, defaultConfig } from "./config";

import zergPNG from "./zerg.png";

let config: Config;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function renderLattice(context: CanvasRenderingContext2D) {
  const cellWidth = config.width / config.gridWidth;
  const cellHeight = config.height / config.gridHeight;

  context.lineWidth = 0.2;
  context.strokeStyle = config.colors.lattice;

  for (let x = 0; x < config.gridWidth; x++) {
    const step = x * cellWidth;
    Canvas2D.line(context, step, 0, step, config.height);
  }

  for (let y = 0; y < config.gridHeight; y++) {
    const step = y * cellHeight;
    Canvas2D.line(context, 0, step, config.width, step);
  }
}

function getLine(a: Vector2, b: Vector2, steps: number) {
  const points: Vector2[] = [];
  const step = 1 / steps;
  for (let i = 1; i < steps; i++) {
    points.push(Vector2.lerp(a, b, step * i).round());
  }
  return points;
}

function createPins() {
  const pins: Vector2[] = [];

  const center = new Vector2(config.width, config.height).scale(0.5);
  const radius = config.width * 0.5 - 1;

  const angleStep = Mathematics.TAU / config.pins;

  for (let i = 0; i < config.pins; i++) {
    const angle = angleStep * i;

    const x = center.x + Math.cos(angle) * radius;
    const y = center.y + Math.sin(angle) * radius;

    pins.push(new Vector2(Math.round(x), Math.round(y)));
  }

  return pins;
}

function createImageData(context: CanvasRenderingContext2D, image: HTMLImageElement) {
  context.drawImage(image, 0, 0, config.gridWidth, config.gridHeight);
  const imageData = context.getImageData(0, 0, config.gridWidth, config.gridHeight).data;
  context.clearRect(0, 0, config.width, config.height);

  const arr: number[][] = [];

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i + 0];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const index = i / 4;
    const x = index % config.gridWidth;
    const y = Math.floor(index / config.gridWidth);

    if (!arr[x]) arr[x] = [];
    arr[x][y] = r + g + b < 100 ? 0 : 1;
  }

  return arr;
}

function renderImageData(context: CanvasRenderingContext2D, imageData: number[][]) {
  const cellWidth = config.width / config.gridWidth;
  const cellHeight = config.height / config.gridHeight;
  for (let x = 0; x < imageData.length; x++) {
    const row = imageData[x];
    for (let y = 0; y < row.length; y++) {
      context.fillStyle = row[y] === 0 ? "#00000011" : "#AAAAAA11";
      context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    }
  }
}

function renderPins(context: CanvasRenderingContext2D, pins: Vector2[]) {
  context.fillStyle = "orange";
  for (const pin of pins) {
    Canvas2D.circleFill(context, pin.x, pin.y, 3);
  }
}

function start(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = setupContext(canvas);
  const imageData = createImageData(context, image);
  const pins = createPins();

  renderLattice(context);
  renderImageData(context, imageData);
  renderPins(context, pins);

  context.strokeStyle = "red";
  context.lineWidth = 1;
  for (let i = 0; i < pins.length; i++) {
    for (let k = 0; k < pins.length; k++) {
      const from = pins[i];
      const to = pins[k];

      const difference = Math.abs(i - k);
      const wrappedDifference = Math.min(difference, pins.length - difference);
      if (wrappedDifference <= config.pinGap) continue;

      Canvas2D.line(context, from.x, from.y, to.x, to.y);
    }
  }
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const img = new Image(config.gridWidth, config.gridHeight);
  img.src = zergPNG;
  img.onload = () => start(canvas, img);
}
