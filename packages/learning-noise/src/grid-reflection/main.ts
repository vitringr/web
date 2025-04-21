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

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function createVertices() {
  const vertices: Vector2[][] = [];
  for (let x = 0; x < Config.verticesPerRow; x++) {
    vertices.push([]);
    for (let y = 0; y < Config.verticesPerRow; y++) {
      vertices[x].push(new Vector2(x, y));
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

function renderVerticesTop(context: CanvasRenderingContext2D, vertices: Vector2[][]) {
  context.fillStyle = Config.colors.verticesTop;
  for (const row of vertices) {
    for (const vertex of row) {
      Canvas2D.circleFill(
        context,
        gap + vertex.x * verticesSpacing,
        gap + vertex.y * verticesSpacing,
        Config.vertexRadius,
      );
    }
  }
}

function renderVerticesBot(context: CanvasRenderingContext2D, vertices: Vector2[][]) {
  context.fillStyle = Config.colors.verticesBot;
  for (const row of vertices) {
    for (const vertex of row) {
      const S = (vertex.x + vertex.y) * F;

      Canvas2D.circleFill(
        context,
        gap + (vertex.x + S) * verticesSpacing,
        gap + middle + (vertex.y + S) * verticesSpacing,
        Config.vertexRadius,
      );
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

function renderEdgesTop(context: CanvasRenderingContext2D, vertices: Vector2[][]) {
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

function renderEdgesBottom(context: CanvasRenderingContext2D, vertices: Vector2[][]) {
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

export function gridReflection(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  setupInput(canvas);

  const vertices = createVertices();

  const loop = () => {
    background(context);
    renderVerticesTop(context, vertices);
    renderVerticesBot(context, vertices);
    renderEdgesTop(context, vertices);
    renderPointer(context);

    requestAnimationFrame(loop);
  };

  loop();
}
