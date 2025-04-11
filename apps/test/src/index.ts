import { Mathematics } from "@utilities/mathematics";
import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Random } from "@utilities/random";

const canvasSize = 800;

const pixelSize = 20;
const pixelCount = canvasSize / pixelSize;

// -----------
// -- Setup --
// -----------

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

canvas.width = canvasSize;
canvas.height = canvasSize;

const context = canvas.getContext("2d");
if (!context) throw "Cannot get 2d context";

context.fillStyle = "#111111";
context.fillRect(0, 0, canvasSize, canvasSize);

// ------------
// -- Pixels --
// ------------

const pixels: Vector2[][] = [];

for (let x = 0; x < pixelCount; x++) {
  pixels.push([]);
  for (let y = 0; y < pixelCount; y++) {
    pixels[x].push(new Vector2(x * pixelSize, y * pixelSize));
  }
}

context.strokeStyle = "#FFFFFF";
context.lineWidth = 0.1;

for (let x = 0; x < pixelCount; x++) {
  Canvas2D.line(context, x * pixelSize, 0, x * pixelSize, canvasSize);
}

for (let y = 0; y < pixelCount; y++) {
  Canvas2D.line(context, 0, y * pixelSize, canvasSize, y * pixelSize);
}

context.fillStyle = "#555555";

// -------------
// -- Vectors --
// -------------

const vectors: Vector2[][] = [];

const gridPixels = 4;
const cornerCount = pixelCount / gridPixels;

for (let x = 0; x <= cornerCount; x++) {
  vectors.push([]);
  for (let y = 0; y <= cornerCount; y++) {
    const angle = Random.range(0, Mathematics.TAU);
    vectors[x].push(new Vector2(Math.cos(angle), Math.sin(angle)));
  }
}

context.strokeStyle = "#909090";
context.lineWidth = 1;

for (let x = 0; x <= cornerCount; x++) {
  for (let y = 0; y <= cornerCount; y++) {
    const xOrigin = x * pixelSize * gridPixels;
    const yOrigin = y * pixelSize * gridPixels;

    const arrow = vectors[x][y].clone().scale(12).increase(xOrigin, yOrigin);

    Canvas2D.fillCircle(context, xOrigin, yOrigin, 3);

    Canvas2D.line(context, xOrigin, yOrigin, arrow.x, arrow.y);
  }
}

// ----------
// -- Main --
// ----------

for (let x = 0; x < cornerCount; x++) {
  for (let y = 0; y < cornerCount; y++) {
    // const cellCoordinate = new Vector2(
    //   Math.floor(x / gridPixels),
    //   Math.floor(y / gridPixels),
    // );

    // const tl = vectors[cellCoordinate.x + 0][cellCoordinate.y + 0];
    // const tr = vectors[cellCoordinate.x + 1][cellCoordinate.y + 0];
    // const bl = vectors[cellCoordinate.x + 0][cellCoordinate.y + 1];
    // const br = vectors[cellCoordinate.x + 1][cellCoordinate.y + 1];
  }
}
