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

function setupContext() {
  const canvasID = "mainCanvas";
  const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
  if (!canvas) throw `Cannot get #${canvasID}`;

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

const target = pixels[3][2];
target.color = 0.6;

// ------------
// -- Render --
// ------------

Pixel.renderAll(pixels);
Cell.renderAll(cells);
Gradient.renderAll(gradients);
