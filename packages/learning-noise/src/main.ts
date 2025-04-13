import { Mathematics } from "@utilities/mathematics";
import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Random } from "@utilities/random";
import { Config } from "./config";

// -----------
// -- Setup --
// -----------

const pixelWidth = Config.width / Config.pixelsPerRow;
const cellWidth = Config.width / Config.cellsPerRow;
const pixelsPerCell = Config.pixelsPerRow / Config.cellsPerRow;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = canvas.height = Config.width;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.fillStyle = "#111111";
  context.fillRect(0, 0, Config.width, Config.width);

  return context;
}

function getColor(value: number) {
  const byte = Math.floor(value * 255);
  return `rgb(${byte},${byte},${byte})`;
}

class Pixel {
  static createAll() {
    const pixels: Pixel[][] = [];

    for (let x = 0; x < Config.pixelsPerRow; x++) {
      pixels.push([]);
      for (let y = 0; y < Config.pixelsPerRow; y++) {
        pixels[x].push(new Pixel(x, y));
      }
    }

    return pixels;
  }

  static renderAll(pixels: Pixel[][]) {
    for (const row of pixels) {
      for (const pixel of row) {
        pixel.render();
      }
    }

    if (!Config.pixelLines) return;

    context.strokeStyle = Config.colors.pixelBorder;
    context.lineWidth = Config.pixelBorderWidth;

    for (let x = 0; x <= Config.pixelsPerRow; x++) {
      Canvas2D.line(context, 0, x * pixelWidth, Config.width, x * pixelWidth);
    }

    for (let y = 0; y <= Config.pixelsPerRow; y++) {
      Canvas2D.line(context, y * pixelWidth, 0, y * pixelWidth, Config.width);
    }
  }

  readonly position = Vector2.zero();

  color: number = 0.1;
  // color = Random.range(0, 1);

  constructor(
    readonly x: number,
    readonly y: number,
  ) {
    this.position.set(x * pixelWidth, y * pixelWidth);
  }

  render() {
    context.fillStyle = getColor(this.color);
    context.fillRect(this.position.x, this.position.y, pixelWidth, pixelWidth);
  }
}

class Gradient {
  static createAll() {
    const gradients: Gradient[][] = [];

    for (let x = 0; x <= Config.cellsPerRow; x++) {
      gradients.push([]);
      for (let y = 0; y <= Config.cellsPerRow; y++) {
        gradients[x].push(new Gradient(x, y));
      }
    }

    return gradients;
  }

  static renderAll(gradients: Gradient[][]) {
    context.strokeStyle = context.fillStyle = Config.colors.gradient;
    context.lineWidth = Config.gradientArrowWidth;

    for (const row of gradients) {
      for (const cell of row) {
        cell.render();
      }
    }
  }

  readonly vector = Vector2.zero();
  readonly position = Vector2.zero();

  constructor(
    readonly x: number,
    readonly y: number,
  ) {
    this.position.set(x * cellWidth, y * cellWidth);

    const angle = Random.range(0, Mathematics.TAU);
    this.vector.set(Math.cos(angle), Math.sin(angle));
  }

  render() {
    Canvas2D.fillCircle(
      context,
      this.position.x,
      this.position.y,
      Config.gradientCircle,
    );

    const arrow = this.vector
      .clone()
      .scale(Config.gradientArrowLength)
      .add(this.position);
    Canvas2D.line(context, this.position.x, this.position.y, arrow.x, arrow.y);
  }
}

class Cell {
  static createAll() {
    const cells: Cell[][] = [];

    for (let x = 0; x < Config.cellsPerRow; x++) {
      cells.push([]);
      for (let y = 0; y < Config.cellsPerRow; y++) {
        cells[x].push(new Cell(x, y));
      }
    }

    return cells;
  }

  static renderAll(cells: Cell[][]) {
    context.strokeStyle = Config.colors.cellBorder;

    for (const row of cells) {
      for (const cell of row) {
        cell.render();
      }
    }
  }

  readonly position = Vector2.zero();
  // color = Random.range(0, 1);

  constructor(
    readonly x: number,
    readonly y: number,
  ) {
    this.position.set(x * cellWidth, y * cellWidth);
  }

  render() {
    context.strokeRect(this.position.x, this.position.y, cellWidth, cellWidth);
  }
}

// ----------
// -- Main --
// ----------

const context = setupContext();

const pixels = Pixel.createAll();
const cells = Cell.createAll();
const gradients = Gradient.createAll();

function getTargetCell(x: number, y: number) {
  const xCell = Math.floor(x / pixelsPerCell);
  const yCell = Math.floor(y / pixelsPerCell);

  return cells[xCell][yCell];
}

function getTargetGradients(x: number, y: number) {
  const xCell = Math.floor(x / pixelsPerCell);
  const yCell = Math.floor(y / pixelsPerCell);

  return [
    gradients[xCell][yCell],
    gradients[xCell + 1][yCell],
    gradients[xCell][yCell + 1],
    gradients[xCell + 1][yCell + 1],
  ];
}

function dot(ax: number, ay: number, bx: number, by: number) {
  return ax * bx + ay * by;
}

for (const row of pixels) {
  for (const pixel of row) {
    const xPos = (pixel.x % pixelsPerCell) / pixelsPerCell;
    const yPos = (pixel.y % pixelsPerCell) / pixelsPerCell;

    const [g00, g10, g01, g11] = getTargetGradients(pixel.x, pixel.y);

    const d00 = new Vector2(xPos, yPos);
    const d10 = new Vector2(xPos - 1, yPos);
    const d01 = new Vector2(xPos, yPos - 1);
    const d11 = new Vector2(xPos - 1, yPos - 1);

    const dot00 = dot(g00.vector.x, g00.vector.y, d00.x, d00.y);
    const dot10 = dot(g10.vector.x, g10.vector.y, d10.x, d10.y);
    const dot01 = dot(g01.vector.x, g01.vector.y, d01.x, d01.y);
    const dot11 = dot(g11.vector.x, g11.vector.y, d11.x, d11.y);

    function interpolate(a: number, b: number, t: number) {
      const t2 = t * t * (3 - 2 * t);
      return a + (b - a) * t2;
    }

    const ix0 = interpolate(dot00, dot10, xPos);
    const ix1 = interpolate(dot01, dot11, xPos);
    const value = interpolate(ix0, ix1, yPos);

    pixel.color = (value + 1) / 2;
  }
}

// ------------
// -- Render --
// ------------

Pixel.renderAll(pixels);
// Cell.renderAll(cells);
// Gradient.renderAll(gradients);
