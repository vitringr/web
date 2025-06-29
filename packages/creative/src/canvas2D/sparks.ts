//TODO: spark colors? Orange and shit

import { Noise } from "@utilities/noise";
import { Colors } from "@utilities/colors";
import { Canvas2D } from "@utilities/canvas2d";
import { Mathematics } from "@utilities/mathematics";

const config = {
  width: 600,
  height: 600,

  orbsPooled: 300,

  radius: 10,
  decayRate: 0.06,

  noiseFrequency: 0.007,
  velocityScalar: 5,

  timeIncrement: 1,

  colors: {
    background: "#111111",
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
      color: Colors.getRGB(Math.random(), Math.random(), Math.random()),
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

function renderOrb(orb: Orb, context: CanvasRenderingContext2D) {
  context.fillStyle = orb.color;
  Canvas2D.circleFill(context, orb.x, orb.y, orb.radius);
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);
}

export function main(canvas: HTMLCanvasElement) {
  setupInput(canvas);

  const context = setupContext(canvas);

  const orbs = createOrbsPool();

  let time = 0;
  let orbIndex = 0;
  const animation = () => {
    time += config.timeIncrement;

    renderBackground(context);

    if (input.clicked) {
      const orb = orbs[orbIndex];
      orb.isAlive = true;
      orb.radius = config.radius;
      orb.x = input.x;
      orb.y = input.y;

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
