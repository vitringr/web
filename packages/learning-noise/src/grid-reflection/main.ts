import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Config } from "./config";

const F = (Math.sqrt(3) - 1) * 0.5;
const G = F / (1 + 2 * F);

const middle = Config.height * 0.5;
const verticesSpacing = Config.width / Config.verticesPerRow;
const gap = verticesSpacing * 0.5;

const pointerTop = Vector2.zero();
const pointerBot = Vector2.zero();
const pointerNoGapTop = Vector2.zero();
const pointerNoGapBot = Vector2.zero();

type Vertex = {
  x: number;
  y: number;
  xRenderTop: number;
  yRenderTop: number;
  xRenderBot: number;
  yRenderBot: number;
};

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function createVertices() {
  const vertices: Vertex[][] = [];
  for (let x = 0; x < Config.verticesPerRow; x++) {
    vertices.push([]);
    for (let y = 0; y < Config.verticesPerRow; y++) {
      const S = (x + y) * F;
      vertices[x].push({
        x,
        y,
        xRenderTop: gap + x * verticesSpacing,
        yRenderTop: gap + y * verticesSpacing,
        xRenderBot: gap + (x + S) * verticesSpacing,
        yRenderBot: gap + middle + (y + S) * verticesSpacing,
      });
    }
  }
  return vertices;
}

function setupInput(canvas: HTMLCanvasElement) {
  const bounds = canvas.getBoundingClientRect();
  canvas.addEventListener("pointermove", (event: PointerEvent) => {
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    if (y <= middle) {
      pointerTop.set(x, y);

      pointerNoGapTop.copy(pointerTop).decrease(gap, gap);

      const S = (pointerNoGapTop.x + pointerNoGapTop.y) * F;
      pointerBot.copy(pointerTop).increase(S, middle + S);
    } else {
      pointerBot.set(x, y);

      pointerNoGapBot.copy(pointerBot).decrease(gap, gap);

      const U = (pointerNoGapBot.x + (pointerNoGapBot.y - middle)) * G;
      pointerTop.copy(pointerBot).decrease(U, middle + U);

      pointerNoGapTop.copy(pointerTop).decrease(gap, gap);
    }
  });
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
      Canvas2D.circleFill(context, vertex.xRenderTop, vertex.yRenderTop, Config.vertexRadius);
      Canvas2D.circleFill(context, vertex.xRenderBot, vertex.yRenderBot, Config.vertexRadius);
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
        Canvas2D.line(
          context,
          vertex.xRenderTop,
          vertex.yRenderTop,
          bottom.xRenderTop,
          bottom.yRenderTop,
        );
      }

      if (x < vertices.length - 1) {
        const right = vertices[x + 1][y];
        Canvas2D.line(
          context,
          vertex.xRenderTop,
          vertex.yRenderTop,
          right.xRenderTop,
          right.yRenderTop,
        );
      }

      if (x > 0 && y < vertices.length - 1) {
        const botLeft = vertices[x - 1][y + 1];
        Canvas2D.line(
          context,
          vertex.xRenderTop,
          vertex.yRenderTop,
          botLeft.xRenderTop,
          botLeft.yRenderTop,
        );
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
        Canvas2D.line(
          context,
          vertex.xRenderBot,
          vertex.yRenderBot,
          bottom.xRenderBot,
          bottom.yRenderBot,
        );
      }

      if (x < vertices.length - 1) {
        const right = vertices[x + 1][y];
        Canvas2D.line(
          context,
          vertex.xRenderBot,
          vertex.yRenderBot,
          right.xRenderBot,
          right.yRenderBot,
        );
      }

      if (x > 0 && y < vertices.length - 1) {
        const botLeft = vertices[x - 1][y + 1];
        Canvas2D.line(
          context,
          vertex.xRenderBot,
          vertex.yRenderBot,
          botLeft.xRenderBot,
          botLeft.yRenderBot,
        );
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

  context.lineWidth = Config.targetEdgesWidth;
  context.fillStyle = Config.colors.targetVertices;

  context.strokeStyle = Config.colors.gridTopLighter;

  Canvas2D.line(context, a.xRenderTop, a.yRenderTop, b.xRenderTop, b.yRenderTop);
  Canvas2D.line(context, b.xRenderTop, b.yRenderTop, c.xRenderTop, c.yRenderTop);
  Canvas2D.line(context, c.xRenderTop, c.yRenderTop, a.xRenderTop, a.yRenderTop);

  Canvas2D.circleFill(context, a.xRenderTop, a.yRenderTop, Config.targetVertexRadius);
  Canvas2D.circleFill(context, b.xRenderTop, b.yRenderTop, Config.targetVertexRadius);
  Canvas2D.circleFill(context, c.xRenderTop, c.yRenderTop, Config.targetVertexRadius);

  context.strokeStyle = Config.colors.gridBotLighter;

  Canvas2D.line(context, a.xRenderBot, a.yRenderBot, b.xRenderBot, b.yRenderBot);
  Canvas2D.line(context, b.xRenderBot, b.yRenderBot, c.xRenderBot, c.yRenderBot);
  Canvas2D.line(context, c.xRenderBot, c.yRenderBot, a.xRenderBot, a.yRenderBot);

  Canvas2D.circleFill(context, a.xRenderBot, a.yRenderBot, Config.targetVertexRadius);
  Canvas2D.circleFill(context, b.xRenderBot, b.yRenderBot, Config.targetVertexRadius);
  Canvas2D.circleFill(context, c.xRenderBot, c.yRenderBot, Config.targetVertexRadius);
}

export function gridReflection(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  setupInput(canvas);

  const vertices = createVertices();

  const loop = () => {
    background(context);

    renderVertices(context, vertices);

    context.lineWidth = Config.edgeWidth;
    renderEdgesTop(context, vertices);
    renderEdgesBot(context, vertices);

    renderPointer(context);

    renderTargetTriangle(context, vertices);

    requestAnimationFrame(loop);
  };

  loop();
}
