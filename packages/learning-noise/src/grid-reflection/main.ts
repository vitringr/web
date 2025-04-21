import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Config } from "./config";

const F = (Math.sqrt(3) - 1) * 0.5;
const G = F / (1 + 2 * F);

const middle = Config.height * 0.5;
const verticesSpacing = Config.width / Config.verticesPerRow;
const gap = verticesSpacing * 0.5;

const pointer = Vector2.zero();
const pointerNoGap = Vector2.zero();

type Vertex = {
  x: number;
  y: number;
  xRender: number;
  yRender: number;
};

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function createVerticesTop() {
  const vertices: Vertex[][] = [];
  for (let x = 0; x < Config.verticesPerRow; x++) {
    vertices.push([]);
    for (let y = 0; y < Config.verticesPerRow; y++) {
      vertices[x].push({
        x,
        y,
        xRender: gap + x * verticesSpacing,
        yRender: gap + y * verticesSpacing,
      });
    }
  }
  return vertices;
}

function createVerticesBot() {
  const vertices: Vertex[][] = [];
  for (let x = 0; x < Config.verticesPerRow; x++) {
    vertices.push([]);
    for (let y = 0; y < Config.verticesPerRow; y++) {
      const S = (x + y) * F;
      vertices[x].push({
        x,
        y,
        xRender: gap + (x + S) * verticesSpacing,
        yRender: gap + middle + (y + S) * verticesSpacing,
      });
    }
  }
  return vertices;
}

function setupInput(canvas: HTMLCanvasElement) {
  const bounds = canvas.getBoundingClientRect();
  canvas.addEventListener("pointermove", (event: PointerEvent) => {
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointerNoGap.set(pointer.x - gap, pointer.y - gap);
  });
}

function background(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.colors.backgroundTop;
  context.fillRect(0, 0, Config.width, middle);
  context.fillStyle = Config.colors.backgroundBot;
  context.fillRect(0, middle, Config.width, middle);
}

function renderVerticesTop(context: CanvasRenderingContext2D, vertices: Vertex[][]) {
  context.fillStyle = Config.colors.verticesTop;
  for (const row of vertices) {
    for (const vertex of row) {
      Canvas2D.circleFill(context, vertex.xRender, vertex.yRender, Config.vertexRadius);
    }
  }
}

function renderVerticesBot(context: CanvasRenderingContext2D, vertices: Vertex[][]) {
  context.fillStyle = Config.colors.verticesBot;
  for (const row of vertices) {
    for (const vertex of row) {
      Canvas2D.circleFill(context, vertex.xRender, vertex.yRender, Config.vertexRadius);
    }
  }
}

function renderPointer(context: CanvasRenderingContext2D) {
  if (pointer.y <= middle) {
    const S = (pointerNoGap.x + pointerNoGap.y) * F;
    context.fillStyle = Config.colors.pointerTop;
    Canvas2D.circleFill(context, pointer.x, pointer.y, Config.poitnerRadius);
    context.fillStyle = Config.colors.pointerBot;
    Canvas2D.circleFill(context, pointer.x + S, pointer.y + middle + S, Config.poitnerRadius);
  } else {
    const yTop = pointer.y % middle;
    const U = (pointerNoGap.x + (yTop - gap)) * G;
    context.fillStyle = Config.colors.pointerTop;
    Canvas2D.circleFill(context, pointer.x - U, yTop - U, Config.poitnerRadius);
    context.fillStyle = Config.colors.pointerBot;
    Canvas2D.circleFill(context, pointer.x, pointer.y, Config.poitnerRadius);
  }
}

function renderEdgesTop(context: CanvasRenderingContext2D, vertices: Vertex[][]) {
  context.lineWidth = Config.edgeWidth;
  context.strokeStyle = Config.colors.verticesTop;

  for (let x = 0; x < vertices.length; x++) {
    for (let y = 0; y < vertices.length; y++) {
      const vertex = vertices[x][y];

      if (y < vertices.length - 1) {
        const bottom = vertices[x][y + 1];
        Canvas2D.line(
          context,
          gap + vertex.x * verticesSpacing,
          gap + vertex.y * verticesSpacing,
          gap + bottom.x * verticesSpacing,
          gap + bottom.y * verticesSpacing,
        );
      }

      if (x < vertices.length - 1) {
        const right = vertices[x + 1][y];
        Canvas2D.line(
          context,
          gap + vertex.x * verticesSpacing,
          gap + vertex.y * verticesSpacing,
          gap + right.x * verticesSpacing,
          gap + right.y * verticesSpacing,
        );
      }

      if (x > 0 && y < vertices.length - 1) {
        const botLeft = vertices[x - 1][y + 1];
        Canvas2D.line(
          context,
          gap + vertex.x * verticesSpacing,
          gap + vertex.y * verticesSpacing,
          gap + botLeft.x * verticesSpacing,
          gap + botLeft.y * verticesSpacing,
        );
      }
    }
  }
}

function renderEdgesBot(context: CanvasRenderingContext2D, vertices: Vertex[][]) {
  context.lineWidth = Config.edgeWidth;
  context.strokeStyle = Config.colors.verticesBot;

  for (let x = 0; x < vertices.length; x++) {
    for (let y = 0; y < vertices.length; y++) {
      const vertex = vertices[x][y];

      if (y < vertices.length - 1) {
        const bottom = vertices[x][y + 1];
        Canvas2D.line(context, vertex.xRender, vertex.yRender, bottom.xRender, bottom.yRender);
      }

      if (x < vertices.length - 1) {
        const right = vertices[x + 1][y];
        Canvas2D.line(context, vertex.xRender, vertex.yRender, right.xRender, right.yRender);
      }

      if (x > 0 && y < vertices.length - 1) {
        const botLeft = vertices[x - 1][y + 1];
        Canvas2D.line(context, vertex.xRender, vertex.yRender, botLeft.xRender, botLeft.yRender);
      }
    }
  }
}

export function gridReflection(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  setupInput(canvas);

  const verticesTop = createVerticesTop();
  const verticesBot = createVerticesBot();

  const loop = () => {
    background(context);
    renderVerticesTop(context, verticesTop);
    renderVerticesBot(context, verticesBot);
    renderEdgesTop(context, verticesTop);
    renderEdgesBot(context, verticesBot);
    renderPointer(context);

    requestAnimationFrame(loop);
  };

  loop();
}
