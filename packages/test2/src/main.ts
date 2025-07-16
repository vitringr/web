import { Random } from "@utilities/random";
import { Config } from "./config";
import { Mathematics } from "@utilities/mathematics";

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

type Particle = {
  x: number;
  y: number;
  xOrigin: number;
  yOrigin: number;
  speed: number;
  size: number;
  color: string;
};

function createParticle(xSpawn: number, ySpawn: number): Particle {
  const colorIndex = Random.rangeInt(0, Config.colors.text.length);

  return {
    x: xSpawn + Random.range(-200, 200),
    y: ySpawn + Random.range(-200, 200),
    xOrigin: xSpawn,
    yOrigin: ySpawn,
    speed: Random.range(0.001, 0.005),
    size: Random.range(1, 6),
    color: Config.colors.text[colorIndex],
  };
}

function createParticles(context: CanvasRenderingContext2D, image: HTMLImageElement) {
  const width = Config.width * Config.fieldResolution;
  const height = Config.height * Config.fieldResolution;
  const fieldResolutionInverse = 1 / Config.fieldResolution;

  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height).data;

  context.clearRect(0, 0, width, height);

  const particles: Particle[] = [];

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i + 0];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const index = i / 4;
    const x = index % width;
    const y = Math.floor(index / height);

    if (r + g + b > 100) {
      particles.push(createParticle(x * fieldResolutionInverse, y * fieldResolutionInverse));
    }
  }

  return particles;
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const textImage = createTextImage();

  const pixelMap = createParticles(context, textImage);

  const animation = () => {
    renderBackground(context);

    for (const pixel of pixelMap) {
      context.fillStyle = pixel.color
      context.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);

      const xDifference = pixel.xOrigin - pixel.x;
      const yDifference = pixel.yOrigin - pixel.y;

      pixel.x += xDifference * pixel.speed;
      pixel.y += yDifference * pixel.speed;
    }

    requestAnimationFrame(animation);
  };

  animation();
}
