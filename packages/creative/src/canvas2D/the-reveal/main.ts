/*

TODO: Optimize EVERYTHING lol.

*/

import { Mathematics } from "@utilities/mathematics";
import { Noise } from "@utilities/noise";
import { pixelData } from "./pixeldata-320x400";

const config = {
  width: 640,
  height: 800,

  colors: {
    background: "#161616",
  },
} as const;

const imageWidth = 320;
const imageHeight = 400;
const xRatio = config.width / imageWidth;
const yRatio = config.height / imageHeight;

type Particle = {
  active: boolean;
  x: number;
  y: number;
  lifetime: number;
  angle: number;
};

type Input = { x: number; y: number; clicked: boolean };

const input: Input = {
  x: Infinity,
  y: Infinity,
  clicked: false,
};

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  canvas.style.border = "2px solid gray";

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

  for (let i = 0; i < 500; i++) {
    particles.push({
      x: Infinity,
      y: Infinity,
      active: false,
      lifetime: 0,
      angle: Math.random() * Mathematics.TAU,
    });
  }

  return particles;
}

function renderBackground(context: CanvasRenderingContext2D) {}

function renderParticle(
  context: CanvasRenderingContext2D,
  particle: Particle,
  color: string,
) {
  context.fillStyle = color;
  const size = particle.lifetime * 0.01;
  context.fillRect(particle.x, particle.y, size, size);
}

function updateParticle(particle: Particle) {
  // WIP
  particle.x += 1;

  particle.lifetime--;
  if (particle.lifetime <= 0) {
    particle.active = false;
  }
}

export async function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);
  setupInput(canvas);

  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);

  const particles = createParticles();

  let spawnIndex = 0;

  const loop = () => {
    if (input.clicked) {
      console.log("click");
      spawnIndex++;
      if (spawnIndex >= 500) spawnIndex = 0;

      const particle = particles[spawnIndex];

      particle.active = true;
      particle.lifetime = 300;
      particle.x = input.x;
      particle.y = input.y;
    }

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      if (!particle.active) continue;

      particle.lifetime -= 2;
      if (particle.lifetime <= 0) {
        particle.active = false;
      }

      const xFloor = Math.floor(particle.x / xRatio);
      const yFloor = Math.floor(particle.y / yRatio);

      context.fillStyle = pixelData[xFloor][yFloor];
      const size = particle.lifetime * 0.01;
      context.fillRect(particle.x, particle.y, size, size);

      const noise = Noise.get(particle.x * 0.1, particle.y * 0.1) * 2 - 1;
      particle.angle += noise * 0.2;
      particle.x += Math.cos(particle.angle);
      particle.y += Math.sin(particle.angle);

      if (particle.x >= config.width) {
        particle.active = false;
        continue;
      } else if (particle.x <= 0) {
        particle.active = false;
        continue;
      }

      if (particle.y >= config.height) {
        particle.active = false;
        continue;
      } else if (particle.y <= 0) {
        particle.active = false;
        continue;
      }
    }

    requestAnimationFrame(loop);
  };

  loop();
}
