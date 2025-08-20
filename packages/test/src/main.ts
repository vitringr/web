import { Canvas2D } from "@utilities/canvas2d";
import { Config, defaultConfig } from "./config";
import { Mathematics } from "@utilities/mathematics";

// ----------
// -- Data --
// ----------

let config: Config;

enum OrbType {
  Quas,
  Wex,
  Exort,
}

type Orb = {
  type: OrbType;
  duration: number;
};

const ELEMENTS_COUNT = 3;

const queue: Orb[] = [];

const spells = {
  single: { Q: 0, W: 0, E: 0 } as Record<string, number>,
  double: { QQ: 0, WW: 0, EE: 0, QW: 0, WE: 0, QE: 0 } as Record<string, number>,
  triple: { QQQ: 0, WWW: 0, EEE: 0, QQW: 0, QQE: 0, QWW: 0, WWE: 0, QEE: 0, WEE: 0, QWE: 0 } as Record<string, number>,
};

function renderSpells(context: CanvasRenderingContext2D) {
  const cfg = config.spells;

  context.fillStyle = "#606060";

  // ------------
  // -- Single --
  // ------------
  Object.entries(spells.single).forEach(([_spell, duration], i) => {
    Canvas2D.circle(context, cfg.single.x + i * cfg.gap, cfg.single.y, cfg.radius);

    // Hints
    const split = _spell.split("");
    for (const letter of split) {
      context.fillStyle = getColorLetter(letter);
      Canvas2D.circleFill(context, cfg.single.x + i * cfg.gap, cfg.single.y, cfg.radius * cfg.hintScale);
    }

    // Duration
    if (duration > 0) {
      context.fillStyle = config.colors.gray;
      Canvas2D.circleFill(
        context,
        cfg.single.x + i * cfg.gap,
        cfg.single.y,
        cfg.radius * Mathematics.lerp(0, 1, duration / config.spellDuration),
      );
    }

    if (--spells.single[_spell] < 0) spells.single[_spell] = 0;
  });

  // ------------
  // -- Double --
  // ------------
  Object.entries(spells.double).forEach(([_spell, duration], i) => {
    Canvas2D.circle(context, cfg.double.x + i * cfg.gap, cfg.double.y, cfg.radius);

    // Hints
    const split = _spell.split("");
    for (let k = 0; k < split.length; k++) {
      const letter = split[k];
      context.fillStyle = getColorLetter(letter);
      Canvas2D.circleFill(
        context,
        cfg.double.x + cfg.double.hintX + i * cfg.gap + k * cfg.hintGap,
        cfg.double.y,
        cfg.radius * cfg.hintScale,
      );
    }

    // Duration
    if (duration > 0) {
      context.fillStyle = config.colors.gray;
      Canvas2D.circleFill(
        context,
        cfg.double.x + i * cfg.gap,
        cfg.double.y,
        cfg.radius * Mathematics.lerp(0, 1, duration / config.spellDuration),
      );
    }

    if (--spells.double[_spell] < 0) spells.double[_spell] = 0;
  });

  // ------------
  // -- Triple --
  // ------------
  Object.entries(spells.triple).forEach(([_spell, duration], i) => {
    Canvas2D.circle(context, cfg.triple.x + i * cfg.gap, cfg.triple.y, cfg.radius);

    // Hints
    const split = _spell.split("");
    for (let k = 0; k < split.length; k++) {
      const letter = split[k];
      context.fillStyle = getColorLetter(letter);
      Canvas2D.circleFill(
        context,
        cfg.triple.x + cfg.triple.hintX + i * cfg.gap + k * cfg.hintGap,
        cfg.triple.y,
        cfg.radius * cfg.hintScale,
      );
    }

    if (duration > 0) {
      context.fillStyle = config.colors.gray;
      Canvas2D.circleFill(
        context,
        cfg.triple.x + i * cfg.gap,
        cfg.triple.y,
        cfg.radius * Mathematics.lerp(0, 1, duration / config.spellDuration),
      );
    }

    if (--spells.triple[_spell] < 0) spells.triple[_spell] = 0;
  });
}

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
  context.strokeStyle = config.colors.gray;

  return context;
}

function setupInput() {
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    switch (key) {
      case "q": {
        addOrb(OrbType.Quas);
        break;
      }
      case "w": {
        addOrb(OrbType.Wex);
        break;
      }
      case "e": {
        addOrb(OrbType.Exort);
        break;
      }
      case "j": {
        cast();
        break;
      }
      case "k": {
        cast();
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

function addOrb(orbType: OrbType) {
  queue.unshift({ type: orbType, duration: config.orbDuration });

  if (queue.length > ELEMENTS_COUNT) {
    queue.pop();
  }
}

function cast() {
  if (queue.length <= 0) return;

  const spell = queue
    .map((orb) => orb.type)
    .sort()
    .map((orbType) => {
      if (orbType === OrbType.Quas) return "Q";
      if (orbType === OrbType.Wex) return "W";
      if (orbType === OrbType.Exort) return "E";
      throw new Error("Invalid type");
    })
    .join("");

  queue.length = 0;

  if (spell.length === 1) spells.single[spell] = config.spellDuration;
  if (spell.length === 2) spells.double[spell] = config.spellDuration;
  if (spell.length === 3) spells.triple[spell] = config.spellDuration;
}

function decreaseOrbDurations() {
  for (const orb of queue) {
    orb.duration--;
    if (orb.duration <= 0) {
      queue.pop();
    }
  }
}

function getColor(orbType: OrbType) {
  if (orbType == OrbType.Quas) return config.colors.Q;
  if (orbType == OrbType.Wex) return config.colors.W;
  if (orbType == OrbType.Exort) return config.colors.E;
  throw new Error("invalid color");
}

function getColorLetter(letter: string) {
  if (letter == "Q") return config.colors.Q;
  if (letter == "W") return config.colors.W;
  if (letter == "E") return config.colors.E;
  throw new Error("invalid color");
}

function renderQueue(context: CanvasRenderingContext2D) {
  const cfg = config.orbs;

  for (let i = 0; i < ELEMENTS_COUNT; i++) {
    context.strokeRect(cfg.x - i * (cfg.boxWidth + cfg.gap), cfg.y, cfg.boxWidth, cfg.boxHeight);
  }

  for (let i = 0; i < queue.length; i++) {
    const orb = queue[i];

    const durationScale = 1 - orb.duration / config.orbDuration;

    context.fillStyle = getColor(orb.type) + "50";
    context.fillRect(cfg.x - i * (cfg.boxWidth + cfg.gap), cfg.y, cfg.boxWidth, cfg.boxHeight);

    context.fillStyle = getColor(orb.type);
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
    decreaseOrbDurations();

    renderBackground(context);
    renderQueue(context);
    renderSpells(context);

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
