import { Mathematics } from "@utilities/mathematics";

type PhaseConfig = {
  spawnCount: number;
  poolCount: number;

  minSize: number;
  maxSize: number;
  decayRate: number;

  speed: number;

  color: string;
};

const config = {
  width: 800,
  height: 800,

  phase1: {
    spawnCount: 4,
    poolCount: 400,

    minSize: 6,
    maxSize: 8,
    decayRate: 0.06,

    speed: 2,

    color: "teal",
  } as PhaseConfig,

  phase2: {
    spawnCount: 10,
    poolCount: 1000,

    minSize: 8,
    maxSize: 12,
    decayRate: 0.08,

    speed: 4,

    color: "#FFAA00",
  } as PhaseConfig,

  timeIncrement: 0.01,

  backgroundColor: "#111111",
} as const;

const input = { x: -99999, y: -99999, clicked: false };
let particleIndex1 = 0;
let particleIndex2 = 0;

type Particle = {
  isAlive: boolean;
  toNext: boolean;
  originalSize: number;
  size: number;
  x: number;
  y: number;
  xDirection: number;
  yDirection: number;
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
  const bounds = canvas.getBoundingClientRect();
  canvas.addEventListener("pointermove", (event: PointerEvent) => {
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

    const size = Mathematics.lerp(
      phaseConfig.minSize,
      phaseConfig.maxSize,
      Math.random(),
    );

    const particle: Particle = {
      isAlive: false,
      toNext: false,
      originalSize: size,
      size: size,
      x: 0,
      y: 0,
      xDirection: xDirection,
      yDirection: yDirection,
      color: phaseConfig.color,
    };

    particles.push(particle);
  }

  return particles;
}

function moveParticle(particle: Particle, phaseConfig: PhaseConfig) {
  particle.x += particle.xDirection * phaseConfig.speed;
  particle.y += particle.yDirection * phaseConfig.speed;
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
  context.fillRect(particle.x, particle.y, particle.size, particle.size);
}

function spawnParticleP1(
  particle: Particle,
  x: number,
  y: number,
  phaseConfig: PhaseConfig,
) {
  particle.isAlive = true;
  particle.toNext = false;
  particle.size = particle.originalSize;
  particle.x = x;
  particle.y = y;
  particle.color = phaseConfig.color;
}

function spawnParticleP2(
  particle: Particle,
  x: number,
  y: number,
  phaseConfig: PhaseConfig,
) {
  particle.isAlive = true;
  particle.toNext = false;
  particle.size = particle.originalSize;
  particle.x = x;
  particle.y = y;
  particle.color = phaseConfig.color;
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
        spawnParticleP1(particle, input.x, input.y, config.phase1);
        particleIndex1++;
        particleIndex1 %= config.phase1.poolCount;
      }
    }

    for (const particle of particles1) {
      if (particle.isAlive) {
        moveParticle(particle, config.phase1);
        renderParticle(particle, context);
        decayParticle(particle, config.phase1);
      } else {
        if (particle.toNext) {
          particle.toNext = false;
          for (let i = 0; i < config.phase2.spawnCount; i++) {
            const newParticle2 = particles2[particleIndex2];
            spawnParticleP2(
              newParticle2,
              particle.x,
              particle.y,
              config.phase2,
            );
            particleIndex2++;
            particleIndex2 %= config.phase2.poolCount;
          }
        }
      }
    }

    for (const particle of particles2) {
      if (particle.isAlive) {
        moveParticle(particle, config.phase2);
        renderParticle(particle, context);
        decayParticle(particle, config.phase2);
      }
    }

    requestAnimationFrame(animation);
  };

  animation();
}
