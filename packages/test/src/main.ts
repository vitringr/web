import solidPNG from "./assets/solid.png";
import theSeerPNG from "./assets/theseer.png";
import hummingBirdPNG from "./assets/hummingbird.png";

const config = {
  width: 640,
  height: 800,


  imageWidth: 320,
  imageHeight: 400,

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
  img.src = theSeerPNG;
  img.onload = () => {
    context.drawImage(img, 0, 0, config.imageWidth, config.imageHeight);
    const imageData = context.getImageData(
      0,
      0,
      config.imageWidth,
      config.imageHeight,
    ).data;
    context.clearRect(0, 0, config.width, config.height);

    const scale = config.width / config.imageWidth;

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i + 0];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const a = imageData[i + 3];

      const index = i / 4;
      const x = (index % config.imageWidth) * scale;
      const y = Math.floor(index / config.imageWidth) * scale;

      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      context.fillRect(x, y, scale, scale);
    }
  };

  const loop = () => {
    requestAnimationFrame(loop);
  };
}
