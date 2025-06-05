import { Mathematics } from "@utilities/mathematics";
import { Noise } from "@utilities/noise";
import theSeerPNG from "./the-seer.png";

// ------------
// -- Config --
// ------------

const config = {
  width: 960,
  height: 1200,
  // width: 640,
  // height: 800,

  imageWidth: 480,
  imageHeight: 600,
  // imageWidth: 320,
  // imageHeight: 400,

  cachedParticles: 500,
  lifetime: 300,
  decay: 2.2,
  size: 0.006,
  speed: 1,

  noiseFrequency: 0.04,
  noiseEffect: 0.14,

  backgroundColor: "#161616",
} as const;

const xRatio = config.width / config.imageWidth;
const yRatio = config.height / config.imageHeight;

// -----------
// -- Logic --
// -----------

type Particle = {
  active: boolean;
  lifetime: number;
  angle: number;
  x: number;
  y: number;
};

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  canvas.style.border = "1.5px solid gray";

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function setupInput(canvas: HTMLCanvasElement) {
  const bounds = canvas.getBoundingClientRect();
  canvas.addEventListener("pointermove", (event: PointerEvent) => {
    input.x = event.clientX - bounds.left;
    input.y = event.clientY - bounds.top;
  });

  canvas.addEventListener("pointerdown", () => {
    input.clicked = true;
  });

  window.addEventListener("pointerup", () => {
    input.clicked = false;
  });

  window.addEventListener("blur", () => {
    input.clicked = false;
  });
}

function createParticles() {
  const particles: Particle[] = [];

  for (let i = 0; i < config.cachedParticles; i++) {
    const randomAngle = Math.random() * Mathematics.TAU;

    particles.push({
      active: false,
      lifetime: 0,
      angle: randomAngle,
      x: Infinity,
      y: Infinity,
    });
  }

  return particles;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.backgroundColor;
  context.fillRect(0, 0, config.width, config.height);
}

// -----------
// -- State --
// -----------

const input: { x: number; y: number; clicked: boolean } = {
  x: 0,
  y: 0,
  clicked: false,
};

let spawnIndex = 0;

// ----------
// -- Main --
// ----------

function createImageData(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
) {
  context.drawImage(image, 0, 0, config.imageWidth, config.imageHeight);
  const imageData = context.getImageData(
    0,
    0,
    config.imageWidth,
    config.imageHeight,
  ).data;
  context.clearRect(0, 0, config.width, config.height);

  const arr: string[][] = [];

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i + 0];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const index = i / 4;
    const x = index % config.imageWidth;
    const y = Math.floor(index / config.imageWidth);

    if (!arr[x]) arr[x] = [];
    arr[x][y] = `rgb(${r},${g},${b})`;
  }

  return arr;
}

export async function main(canvas: HTMLCanvasElement) {
  setupInput(canvas);
  const context = setupContext(canvas);
  const particles = createParticles();

  renderBackground(context);

  // -----------
  // -- Image --
  // -----------

  const img = new Image();
  img.src = theSeerPNG;
  img.onload = () => {
    const pixelData = createImageData(context, img);

    const loop = () => {
      if (input.clicked) {
        spawnIndex++;
        spawnIndex %= config.cachedParticles;

        const particle = particles[spawnIndex];
        particle.active = true;
        particle.lifetime = config.lifetime;
        particle.x = input.x;
        particle.y = input.y;
      }

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        if (!particle.active) continue;

        // Lifetime
        particle.lifetime -= config.decay;
        if (particle.lifetime <= 0) {
          particle.active = false;
          continue;
        }

        // Movement
        const noise = Noise.get(
          particle.x * config.noiseFrequency,
          particle.y * config.noiseFrequency,
        );
        particle.angle += (noise * 2 - 1) * config.noiseEffect;
        particle.x += Math.cos(particle.angle) * config.speed;
        particle.y += Math.sin(particle.angle) * config.speed;

        // Bounds
        if (particle.x >= config.width) particle.x = config.width;
        else if (particle.x <= 0) particle.x = 0;
        if (particle.y >= config.height) particle.y = config.height;
        else if (particle.y <= 0) particle.y = 0;

        // Image Index
        let xIndex = Math.floor(particle.x / xRatio);
        let yIndex = Math.floor(particle.y / yRatio);

        // Image Index Bounds
        if (xIndex <= 0) xIndex = 0;
        else if (xIndex >= config.imageWidth) xIndex = config.imageWidth - 1;
        if (yIndex <= 0) yIndex = 0;
        else if (yIndex >= config.imageHeight) yIndex = config.imageHeight - 1;

        // Render
        context.fillStyle = pixelData[xIndex][yIndex];
        const size = particle.lifetime * config.size;
        context.fillRect(particle.x, particle.y, size, size);
      }

      requestAnimationFrame(loop);
    };

    loop();
  };
}
