import { Mathematics } from "@utilities/mathematics";
import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Colors } from "@utilities/colors";
import { Config, defaultConfig } from "./config";

let config: Config;
let cellWidth: number;
let cellHeight: number;

export namespace Debug {
  export function renderPins(context: CanvasRenderingContext2D, pins: Vector2[]) {
    context.fillStyle = "#FFAA00";
    const radius = 3;
    for (const pin of pins) {
      context.fillRect(pin.x * cellWidth, pin.y * cellHeight, radius, radius);
    }
  }

  export function renderImageData(context: CanvasRenderingContext2D, imageData: number[][]) {
    for (let x = 0; x < imageData.length; x++) {
      const row = imageData[x];
      for (let y = 0; y < row.length; y++) {
        context.fillStyle = Colors.getRGBGrayscale(row[y]);
        context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }
}

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function createPins() {
  const pins: Vector2[] = [];

  const gridCenter = new Vector2(config.gridWidth, config.gridHeight).scale(0.5);
  const circleRadius = config.gridWidth * 0.5 - config.radiusGap;

  const angleStep = Mathematics.TAU / config.pins;

  for (let i = 0; i < config.pins; i++) {
    const angle = angleStep * i;

    const x = gridCenter.x + Math.cos(angle) * circleRadius;
    const y = gridCenter.y + Math.sin(angle) * circleRadius;

    pins.push(new Vector2(x, y));
  }

  return pins;
}

function renderImageToCenter(context: CanvasRenderingContext2D, image: HTMLImageElement) {
  const xStart = config.gridWidth * 0.5 - config.gridWidth * config.imageScale * 0.5;
  const yStart = config.gridHeight * 0.5 - config.gridHeight * config.imageScale * 0.5;

  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, config.width, config.height);

  context.drawImage(
    image,
    xStart + config.imageXOffset,
    yStart + config.imageYOffset,
    config.gridWidth * config.imageScale,
    config.gridHeight * config.imageScale,
  );
}

function createImageData(image: HTMLImageElement) {
  const auxCanvas = document.createElement("canvas");
  auxCanvas.width = config.width;
  auxCanvas.height = config.height;

  const auxContext = auxCanvas.getContext("2d");
  if (!auxContext) throw new Error("Cannot get 2d context!");

  // TODO: test this visually.
  // Should probably only get the image data for the actual image provided?
  renderImageToCenter(auxContext, image);

  // Or this... Should it get the gridWidth only, or the whole data?
  const imageData = auxContext.getImageData(0, 0, config.gridWidth, config.gridHeight).data;

  auxContext.clearRect(0, 0, config.width, config.height);

  const data: number[][] = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i + 0];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const index = i / 4;
    const x = index % config.gridWidth;
    const y = Math.floor(index / config.gridWidth);

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
      const linePoints = getLine(aPin, bPin, chebyshevDistance);

      const sumBrightness = linePoints.reduce((sum, v2) => sum + imageData[v2.x][v2.y], 0);
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

export function generate(image: HTMLImageElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };
  cellWidth = config.width / config.gridWidth;
  cellHeight = config.height / config.gridHeight;

  const pins = createPins();
  const imageData = createImageData(image);
  const links = createLinks(pins, imageData);

  return { links, imageData, pins };
}

function start(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = setupContext(canvas);
  const pins = createPins();
  const imageData = createImageData(image);
  const links = createLinks(pins, imageData);

  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);

  context.lineWidth = config.lineWidth;
  context.strokeStyle = config.colors.lines;

  const visitedIndices: number[] = new Array(links.length).fill(0);

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
      // console.log("toIndex:", toIndex);

      // TODO: Experiment without this, instead just use the modulo from above for all
      visitedIndices[fromIndex]++;
      visitedIndices[toIndex]++;

      Canvas2D.line(
        context,
        pins[fromIndex].x * cellWidth,
        pins[fromIndex].y * cellHeight,
        pins[toIndex].x * cellWidth,
        pins[toIndex].y * cellHeight,
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

// export async function main(canvas: HTMLCanvasElement, imageString: string, settings: Partial<Config> = {}) {
//   config = { ...defaultConfig, ...settings };
//   cellWidth = config.width / config.gridWidth;
//   cellHeight = config.height / config.gridHeight;
// }
