import { Config, defaultConfig } from "./config";

let config: Config;

type Element = Keys.Q | Keys.W | Keys.E;

enum Keys {
  Q = "q",
  W = "w",
  E = "e",
  J = "j",
  K = "k",
}

const queue: Element[] = [];

const boxTimers: number[] = [0, 0, 0];

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.lineWidth = 1;
  context.strokeStyle = config.colors.stroke;

  return context;
}

function setupInput() {
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    switch (key) {
      case Keys.Q:
      case Keys.W:
      case Keys.E: {
        addElement(key);
        break;
      }
      case Keys.J: {
        console.log(Keys.J);
        break;
      }
      case Keys.K: {
        console.log(Keys.K);
        break;
      }
      default:
        break;
    }
  });
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);
}

function addElement(element: Element) {
  queue.push(element);

  if (queue.length > config.maxElements) {
    queue.shift();
  }
}

function renderQueue(context: CanvasRenderingContext2D) {
  const cfg = config.queue;

  for (let i = 0; i < config.maxElements; i++) {
    context.strokeRect(cfg.x + i * (cfg.boxWidth + cfg.gap), cfg.y, cfg.boxWidth, cfg.boxHeight);
  }

  for (let i = 0; i < queue.length; i++) {
    const element = queue[i];

    let color = "#AAAAAA";
    if (element == Keys.Q) color = config.colors.Q;
    if (element == Keys.W) color = config.colors.W;
    if (element == Keys.E) color = config.colors.E;
    context.fillStyle = color;

    context.fillRect(cfg.x + i * (cfg.boxWidth + cfg.gap), cfg.y, cfg.boxWidth, cfg.boxHeight);
  }
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  setupInput();

  const context = setupContext(canvas);

  const animation = () => {
    renderBackground(context);

    renderQueue(context);

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
