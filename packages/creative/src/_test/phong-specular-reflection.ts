import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/data-structures";

const defaultConfig = {
  width: 600,
  height: 600,

  scale: 40,
};

type Config = typeof defaultConfig;

let config: Config;

const input = {
  position: Vector2.Create.zero(),
  isClicked: false,
};

function setupInput(canvas: HTMLCanvasElement) {
  canvas.addEventListener("pointermove", (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    input.position.x = event.clientX - bounds.left;
    input.position.y = event.clientY - bounds.top;

    input.position.x -= 300;
    input.position.y += 300;

    input.position.x /= config.width;
    input.position.y /= config.height;

    input.position.y = 1 - input.position.y;
  });

  canvas.addEventListener("pointerdown", () => {
    input.isClicked = true;
  });

  window.addEventListener("pointerup", () => {
    input.isClicked = false;
  });

  window.addEventListener("blur", () => {
    input.isClicked = false;
  });
}

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = "#202020";
  context.fillRect(0, 0, config.width, config.height);
}

function renderVector(context: CanvasRenderingContext2D, vector: Vector2, color: string) {
  context.strokeStyle = color;

  const scaledVector = vector.clone().scale(config.scale);
  Canvas2D.line(context, 0, 0, scaledVector.x, scaledVector.y);
}

function renderAxes(context: CanvasRenderingContext2D, color: string) {
  context.lineWidth = 0.5;
  context.strokeStyle = color;
  Canvas2D.line(context, 0, config.height * 0.5, config.width, config.height * 0.5);
  Canvas2D.line(context, config.width * 0.5, 0, config.width * 0.5, config.height);
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  setupInput(canvas);
  const context = setupContext(canvas);

  const normal = new Vector2(0, 4).normalize();
  const light = new Vector2(5, 3);
  const eye = new Vector2(-3, 4);

  const animation = () => {
    renderBackground(context);
    renderAxes(context, "gray");

    Canvas2D.flipY(context, config.height);
    context.translate(config.width * 0.5, config.height * 0.5);

    light.copy(input.position.normalize().scale(6));

    const negativeLight = light.clone().scale(-1);
    const lightDotNormal = normal.clone().scale(Vector2.dot(light, normal));

    context.lineWidth = 3;
    renderVector(context, light, "yellow");
    renderVector(context, negativeLight, "orange");
    renderVector(context, eye, "teal");

    renderVector(context, lightDotNormal, "gray");
    renderVector(context, normal, "green");

    renderVector(context, lightDotNormal.clone().scale(2).subtract(light), "red");

    context.resetTransform();

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
