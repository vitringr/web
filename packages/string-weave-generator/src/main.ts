import { Mathematics } from "@utilities/mathematics";
import { Vector2 } from "@utilities/vector";
import { Colors } from "@utilities/colors";
import { type Config, defaultConfig } from "./config";

export { type Config } from "./config";

let config: Config;
let scale: number;

export namespace Debug {
  export function renderPins(context: CanvasRenderingContext2D, pins: Vector2[]) {
    context.fillStyle = "#FFAA00";
    const radius = 3;
    for (const pin of pins) {
      context.fillRect(pin.x * scale, pin.y * scale, radius, radius);
    }
  }

  export function renderImageData(context: CanvasRenderingContext2D, imageData: number[][]) {
    for (let x = 0; x < imageData.length; x++) {
      const row = imageData[x];
      for (let y = 0; y < row.length; y++) {
        context.fillStyle = Colors.getRGBGrayscale(row[y]);
        context.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
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

export function generate(image: HTMLImageElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };
  scale = config.canvasSize / config.gridSize;

  const pins = createPins();
  const imageData = createImageData(image);
  const links = createLinks(pins, imageData);

  return { links, imageData, pins };
}
