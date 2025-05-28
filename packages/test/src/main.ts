import solidPNG from "./assets/solid.png";

const config = {
  width: 600,
  height: 600,

  colors: {
    background: "#111111",
  },
} as const;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  canvas.style.border = "1px solid red";

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);
}

export async function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const img = new Image();
  img.src = solidPNG;
  img.onload = () => {
    context.drawImage(img, 0, 0, 200, 200);
  };

  const animation = () => {
    requestAnimationFrame(animation);
  };

  animation();
}
