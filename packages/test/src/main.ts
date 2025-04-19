import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Config } from "./config";

const F = (Math.sqrt(3) - 1) * 0.5;
const middle = Config.height * 0.5;

const pointer = Vector2.zero();

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

function renderPointer(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.colors.pointerBot;
  Canvas2D.circleFill(context, pointer.x, pointer.y, Config.poitnerRadius);

  const S = (pointer.x + pointer.y) * F;

  context.fillStyle = Config.colors.pointerTop;
  Canvas2D.circleFill(
    context,
    pointer.x + S,
    pointer.y + middle + S,
    Config.poitnerRadius,
  );
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);
  setupInput(canvas);

  const loop = () => {
    background(context);
    renderPointer(context);

    requestAnimationFrame(loop);
  };

  loop();
}
