import { Canvas2D } from "@utilities/canvas2d";
import { Config } from "./config";
import { Vector2 } from "@utilities/vector";

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

function diagonalDistance(a: Vector2, b: Vector2) {
  const xDifference = a.x - b.x;
  const yDifference = a.y - b.y;
  return Math.max(Math.abs(xDifference), Math.abs(yDifference));
}

export async function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  renderLattice(context);


  context.fillStyle = "yellow";

  renderCell(context, 1, 2)

  const loop = () => {
    requestAnimationFrame(loop);
  };

  loop();
}
