import { Mathematics } from "@utilities/mathematics";

const defaultConfig = {
  width: 600,
  height: 600,

  spawnRadius: 120,

  size: 4,

  backgroundColor: "#202020",
  walkerColors: [
    "#C84053",
    "#6F894E",
    "#77713F",
    "#4D699B",
    "#B35B79",
    "#597B75",
    "#545464",
    "#8A8980",
    "#D7474B",
    "#6E915F",
    "#836F4A",
    "#6693BF",
    "#624C83",
    "#5E857A",
    "#43436C",
    "#BF8F10",
  ],
};

type Config = typeof defaultConfig;

let config: Config;

type Walker = {
  x: number;
  y: number;
  color: string;
};

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.strokeStyle = "#000000";
  context.lineWidth = 0.05;

  return context;
}

function moveWalker(walker: Walker) {
  const rng = Math.random();

  const wallWidth = config.width - config.size;
  const wallHeight = config.height - config.size;

  if (rng < 0.25) {
    if (walker.x < wallWidth) walker.x += config.size;
  } else if (rng < 0.5) {
    if (walker.x > config.size) walker.x -= config.size;
  } else if (rng < 0.75) {
    if (walker.y < wallHeight) walker.y += config.size;
  } else {
    if (walker.y > config.size) walker.y -= config.size;
  }
}

function createWalkers() {
  const walkers: Walker[] = [];

  const count = config.walkerColors.length;

  const xCenter = config.width * 0.5;
  const yCenter = config.height * 0.5;

  const angleStep = Mathematics.TAU / count;

  for (let i = 0; i < count; i++) {
    const angle = angleStep * i;
    const xSpawn = xCenter + Math.cos(angle) * config.spawnRadius;
    const ySpawn = yCenter + Math.sin(angle) * config.spawnRadius;

    walkers.push({ x: xSpawn, y: ySpawn, color: config.walkerColors[i] });
  }

  return walkers;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const context = setupContext(canvas);

  const walkers = createWalkers();

  context.fillStyle = config.backgroundColor;
  context.fillRect(0, 0, config.width, config.height);

  const animation = () => {
    for (const walker of walkers) {
      moveWalker(walker);
      context.fillStyle = walker.color;
      context.fillRect(walker.x, walker.y, config.size, config.size);
      context.strokeRect(walker.x, walker.y, config.size, config.size);
    }

    requestAnimationFrame(animation);
  };

  animation();
}
