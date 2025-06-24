import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Colors } from "@utilities/colors";
import { Config } from "./config";

import plantPNG from "./plant.png";
import { Mathematics } from "@utilities/mathematics";

const cellSize = Config.canvasSize / Config.gridSize;
const pixelSize = Config.canvasSize / Config.gridSize;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.canvasSize;
  canvas.height = Config.canvasSize;

  canvas.style.border = "1px solid #111111";

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function renderLattice(context: CanvasRenderingContext2D) {
  context.lineWidth = 0.5;
  context.strokeStyle = Config.colors.lattice;

  for (let x = 0; x < Config.gridSize; x++) {
    const step = x * cellSize;
    Canvas2D.line(context, step, 0, step, Config.canvasSize);
  }

  for (let y = 0; y < Config.gridSize; y++) {
    const step = y * cellSize;
    Canvas2D.line(context, 0, step, Config.canvasSize, step);
  }
}

function getChebyshevDistance(a: Vector2, b: Vector2) {
  const xDifference = a.x - b.x;
  const yDifference = a.y - b.y;
  return Math.max(Math.abs(xDifference), Math.abs(yDifference));
}

function getLine(a: Vector2, b: Vector2, steps: number) {
  const points: Vector2[] = [];
  const step = 1 / steps;
  for (let i = 1; i < steps; i++) {
    points.push(Vector2.lerp(a, b, step * i).round());
  }
  return points;
}

function createImageData(context: CanvasRenderingContext2D, image: HTMLImageElement) {
  context.drawImage(image, 0, 0, Config.gridSize, Config.gridSize);
  const imageData = context.getImageData(0, 0, Config.gridSize, Config.gridSize).data;
  context.clearRect(0, 0, Config.canvasSize, Config.canvasSize);

  const arr: number[][] = [];

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i + 0];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const index = i / 4;
    const x = index % Config.gridSize;
    const y = Math.floor(index / Config.gridSize);

    if (!arr[x]) arr[x] = [];
    arr[x][y] = r + g + b < 100 ? 0 : 1;
  }

  return arr;
}

function renderPixel(context: CanvasRenderingContext2D, x: number, y: number) {
  context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

function renderPixelData(context: CanvasRenderingContext2D, pixelData: number[][]) {
  for (let x = 0; x < Config.gridSize; x++) {
    for (let y = 0; y < Config.gridSize; y++) {
      context.fillStyle = Colors.getRGBGrayscale(pixelData[x][y]);
      context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }
}

function createPins() {
  const pins: Vector2[] = [];

  const halfSize = Config.gridSize * 0.5;
  const center = new Vector2(halfSize, halfSize);
  const radius = halfSize - 1;

  const angleStep = Mathematics.TAU / Config.pins;

  for (let i = 0; i < Config.pins; i++) {
    const angle = angleStep * i;

    const x = center.x + Math.cos(angle) * radius;
    const y = center.y + Math.sin(angle) * radius;

    pins.push(new Vector2(Math.round(x), Math.round(y)));
  }

  return pins;
}

type LineCell = {
  position: Vector2;
  color: number;
};

function start(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = setupContext(canvas);

  const pixelData = createImageData(context, image);
  // renderPixelData(context, pixelData);

  renderLattice(context);

  const start = new Vector2(0, 0);
  const end = new Vector2(99, 99);

  const chebyshevDistance = getChebyshevDistance(start, end);
  const lineCells = getLine(start, end, chebyshevDistance);

  const grayLine: LineCell[] = lineCells.map((cell) => ({
    position: cell,
    color: pixelData[cell.x][cell.y],
  }));

  for (const cell of grayLine) {
    context.fillStyle = Colors.getRGBGrayscale(cell.color);
    renderPixel(context, cell.position.x, cell.position.y);
  }

  const pins = createPins();

  for (const pin of pins) {
    context.fillStyle = "red";
    context.fillRect(pin.x * cellSize, pin.y * cellSize, cellSize, cellSize);
  }

  context.lineWidth = 1;
  context.strokeStyle = "teal";

  const connectionsCount = Config.pins - Config.gap * 2;

  for (let a = 0; a < pins.length; a++) {
    const aIndex = a;
    const aPin = pins[aIndex];

    for (let b = 0; b < connectionsCount; b++) {
      const bIndex = a + Config.gap + b;
      const bPin = pins[bIndex % pins.length];

      Canvas2D.line(context, aPin.x * cellSize, aPin.y * cellSize, bPin.x * cellSize, bPin.y * cellSize);
    }
  }
}

export async function main(canvas: HTMLCanvasElement) {
  const img = new Image();
  img.src = plantPNG;
  img.onload = () => start(canvas, img);
}
