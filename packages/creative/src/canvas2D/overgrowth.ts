// IMPROVE: To work with min/max config values

import { Noise } from "@utilities/noise";
import { Canvas2D } from "@utilities/canvas2d";
import { Mathematics } from "@utilities/mathematics";

const config = {
  width: 600,
  height: 600,

  orbsPooled: 500,

  radius: 8,
  decayRate: 0.045,

  noiseFrequency: 0.0075,
  velocityScalar: 3.5,

  timeIncrement: 1,

  lineWidth: 0.5,

  colors: {
    strokeColor: "#202020",
    palette: [
      { color: "#f9651f", weight: 2 },
      { color: "#ed4f06", weight: 1 },
      { color: "#f4910f", weight: 1 },
      { color: "#2a3129", weight: 1 },
      { color: "#28382d", weight: 2 },
      { color: "#0b704e", weight: 4 },
      { color: "#02703e", weight: 4 },
      { color: "#455d47", weight: 4 },
      { color: "#6f9d80", weight: 4 },
    ],
  },
} as const;

const getNoise = Noise.simplex();
const input = { x: -99999, y: -99999, clicked: false };

type Orb = {
  isAlive: boolean;
  x: number;
  y: number;
  xNoise: number;
  yNoise: number;
  xDirection: number;
  yDirection: number;
  radius: number;
  color: string;
};

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.strokeStyle = config.colors.strokeColor;
  context.lineWidth = config.lineWidth;

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

function createOrbsPool() {
  const orbs: Orb[] = [];

  const colors: string[] = [];
  config.colors.palette.forEach((c) => {
    for (let i = 0; i < c.weight; i++) {
      colors.push(c.color);
    }
  });

  for (let i = 0; i < config.orbsPooled; i++) {
    const angle = Math.random() * Mathematics.TAU;
    const xDirection = Math.cos(angle);
    const yDirection = Math.sin(angle);

    const selfNoise = 0xfffff;

    const orb: Orb = {
      isAlive: false,
      x: 0,
      y: 0,
      xNoise: Math.random() * selfNoise,
      yNoise: Math.random() * selfNoise,
      xDirection: xDirection,
      yDirection: yDirection,
      radius: config.radius,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    orbs.push(orb);
  }

  return orbs;
}

function moveOrb(orb: Orb, time: number) {
  const xNoise =
    getNoise(
      (orb.xNoise + time) * config.noiseFrequency,
      (orb.yNoise + time) * config.noiseFrequency,
    ) - 0.5;

  const yNoise =
    getNoise(
      (orb.xNoise + time) * config.noiseFrequency,
      (orb.yNoise - time) * config.noiseFrequency,
    ) - 0.5;

  orb.x += xNoise * config.velocityScalar;
  orb.y += yNoise * config.velocityScalar;
}

function decayOrb(orb: Orb) {
  orb.radius -= config.decayRate;

  if (orb.radius <= 0) orb.isAlive = false;
}

function spawnOrb(orb: Orb) {
  orb.isAlive = true;
  orb.radius = config.radius;
  orb.x = input.x;
  orb.y = input.y;
}

function renderOrb(orb: Orb, context: CanvasRenderingContext2D) {
  context.fillStyle = orb.color;
  Canvas2D.circleFill(context, orb.x, orb.y, orb.radius);
  Canvas2D.circle(context, orb.x, orb.y, orb.radius);
}

export function main(canvas: HTMLCanvasElement) {
  setupInput(canvas);

  const context = setupContext(canvas);

  const orbs = createOrbsPool();

  let time = 0;
  let orbIndex = 0;
  const animation = () => {
    time += config.timeIncrement;

    if (input.clicked) {
      const orb = orbs[orbIndex];
      spawnOrb(orb);
      orbIndex++;
      orbIndex %= config.orbsPooled;
    }

    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i];
      if (!orb.isAlive) continue;
      moveOrb(orb, time);
      renderOrb(orb, context);
      decayOrb(orb);
    }

    requestAnimationFrame(animation);
  };

  animation();
}
