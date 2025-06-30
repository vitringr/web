import { Mathematics } from "@utilities/mathematics";

const config = {
  width: 800,
  height: 800,

  spawnCount: 10,
  poolCount: 300,

  minSize: 8,
  maxSize: 12,

  lifetime: 10,
  decayRate: 0.08,

  speed: 2,

  timeIncrement: 0.01,

  colors: {
    background: "#111111",
  },
} as const;

const input = { x: -99999, y: -99999, clicked: false };

type Particle = {
  isAlive: boolean;
  lifetime: number;
  x: number;
  y: number;
  xDirection: number;
  yDirection: number;
  size: number;
};

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.colors.background;
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

function createParticlesPool() {
  const particles: Particle[] = [];

  for (let i = 0; i < config.poolCount; i++) {
    const angle = Math.random() * Mathematics.TAU;
    const xDirection = Math.cos(angle);
    const yDirection = Math.sin(angle);

    const size = Mathematics.lerp(
      config.minSize,
      config.maxSize,
      Math.random(),
    );

    const particle: Particle = {
      isAlive: false,
      lifetime: 0,
      x: 0,
      y: 0,
      xDirection: xDirection,
      yDirection: yDirection,
      size: size,
    };

    particles.push(particle);
  }

  return particles;
}

function moveParticle(particle: Particle) {
  particle.x += particle.xDirection * config.speed;
  particle.y += particle.yDirection * config.speed;
}

function decayParticle(particle: Particle) {
  particle.lifetime -= config.decayRate;

  particle.size = particle.lifetime;

  if (particle.lifetime <= 0) particle.isAlive = false;
}

function renderParticle(particle: Particle, context: CanvasRenderingContext2D) {
  context.fillRect(particle.x, particle.y, particle.size, particle.size);
}

function spawnParticle(particle: Particle) {
  particle.isAlive = true;
  particle.lifetime = config.lifetime;
  particle.x = input.x;
  particle.y = input.y;
}

export function main(canvas: HTMLCanvasElement) {
  setupInput(canvas);

  const context = setupContext(canvas);

  const particles = createParticlesPool();

  let time = 0;
  let particleIndex = 0;
  const animation = () => {
    time += config.timeIncrement;

    renderBackground(context);

    if (input.clicked) {
      input.clicked = false;
      for (let i = 0; i < config.spawnCount; i++) {
        const particle = particles[particleIndex];
        spawnParticle(particle);
        particleIndex++;
        particleIndex %= config.poolCount;
      }
    }

    context.fillStyle = "orange";
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      if (!particle.isAlive) continue;
      moveParticle(particle);
      renderParticle(particle, context);
      decayParticle(particle);
    }

    requestAnimationFrame(animation);
  };

  animation();
}
