import { Canvas2D } from "@utilities/canvas2d";
import { Config, defaultConfig } from "./config";

let config: Config;

enum Spell {
  Quas,
  Wex,
  Exort,
}

const queue: Spell[] = [];

let duration: number = 0;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  Canvas2D.flipY(context, config.height);

  context.lineWidth = 1;
  context.strokeStyle = config.colors.stroke;

  return context;
}

function setupInput() {
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    switch (key) {
      case "q": {
        addSpell(Spell.Quas);
        break;
      }
      case "w": {
        addSpell(Spell.Wex);
        break;
      }
      case "e": {
        addSpell(Spell.Exort);
        break;
      }
      case "j": {
        console.log(key);
        break;
      }
      case "k": {
        console.log(key);
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

function addSpell(spell: Spell) {
  queue.unshift(spell);

  if (queue.length > config.maxElements) {
    queue.pop();
  }

  duration = config.maxDuration;
}

function updateResetTimer() {
  if (--duration <= 0) {
    duration = 0;
    queue.length = 0;
  }
}

function getColor(spell: Spell) {
  if (spell == Spell.Quas) return config.colors.Q;
  if (spell == Spell.Wex) return config.colors.W;
  if (spell == Spell.Exort) return config.colors.E;
  throw new Error("invalid color");
}

function renderQueue(context: CanvasRenderingContext2D) {
  const cfg = config.queue;

  for (let i = 0; i < config.maxElements; i++) {
    context.strokeRect(cfg.x - i * (cfg.boxWidth + cfg.gap), cfg.y, cfg.boxWidth, cfg.boxHeight);
  }

  const durationScale = 1 - duration / config.maxDuration;

  for (let i = 0; i < queue.length; i++) {
    const spell = queue[i];

    context.fillStyle = getColor(spell) + "50";
    context.fillRect(
      cfg.x - i * (cfg.boxWidth + cfg.gap),
      cfg.y,
      cfg.boxWidth,
      cfg.boxHeight,
    );

    context.fillStyle = getColor(spell);
    context.fillRect(
      cfg.x - i * (cfg.boxWidth + cfg.gap),
      cfg.y,
      cfg.boxWidth,
      cfg.boxHeight - cfg.boxHeight * durationScale,
    );
  }
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  setupInput();

  const context = setupContext(canvas);

  const animation = () => {
    updateResetTimer();

    renderBackground(context);
    renderQueue(context);

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
