import { Canvas2D } from "@utilities/canvas2d";
import { Config } from "./config";

const middle = Config.height * 0.5;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function background(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.colors.backgroundTop;
  context.fillRect(0, 0, Config.width, middle);

  context.fillStyle = Config.colors.backgroundBot;
  context.fillRect(0, middle, Config.width, middle);
}

function midline(context: CanvasRenderingContext2D) {
  context.strokeStyle = Config.colors.midline;
  Canvas2D.line(context, 0, middle, Config.width, middle);
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  background(context);
  // midline(context);
}
