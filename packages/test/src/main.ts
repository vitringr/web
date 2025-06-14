import { Canvas2D } from "@utilities/canvas2d";
import { Config } from "./config";

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  canvas.style.border = "1px solid red";

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

export async function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  context.lineWidth = 0.5;
  context.strokeStyle = "#AAAAAA";

  const xGap = Config.width / Config.cols;
  for (let x = 0; x < Config.cols; x++) {
    const step = x * xGap;
    Canvas2D.line(context, step, 0, step, Config.height);
  }

  const yGap = Config.height / Config.rows;
  for (let y = 0; y < Config.rows; y++) {
    const step = y * yGap;
    Canvas2D.line(context, 0, step, Config.width, step);
  }

  const loop = () => {
    requestAnimationFrame(loop);
  };

  loop();
}
