import { Config, defaultConfig, Keys } from "./config";

let config: Config;

const input = { x: -99999, y: -99999, clicked: false };

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
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

  window.addEventListener("pointerup", () => {
    input.clicked = false;
  });

  window.addEventListener("blur", () => {
    input.clicked = false;
  });

  window.addEventListener("keydown", (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    switch (key) {
      case Keys.Q: {
        console.log(Keys.Q);
        break;
      }
      case Keys.W: {
        console.log(Keys.W);
        break;
      }
      case Keys.E: {
        console.log(Keys.E);
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

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  setupInput(canvas);

  const context = setupContext(canvas);

  let time = 0;
  const animation = () => {
    time += config.timeIncrement;

    renderBackground(context);

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
