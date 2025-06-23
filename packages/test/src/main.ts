import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Colors } from "@utilities/colors";
import { Config } from "./config";

import plantPNG from "./plant.png";

const cellSize = Config.canvasSize / Config.rows;
const cellSizeHalf = cellSize * 0.5;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.canvasSize;
  canvas.height = Config.canvasSize;

  canvas.style.border = "1px solid red";

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function renderLattice(context: CanvasRenderingContext2D) {
  context.lineWidth = 0.5;
  context.strokeStyle = Config.colors.lattice;

  for (let x = 0; x < Config.rows; x++) {
    const step = x * cellSize;
    Canvas2D.line(context, step, 0, step, Config.canvasSize);
  }

  for (let y = 0; y < Config.rows; y++) {
    const step = y * cellSize;
    Canvas2D.line(context, 0, step, Config.canvasSize, step);
  }
}

function renderCell(context: CanvasRenderingContext2D, x: number, y: number) {
  Canvas2D.circleFill(
    context,
    x * cellSize + cellSizeHalf,
    y * cellSize + cellSizeHalf,
    Config.renderCellRadius,
  );
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

function createImageData(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
) {
  context.drawImage(image, 0, 0, Config.imageSize, Config.imageSize);
  const imageData = context.getImageData(
    0,
    0,
    Config.imageSize,
    Config.imageSize,
  ).data;
  context.clearRect(0, 0, Config.canvasSize, Config.canvasSize);

  const arr: number[][] = [];

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i + 0];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const index = i / 4;
    const x = index % Config.imageSize;
    const y = Math.floor(index / Config.imageSize);

    if (!arr[x]) arr[x] = [];
    arr[x][y] = r + g + b < 100 ? 0 : 1;
  }

  return arr;
}

function start(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = setupContext(canvas);

  const pixelData = createImageData(context, image);
  for (let x = 0; x < Config.imageSize; x++) {
    for (let y = 0; y < Config.imageSize; y++) {
      context.fillStyle = Colors.getRGBGrayscale(pixelData[x][y]);
      context.fillRect(x * 6, y * 6, 6, 6);
    }
  }

  renderLattice(context);

  const start = new Vector2(5, 0);
  const end = new Vector2(29, 25);

  const chebyshevDistance = getChebyshevDistance(start, end);
  const lineCells = getLine(start, end, chebyshevDistance);

  context.fillStyle = "teal";
  renderCell(context, start.x, start.y);
  renderCell(context, end.x, end.y);

  context.fillStyle = "orange";
  for (const point of lineCells) {
    renderCell(context, point.x, point.y);
  }
}

export async function main(canvas: HTMLCanvasElement) {
  const img = new Image();
  img.src = plantPNG;
  img.onload = () => start(canvas, img);
}
