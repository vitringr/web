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
  console.log(context);

  const loop = () => {
    requestAnimationFrame(loop);
  };

  loop();
}
