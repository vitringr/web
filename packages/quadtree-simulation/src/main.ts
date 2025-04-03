import { Structures } from "@utilities/structures";
import { Random } from "@utilities/random";

const config = {
  FPS: 60,

  width: 800,
  height: 800,

  particle: {
    size: 1,
    count: 3000,
    color: "#905000",
  },

  quadtree: {
    capacity: 4,
    lineWidth: 0.5,
    color: "#005020",
  },
} as const;

type Particle = {
  x: number;
  y: number;
};

function setup(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  canvas.width = config.width;
  canvas.height = config.height;

  context.fillStyle = config.particle.color;
  context.lineWidth = config.quadtree.lineWidth;
  context.strokeStyle = config.quadtree.color;

  return context;
}

function drawBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = "#111111";
  context.fillRect(0, 0, config.width, config.height);
}

function drawQuadtreeBounds(
  context: CanvasRenderingContext2D,
  qt: Structures.Quadtree<any>,
) {
  const bounds = qt.getBounds;

  context.beginPath();
  context.lineTo(bounds.x, bounds.y);
  context.lineTo(bounds.x + bounds.width, bounds.y);
  context.lineTo(bounds.x + bounds.width, bounds.y + bounds.height);
  context.lineTo(bounds.x, bounds.y + bounds.height);
  context.lineTo(bounds.x, bounds.y);
  context.closePath();
  context.stroke();
}

export function main(canvas: HTMLCanvasElement) {
  function drawParticle(context: CanvasRenderingContext2D, particle: Particle) {
    context.fillRect(
      particle.x,
      particle.y,
      config.particle.size,
      config.particle.size,
    );
  }

  const context = setup(canvas);

  const quadtree = new Structures.Quadtree<Particle>(
    {
      x: 0,
      y: 0,
      width: config.width,
      height: config.height,
    },
    config.quadtree.capacity,
  );

  const particles: Particle[] = [];

  for (let i = 0; i < config.particle.count; i++) {
    particles.push({
      x: Random.range(0, config.width),
      y: Random.range(0, config.height),
    });

    drawParticle(context, particles[i]);

    quadtree.insert(particles[i]);
  }

  quadtree.deepCallback((quadtree) => {
    drawQuadtreeBounds(context, quadtree);
  });

  setInterval(() => {
    quadtree.clear();

    drawBackground(context);

    context.fillStyle = config.particle.color;
    for (let i = 0; i < config.particle.count; i++) {
      const particle = particles[i];

      particle.x += Random.range(-1, 1);
      particle.y += Random.range(-1, 1);

      drawParticle(context, particle);

      quadtree.insert(particles[i]);
    }

    quadtree.deepCallback((quadtree) => {
      drawQuadtreeBounds(context, quadtree);
    });
  }, 1000 / config.FPS);
}
