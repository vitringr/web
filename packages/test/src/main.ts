import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Config } from "./config";

const F = (Math.sqrt(3) - 1) * 0.5;
const middle = Config.height * 0.5;
const verticesSpacing = Config.width / Config.verticesPerRow;

const pointer = Vector2.zero();

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

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function setupInput(canvas: HTMLCanvasElement) {
  const bounds = canvas.getBoundingClientRect();
  canvas.addEventListener("pointermove", (event: PointerEvent) => {
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.y %= middle;
  });
}

function background(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.colors.backgroundTop;
  context.fillRect(0, 0, Config.width, middle);

  context.fillStyle = Config.colors.backgroundBot;
  context.fillRect(0, middle, Config.width, middle);
}

function renderVertices(context: CanvasRenderingContext2D, vertices: Vector2[][]) {
  // Top:
  context.fillStyle = Config.colors.verticesTop;
  for (const row of vertices) {
    for (const vertex of row) {
      Canvas2D.circleFill(
        context,
        vertex.x * verticesSpacing,
        vertex.y * verticesSpacing,
        Config.vertexRadius,
      );
    }
  }

  // Bot:
  context.fillStyle = Config.colors.verticesBot;
  for (const row of vertices) {
    for (const vertex of row) {
      Canvas2D.circleFill(
        context,
        vertex.x * verticesSpacing,
        middle + vertex.y * verticesSpacing,
        Config.vertexRadius,
      );
    }
  }
}

function renderPointer(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.colors.pointerTop;
  Canvas2D.circleFill(context, pointer.x, pointer.y, Config.poitnerRadius);

  const S = (pointer.x + pointer.y) * F;

  context.fillStyle = Config.colors.pointerBot;
  Canvas2D.circleFill(context, pointer.x + S, pointer.y + middle + S, Config.poitnerRadius);
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);
  setupInput(canvas);

  const vertices = createVertices();
  renderVertices(context, vertices);

  const loop = () => {
    background(context);
    renderPointer(context);
    renderVertices(context, vertices);

    requestAnimationFrame(loop);
  };

  loop();
}
