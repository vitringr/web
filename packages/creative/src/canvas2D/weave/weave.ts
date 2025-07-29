import { Mathematics } from "@utilities/mathematics";
import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Config, defaultConfig } from "./config";

import zergPNG from "./KEKEKE.png";

let config: Config;
let cellWidth: number;
let cellHeight: number;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function renderLattice(context: CanvasRenderingContext2D) {
  context.lineWidth = config.debug.latticeLineWidth;
  context.strokeStyle = config.debug.colors.lattice;

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

  const center = new Vector2(config.gridWidth, config.gridHeight).scale(0.5);
  const radius = config.gridWidth * 0.5 - 1;

  const angleStep = Mathematics.TAU / config.pins;

  for (let i = 0; i < config.pins; i++) {
    const angle = angleStep * i;

    const x = center.x + Math.cos(angle) * radius;
    const y = center.y + Math.sin(angle) * radius;

    pins.push(new Vector2(x, y));
  }

  return pins;
}

function createImageData(context: CanvasRenderingContext2D, image: HTMLImageElement) {
  const scale = config.imageScale;
  const xStart = config.gridWidth * 0.5 - config.gridWidth * scale * 0.5;
  const yStart = config.gridHeight * 0.5 - config.gridHeight * scale * 0.5;

  context.drawImage(image, xStart, yStart, config.gridWidth * scale, config.gridHeight * scale);

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
    let result = r + g + b < config.imageMinColor ? 1 : 0;
    config.imageInverse && (result = Math.abs(result - 1));
    arr[x][y] = result;
  }

  return arr;
}

function renderImageData(context: CanvasRenderingContext2D, imageData: number[][]) {
  for (let x = 0; x < imageData.length; x++) {
    const row = imageData[x];
    for (let y = 0; y < row.length; y++) {
      context.fillStyle = row[y] === 0 ? config.debug.colors.imageDark : config.debug.colors.imageWhite;
      context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    }
  }
}

function renderPins(context: CanvasRenderingContext2D, pins: Vector2[]) {
  context.fillStyle = "orange";
  for (const pin of pins) {
    context.fillRect(pin.x * cellWidth, pin.y * cellHeight, cellWidth, cellHeight);
  }
}

type Connection = { from: number; to: number };

function createConnections(pins: Vector2[]) {
  const connections: Connection[] = [];

  for (let i = 0; i < pins.length; i++) {
    for (let k = 0; k < pins.length; k++) {
      const difference = Math.abs(i - k);
      const wrappedDifference = Math.min(difference, pins.length - difference);
      if (wrappedDifference <= config.pinGap) continue;

      connections.push({ from: i, to: k });
    }
  }

  return connections;
}

function renderConnections(context: CanvasRenderingContext2D, pins: Vector2[], connections: Connection[]) {
  context.strokeStyle = config.debug.colors.connections;
  context.lineWidth = config.debug.connectionsLineWidth;

  for (const connection of connections) {
    const from = pins[connection.from];
    const to = pins[connection.to];
    Canvas2D.line(context, from.x * cellWidth, from.y * cellHeight, to.x * cellWidth, to.y * cellHeight);
  }
}

type ConnectionWithData = {
  fromIndex: number;
  toIndex: number;
  color: number;
};

type Line = {
  targetIndex: number;
  color: number;
};

function createSortedLines(pins: Vector2[], connections: Connection[], imageData: number[][]) {
  const connectionsWithData: ConnectionWithData[] = [];

  for (const connection of connections) {
    const fromIndex = connection.from;
    const toIndex = connection.to;

    const fromPin = pins[fromIndex];
    const toPin = pins[toIndex];

    const chebyshevDistance = Vector2.chebyshevDistance(fromPin, toPin);
    const lineCoordinates = getLine(fromPin, toPin, chebyshevDistance);

    const sumColor = lineCoordinates.reduce((sum, v2) => {
      return sum + imageData[v2.x][v2.y];
    }, 0);
    const averageColor = sumColor / lineCoordinates.length;
    const color = config.averageColor ? averageColor : sumColor;

    connectionsWithData.push({ fromIndex, toIndex, color });
  }

  const lines: Line[][] = [];
  for (let i = 0; i < config.pins; i++) {
    lines.push([]);
  }

  for (const cwd of connectionsWithData) {
    const line: Line = { targetIndex: cwd.toIndex, color: cwd.color };
    lines[cwd.fromIndex].push(line);
  }

  for (const linesFrom of lines) {
    linesFrom.sort((a, b) => b.color - a.color);
  }

  return lines;
}

function start(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = setupContext(canvas);
  const imageData = createImageData(context, image);
  const pins = createPins();
  const connections = createConnections(pins);
  const sortedLines = createSortedLines(pins, connections, imageData);

  config.debug.renderImageData && renderImageData(context, imageData);
  config.debug.renderPins && renderPins(context, pins);
  config.debug.renderConnections && renderConnections(context, pins, connections);
  config.debug.renderLattice && renderLattice(context);

  if (!config.debug.renderMain) return;

  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);

  context.lineWidth = config.lineWidth;
  context.strokeStyle = config.colors.lines;

  const visitedIndices: number[] = new Array(sortedLines.length).fill(0);

  let frame = 0;
  let currentIndex = 0;
  const animation = () => {
    if (++frame >= config.stopAfter) {
      console.log("end");
      return;
    }

    const linesFrom = sortedLines[currentIndex];
    const timesVisited = visitedIndices[currentIndex];

    const targetIndex = linesFrom[timesVisited % 50].targetIndex;

    visitedIndices[currentIndex]++;
    visitedIndices[targetIndex]++;

    Canvas2D.line(
      context,
      pins[currentIndex].x * cellWidth,
      pins[currentIndex].y * cellHeight,
      pins[targetIndex].x * cellWidth,
      pins[targetIndex].y * cellHeight,
    );
    currentIndex = targetIndex;

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };
  cellWidth = config.width / config.gridWidth;
  cellHeight = config.height / config.gridHeight;

  const img = new Image(config.gridWidth, config.gridHeight);
  img.src = zergPNG;
  img.onload = () => start(canvas, img);
}
