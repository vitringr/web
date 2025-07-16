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

function createTextImage() {
  const auxCanvas = document.createElement("canvas");
  auxCanvas.width = Config.width;
  auxCanvas.height = Config.height;

  const auxContext = auxCanvas.getContext("2d");
  if (!auxContext) throw "Cannot get aux 2d context!";

  auxContext.font = `${Config.textSize}px Arial, sans-serif`;
  auxContext.textAlign = "center";
  auxContext.textBaseline = "middle";
  auxContext.textRendering = "optimizeLegibility";

  auxContext.fillStyle = "#000000";
  auxContext.fillRect(0, 0, Config.width, Config.height);

  auxContext.fillStyle = "#FFFFFF";
  auxContext.fillText(Config.text, Config.width * 0.5, Config.height * 0.5);

  const img = new Image();
  img.src = auxCanvas.toDataURL();

  return img;
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const textImage = createTextImage();

  context.drawImage(textImage, 0, 0);

  // const animation = () => {
  //   renderBackground(context);
  //   requestAnimationFrame(animation);
  // };
  //
  // animation();
}
