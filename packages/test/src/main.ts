import { Canvas2D } from "@utilities/canvas2d";
import { Config, defaultConfig } from "./config";

// ----------
// -- Data --
// ----------

let config: Config;

enum SpellType {
  Quas,
  Wex,
  Exort,
}

type Spell = {
  type: SpellType;
  duration: number;
};

const ELEMENTS_COUNT = 3;

const queue: Spell[] = [];

// -----------
// -- Logic --
// -----------

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
        addSpell(SpellType.Quas);
        break;
      }
      case "w": {
        addSpell(SpellType.Wex);
        break;
      }
      case "e": {
        addSpell(SpellType.Exort);
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

function addSpell(spellType: SpellType) {
  queue.unshift({ type: spellType, duration: config.maxDuration });

  if (queue.length > ELEMENTS_COUNT) {
    queue.pop();
  }
}

function decreaseDurations() {
  for (const spell of queue) {
    spell.duration--;
    if (spell.duration <= 0) {
      queue.pop();
    }
  }
}

function getColor(spellType: SpellType) {
  if (spellType == SpellType.Quas) return config.colors.Q;
  if (spellType == SpellType.Wex) return config.colors.W;
  if (spellType == SpellType.Exort) return config.colors.E;
  throw new Error("invalid color");
}

function renderQueue(context: CanvasRenderingContext2D) {
  const cfg = config.queue;

  for (let i = 0; i < ELEMENTS_COUNT; i++) {
    context.strokeRect(cfg.x - i * (cfg.boxWidth + cfg.gap), cfg.y, cfg.boxWidth, cfg.boxHeight);
  }

  for (let i = 0; i < queue.length; i++) {
    const spell = queue[i];

    const durationScale = 1 - spell.duration / config.maxDuration;

    context.fillStyle = getColor(spell.type) + "50";
    context.fillRect(cfg.x - i * (cfg.boxWidth + cfg.gap), cfg.y, cfg.boxWidth, cfg.boxHeight);

    context.fillStyle = getColor(spell.type);
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
    decreaseDurations();

    renderBackground(context);
    renderQueue(context);

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
