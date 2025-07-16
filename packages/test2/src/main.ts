import { Config } from "./config";

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.colors.background;
  context.fillRect(0, 0, Config.width, Config.height);
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const animation = () => {
    renderBackground(context);

    requestAnimationFrame(animation);
  };

  animation();
}
