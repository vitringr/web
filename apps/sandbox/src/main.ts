import { Structures } from "@utilities/structures";
import { Random } from "@utilities/random";

// CONFIG

const FPS = 60;

const width = 800;
const height = 800;

const particleSize = 1;
const particleCount = 3000;
const particleColor = "#905000";

const quadtreeCapacity = 4;
const quadtreeLineWidth = 0.5;
const quadtreeColor = "#005020";

// SETUP

type Particle = {
  x: number;
  y: number;
};

const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
if (!canvas) throw "Invalid #mainCanvas HTML element!";

const context = canvas.getContext("2d");
if (!context) throw "Cannot get 2d context";

canvas.width = width;
canvas.height = height;

context.fillStyle = "#111111";
context.fillRect(0, 0, width, height);

context.fillStyle = particleColor;
context.lineWidth = quadtreeLineWidth;
context.strokeStyle = quadtreeColor;

// MAIN

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

function drawParticle(context: CanvasRenderingContext2D, particle: Particle) {
  context.fillRect(particle.x, particle.y, particleSize, particleSize);
}

const quadtree = new Structures.Quadtree<Particle>(
  {
    x: 0,
    y: 0,
    width: width,
    height: height,
  },
  quadtreeCapacity,
);

const particles: Particle[] = [];

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Random.range(0, width),
    y: Random.range(0, height),
  });
}

for (let i = 0; i < particleCount; i++) {
  drawParticle(context, particles[i]);
}

for (let i = 0; i < particleCount; i++) {
  quadtree.insert(particles[i]);
}

quadtree.deepCallback((quadtree) => {
  drawQuadtreeBounds(context, quadtree);
});

// LOOP

const loop = setInterval(() => {
  quadtree.clear();

  context.fillStyle = "#111111";
  context.fillRect(0, 0, width, height);

  context.fillStyle = particleColor;
  for (let i = 0; i < particleCount; i++) {
    const particle = particles[i];

    particle.x += Random.range(-1, 1);
    particle.y += Random.range(-1, 1);

    drawParticle(context, particle);

    quadtree.insert(particles[i]);
  }

  quadtree.deepCallback((quadtree) => {
    drawQuadtreeBounds(context, quadtree);
  });
}, 1000 / FPS);
