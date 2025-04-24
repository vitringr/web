import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Config } from "./config";
import { Mathematics } from "@utilities/mathematics";
import { Easing } from "@utilities/easing";

const F = (Math.sqrt(3) - 1) * 0.5;
const G = F / (1 + 2 * F);

let dynamicF: number = F;
let dynamicG: number = G;

const middle = Config.height * 0.5;
const verticesSpacing = Config.width / Config.verticesPerRow;
const gap = verticesSpacing * 0.5;

const input = Vector2.Create.one().scale(-10);
const pointerTop = input.clone();
const pointerBot = input.clone();
const pointerNoGapTop = input.clone();
const pointerNoGapBot = input.clone();

type Vertex = {
  x: number;
  y: number;
  xTop: number;
  yTop: number;
  xBot: number;
  yBot: number;
};

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function setDynamicSkew(vertex: Vertex) {
  const x = vertex.x;
  const y = vertex.y;
  const S = (x + y) * dynamicF;

  vertex.xBot = gap + (x + S) * verticesSpacing;
  vertex.yBot = gap + middle + (y + S) * verticesSpacing;
}

function createVertices() {
  const vertices: Vertex[][] = [];
  for (let x = 0; x < Config.verticesPerRow; x++) {
    vertices.push([]);
    for (let y = 0; y < Config.verticesPerRow; y++) {
      vertices[x].push({
        x,
        y,
        // Top is calculated once, as the top grid doesn't change.
        xTop: gap + x * verticesSpacing,
        yTop: gap + y * verticesSpacing,
        // Bot is calculated dynamically, as the bottom grid changes.
        xBot: 0,
        yBot: 0,
      });
    }
  }
  return vertices;
}

function setupInput(canvas: HTMLCanvasElement) {
  const bounds = canvas.getBoundingClientRect();
  canvas.addEventListener("pointermove", (event: PointerEvent) => {
    input.x = event.clientX - bounds.left;
    input.y = event.clientY - bounds.top;
  });
}

function updatePointer() {
  if (input.y <= middle) {
    pointerTop.set(input.x, input.y);

    pointerNoGapTop.copy(pointerTop).decrease(gap, gap);

    const S = (pointerNoGapTop.x + pointerNoGapTop.y) * dynamicF;
    pointerBot.copy(pointerTop).increase(S, middle + S);
  } else {
    pointerBot.set(input.x, input.y);

    pointerNoGapBot.copy(pointerBot).decrease(gap, gap);

    const U = (pointerNoGapBot.x + (pointerNoGapBot.y - middle)) * dynamicG;
    pointerTop.copy(pointerBot).decrease(U, middle + U);

    pointerNoGapTop.copy(pointerTop).decrease(gap, gap);
  }
}

function background(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.colors.backgroundTop;
  context.fillRect(0, 0, Config.width, middle);
  context.fillStyle = Config.colors.backgroundBot;
  context.fillRect(0, middle, Config.width, middle);
}

function renderVertices(context: CanvasRenderingContext2D, vertices: Vertex[][]) {
  context.fillStyle = Config.colors.gridTop;
  for (const row of vertices) {
    for (const vertex of row) {
      Canvas2D.circleFill(context, vertex.xTop, vertex.yTop, Config.vertexRadius);
    }
  }

  context.fillStyle = Config.colors.gridBot;
  for (const row of vertices) {
    for (const vertex of row) {
      Canvas2D.circleFill(context, vertex.xBot, vertex.yBot, Config.vertexRadius);
    }
  }
}

function renderPointer(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.colors.pointer;
  Canvas2D.circleFill(context, pointerTop.x, pointerTop.y, Config.poitnerRadius);
  Canvas2D.circleFill(context, pointerBot.x, pointerBot.y, Config.poitnerRadius);
}

function renderEdgesTop(context: CanvasRenderingContext2D, vertices: Vertex[][]) {
  context.strokeStyle = Config.colors.gridTop;

  for (let x = 0; x < vertices.length; x++) {
    for (let y = 0; y < vertices.length; y++) {
      const vertex = vertices[x][y];

      if (y < vertices.length - 1) {
        const bottom = vertices[x][y + 1];
        Canvas2D.line(context, vertex.xTop, vertex.yTop, bottom.xTop, bottom.yTop);
      }

      if (x < vertices.length - 1) {
        const right = vertices[x + 1][y];
        Canvas2D.line(context, vertex.xTop, vertex.yTop, right.xTop, right.yTop);
      }

      if (x > 0 && y < vertices.length - 1) {
        const botLeft = vertices[x - 1][y + 1];
        Canvas2D.line(context, vertex.xTop, vertex.yTop, botLeft.xTop, botLeft.yTop);
      }
    }
  }
}

function renderEdgesBot(context: CanvasRenderingContext2D, vertices: Vertex[][]) {
  context.strokeStyle = Config.colors.gridBot;

  for (let x = 0; x < vertices.length; x++) {
    for (let y = 0; y < vertices.length; y++) {
      const vertex = vertices[x][y];

      if (y < vertices.length - 1) {
        const bottom = vertices[x][y + 1];
        Canvas2D.line(context, vertex.xBot, vertex.yBot, bottom.xBot, bottom.yBot);
      }

      if (x < vertices.length - 1) {
        const right = vertices[x + 1][y];
        Canvas2D.line(context, vertex.xBot, vertex.yBot, right.xBot, right.yBot);
      }

      if (x > 0 && y < vertices.length - 1) {
        const botLeft = vertices[x - 1][y + 1];
        Canvas2D.line(context, vertex.xBot, vertex.yBot, botLeft.xBot, botLeft.yBot);
      }
    }
  }
}

function renderTargetTriangle(context: CanvasRenderingContext2D, vertices: Vertex[][]) {
  const x = pointerNoGapTop.x / verticesSpacing;
  const y = pointerNoGapTop.y / verticesSpacing;

  const xFloor = Math.floor(x);
  const yFloor = Math.floor(y);

  if (xFloor < 0 || yFloor < 0 || xFloor >= vertices.length - 1 || yFloor >= vertices.length - 1)
    return;

  const xMod = x % 1;
  const yMod = y % 1;

  const isLeft = 1 - xMod > yMod;

  const a = isLeft ? vertices[xFloor][yFloor] : vertices[xFloor + 1][yFloor + 1];
  const b = vertices[xFloor + 1][yFloor];
  const c = vertices[xFloor][yFloor + 1];

  context.fillStyle = Config.colors.targetVertices;

  // Top Lattice

  context.lineWidth = Config.targetEdgesWidth;
  context.strokeStyle = Config.colors.gridTopLighter;

  Canvas2D.line(context, a.xTop, a.yTop, b.xTop, b.yTop);
  Canvas2D.line(context, b.xTop, b.yTop, c.xTop, c.yTop);
  Canvas2D.line(context, c.xTop, c.yTop, a.xTop, a.yTop);

  Canvas2D.circleFill(context, a.xTop, a.yTop, Config.targetVertexRadius);
  Canvas2D.circleFill(context, b.xTop, b.yTop, Config.targetVertexRadius);
  Canvas2D.circleFill(context, c.xTop, c.yTop, Config.targetVertexRadius);

  context.lineWidth = Config.pointerEdgesWidth;
  context.strokeStyle = Config.colors.pointer;

  Canvas2D.line(context, pointerTop.x, pointerTop.y, b.xTop, b.yTop);
  Canvas2D.line(context, pointerTop.x, pointerTop.y, c.xTop, c.yTop);
  Canvas2D.line(context, pointerTop.x, pointerTop.y, a.xTop, a.yTop);

  // Bottom Lattice

  context.lineWidth = Config.targetEdgesWidth;
  context.strokeStyle = Config.colors.gridBotLighter;

  Canvas2D.line(context, a.xBot, a.yBot, b.xBot, b.yBot);
  Canvas2D.line(context, b.xBot, b.yBot, c.xBot, c.yBot);
  Canvas2D.line(context, c.xBot, c.yBot, a.xBot, a.yBot);

  Canvas2D.circleFill(context, a.xBot, a.yBot, Config.targetVertexRadius);
  Canvas2D.circleFill(context, b.xBot, b.yBot, Config.targetVertexRadius);
  Canvas2D.circleFill(context, c.xBot, c.yBot, Config.targetVertexRadius);

  context.lineWidth = Config.pointerEdgesWidth;
  context.strokeStyle = Config.colors.pointer;

  Canvas2D.line(context, pointerBot.x, pointerBot.y, b.xBot, b.yBot);
  Canvas2D.line(context, pointerBot.x, pointerBot.y, c.xBot, c.yBot);
  Canvas2D.line(context, pointerBot.x, pointerBot.y, a.xBot, a.yBot);
}

export function gridReflection(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  setupInput(canvas);

  const vertices = createVertices();

  let time: number = 0;

  const loop = () => {
    time += Config.timeIncrement;

    const waveStep = (Math.sin(time) + 1) * 0.5;

    dynamicF = Mathematics.lerp(0, F, Easing.smoothstep(waveStep));
    dynamicG = Mathematics.lerp(0, G, Easing.smoothstep(waveStep));

    updatePointer();

    for (const row of vertices) {
      for (const vertex of row) {
        setDynamicSkew(vertex);
      }
    }

    background(context);

    renderVertices(context, vertices);

    context.lineWidth = Config.edgeWidth;
    renderEdgesTop(context, vertices);
    renderEdgesBot(context, vertices);

    renderTargetTriangle(context, vertices);

    renderPointer(context);

    requestAnimationFrame(loop);
  };

  loop();
}
