import { Canvas2D } from "@utilities/canvas2d";

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

export async function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  let x = 0;
  let y = 0;
  const angle = Math.random() * Math.PI * 2;

  const speed = 5;

  const xVelocity = -Math.cos(angle) * speed;
  const yVelocity = Math.sin(angle) * speed;

  const radius = 10;

  const loop = () => {
    context.clearRect(0, 0, config.width, config.height);

    context.fillStyle = "white";
    Canvas2D.circleFill(context, (x += xVelocity), (y += yVelocity), radius);

    if (x <= 0) x = canvas.width;
    else if (x >= canvas.width) x = 0;

    if (y <= 0) y = canvas.height;
    else if (y >= canvas.height) y = 0;

    requestAnimationFrame(loop);
  };

  loop();
}
