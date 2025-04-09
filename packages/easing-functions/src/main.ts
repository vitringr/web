import { Canvas2D } from "@utilities/canvas2d";
import { Easing } from "@utilities/easing";
import { Config } from "./config";

const easingFunctions: ((step: number) => number)[] = [
  Easing.linear,
  Easing.easeInQuad,
  Easing.easeOutQuad,
  Easing.easeInOutQuad,
  Easing.easeInCubic,
  Easing.easeOutCubic,
  Easing.easeInOutCubic,
  Easing.easeInQuart,
  Easing.easeOutQuart,
  Easing.easeInOutQuart,
  Easing.easeInQuint,
  Easing.easeOutQuint,
  Easing.easeInOutQuint,
  Easing.easeInSine,
  Easing.easeOutSine,
  Easing.easeInOutSine,
  Easing.easeInExpo,
  Easing.easeOutExpo,
  Easing.easeInOutExpo,
  Easing.easeInCirc,
  Easing.easeOutCirc,
  Easing.easeInOutCirc,
  Easing.easeInBack,
  Easing.easeOutBack,
  Easing.easeInOutBack,
  Easing.easeInElastic,
  Easing.easeOutElastic,
  Easing.easeInOutElastic,
  Easing.easeInBounce,
  Easing.easeOutBounce,
  Easing.easeInOutBounce,
];

const height = Config.gap + easingFunctions.length * Config.gap;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.style.border = "1px solid red";
  canvas.width = Config.width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function getHeight(index: number) {
  return Config.gap + index * Config.gap;
}

function renderRails(context: CanvasRenderingContext2D) {
  const orbLeft = Config.left + Config.radius;
  const orbRight = Config.right - Config.radius;

  context.fillStyle = context.strokeStyle = Config.colors.main;

  for (let i = 0; i < easingFunctions.length; i++) {
    const y = getHeight(i);
    Canvas2D.circle(context, Config.left, y, Config.radius);
    Canvas2D.circle(context, Config.right, y, Config.radius);
    Canvas2D.line(context, orbLeft, y, orbRight, y);
  }
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  let time = 0;
  const loop = () => {
    time += Config.increment;
    time = time % 1;

    context.fillStyle = Config.colors.background;
    context.fillRect(0, 0, Config.width, height);

    renderRails(context);

    context.fillStyle = Config.colors.main;
    for (let i = 0; i < easingFunctions.length; i++) {
      const easing = easingFunctions[i](time);
      const step = Easing.lerp(Config.left, Config.right, easing);

      Canvas2D.fillCircle(context, step, getHeight(i), Config.radius);
    }

    requestAnimationFrame(loop);
  };
  loop();
}
