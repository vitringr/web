import { Mathematics } from "@utilities/mathematics";

const config = {
  width: 800,
  height: 800,

  phase1: {
    spawnCount: 5,
    poolCount: 400,

    minSize: 6,
    maxSize: 8,
    decayRate: 0.04,

    minSpeed: 0.2,
    maxSpeed: 0.7,

    gravity: 0.0004,

    colors: ["white"],
  } as PhaseConfig,

  phase2: {
    spawnCount: 100,
    poolCount: 4000,

    minSize: 4,
    maxSize: 12,
    decayRate: 0.1,

    minSpeed: 0.8,
    maxSpeed: 2.4,

    gravity: 0.009,

    colors: ["#0eee1e", "#f8d11a", "#ff560c", "#d91617", "#39b4ff", "#d12bfb", "#f8f8fe"],
  } as PhaseConfig,

  renderSize: 0.7,

  timeIncrement: 0.01,

  backgroundColor: "#161616",
} as const;

const input = { x: -99999, y: -99999, clicked: false };
let particleIndex1 = 0;
let particleIndex2 = 0;

type PhaseConfig = {
  spawnCount: number;
  poolCount: number;

  minSize: number;
  maxSize: number;
  decayRate: number;

  minSpeed: number;
  maxSpeed: number;

  gravity: number;

  colors: string[];
};

type Particle = {
  isAlive: boolean;
  toNext: boolean;
  originalSize: number;
  size: number;
  speed: number;
  x: number;
  y: number;
  xDirection: number;
  yDirection: number;
  xAcceleration: number;
  yAcceleration: number;
  xVelocity: number;
  yVelocity: number;
  gravity: number;
  color: string;
};

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.backgroundColor;
  context.fillRect(0, 0, config.width, config.height);
}

function setupInput(canvas: HTMLCanvasElement) {
  canvas.addEventListener("pointermove", (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    input.x = event.clientX - bounds.left;
    input.y = event.clientY - bounds.top;
  });

  canvas.addEventListener("pointerdown", () => {
    input.clicked = true;
  });
}

function createParticlesPool(phaseConfig: PhaseConfig) {
  const particles: Particle[] = [];

  for (let i = 0; i < phaseConfig.poolCount; i++) {
    const angle = Math.random() * Mathematics.TAU;
    const xDirection = Math.cos(angle);
    const yDirection = Math.sin(angle);

    const size = Mathematics.lerp(phaseConfig.minSize, phaseConfig.maxSize, Math.random());

    const speed = Mathematics.lerp(phaseConfig.minSpeed, phaseConfig.maxSpeed, Math.random());

    const color = phaseConfig.colors[Math.floor(Math.random() * phaseConfig.colors.length)];

    const gravity = phaseConfig.gravity;

    const particle: Particle = {
      isAlive: false,
      toNext: false,
      originalSize: size,
      size: size,
      speed: speed,
      x: 0,
      y: 0,
      xDirection: xDirection,
      yDirection: yDirection,
      xAcceleration: xDirection,
      yAcceleration: yDirection,
      xVelocity: 0,
      yVelocity: 0,
      gravity: gravity,
      color: color,
    };

    particles.push(particle);
  }

  return particles;
}

function moveParticle(particle: Particle) {
  particle.xVelocity += particle.xAcceleration;
  particle.yVelocity += particle.yAcceleration;

  particle.yAcceleration += particle.gravity;

  const magnitude = Mathematics.hypotenuse(particle.xVelocity, particle.yVelocity);

  if (magnitude > 0) {
    particle.xVelocity /= magnitude;
    particle.yVelocity /= magnitude;
  }

  particle.x += particle.xVelocity * particle.speed;
  particle.y += particle.yVelocity * particle.speed;
}

function decayParticle(particle: Particle, phaseConfig: PhaseConfig) {
  particle.size -= phaseConfig.decayRate;

  if (particle.size <= 0) {
    particle.isAlive = false;
    particle.toNext = true;
  }
}

function renderParticle(particle: Particle, context: CanvasRenderingContext2D) {
  context.fillStyle = particle.color;

  context.fillRect(particle.x, particle.y, particle.size * config.renderSize, particle.size * config.renderSize);
}

function spawnParticle(particle: Particle, x: number, y: number) {
  particle.isAlive = true;
  particle.toNext = false;
  particle.size = particle.originalSize;
  particle.x = x;
  particle.y = y;
  particle.xAcceleration = particle.xDirection;
  particle.yAcceleration = particle.yDirection;
}

export function main(canvas: HTMLCanvasElement) {
  setupInput(canvas);

  const context = setupContext(canvas);

  const particles1 = createParticlesPool(config.phase1);
  const particles2 = createParticlesPool(config.phase2);

  let time = 0;
  const animation = () => {
    time += config.timeIncrement;

    renderBackground(context);

    if (input.clicked) {
      input.clicked = false;
      for (let i = 0; i < config.phase1.spawnCount; i++) {
        const particle = particles1[particleIndex1];
        spawnParticle(particle, input.x, input.y);
        particleIndex1++;
        particleIndex1 %= config.phase1.poolCount;
      }
    }

    for (const particle of particles1) {
      if (particle.isAlive) {
        moveParticle(particle);
        renderParticle(particle, context);
        decayParticle(particle, config.phase1);
      } else {
        if (particle.toNext) {
          particle.toNext = false;
          for (let i = 0; i < config.phase2.spawnCount; i++) {
            const newParticle2 = particles2[particleIndex2];
            spawnParticle(newParticle2, particle.x, particle.y);
            particleIndex2++;
            particleIndex2 %= config.phase2.poolCount;
          }
        }
      }
    }

    for (const particle of particles2) {
      if (particle.isAlive) {
        moveParticle(particle);
        renderParticle(particle, context);
        decayParticle(particle, config.phase2);
      }
    }

    requestAnimationFrame(animation);
  };

  animation();
}
