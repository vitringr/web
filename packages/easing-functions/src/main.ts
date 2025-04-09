import { Canvas2D } from "@utilities/canvas2d";
import { Easing } from "@utilities/easing";
import { Config } from "./config";
import { line } from "../../../utilities/canvas2d/src/main";

type NamedEasingFunction = {
  name: string;
  f: (step: number) => number;
};

const easingFunctions: NamedEasingFunction[] = [
  { name: "linear", f: Easing.linear },
  { name: "easeInQuad", f: Easing.easeInQuad },
  { name: "easeOutQuad", f: Easing.easeOutQuad },
  { name: "easeInOutQuad", f: Easing.easeInOutQuad },
  { name: "easeInCubic", f: Easing.easeInCubic },
  { name: "easeOutCubic", f: Easing.easeOutCubic },
  { name: "easeInOutCubic", f: Easing.easeInOutCubic },
  { name: "easeInQuart", f: Easing.easeInQuart },
  { name: "easeOutQuart", f: Easing.easeOutQuart },
  { name: "easeInOutQuart", f: Easing.easeInOutQuart },
  { name: "easeInQuint", f: Easing.easeInQuint },
  { name: "easeOutQuint", f: Easing.easeOutQuint },
  { name: "easeInOutQuint", f: Easing.easeInOutQuint },
  { name: "easeInSine", f: Easing.easeInSine },
  { name: "easeOutSine", f: Easing.easeOutSine },
  { name: "easeInOutSine", f: Easing.easeInOutSine },
  { name: "easeInExpo", f: Easing.easeInExpo },
  { name: "easeOutExpo", f: Easing.easeOutExpo },
  { name: "easeInOutExpo", f: Easing.easeInOutExpo },
  { name: "easeInCirc", f: Easing.easeInCirc },
  { name: "easeOutCirc", f: Easing.easeOutCirc },
  { name: "easeInOutCirc", f: Easing.easeInOutCirc },
  { name: "easeInBack", f: Easing.easeInBack },
  { name: "easeOutBack", f: Easing.easeOutBack },
  { name: "easeInOutBack", f: Easing.easeInOutBack },
  { name: "easeInElastic", f: Easing.easeInElastic },
  { name: "easeOutElastic", f: Easing.easeOutElastic },
  { name: "easeInOutElastic", f: Easing.easeInOutElastic },
  { name: "easeInBounce", f: Easing.easeInBounce },
  { name: "easeOutBounce", f: Easing.easeOutBounce },
  { name: "easeInOutBounce", f: Easing.easeInOutBounce },
];

const height = Config.gap + easingFunctions.length * Config.gap;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.strokeStyle = Config.colors.main;
  context.lineWidth = 1;

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `${Config.text.size}px arial`;

  return context;
}

function getHeight(index: number) {
  return Config.gap + index * Config.gap;
}

function renderRails(context: CanvasRenderingContext2D) {
  const orbLeft = Config.left + Config.radius;
  const orbRight = Config.right - Config.radius;

  context.fillStyle = Config.colors.main;

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
      const current = easingFunctions[i];

      const y = getHeight(i);

      context.fillText(current.name, Config.text.x, y - Config.text.gap);

      const easing = Easing.lerp(Config.left, Config.right, current.f(time));
      Canvas2D.fillCircle(context, easing, y, Config.radius);

      const linear = Easing.lerp(Config.left, Config.right, time);
      Canvas2D.line(
        context,
        linear,
        y - Config.radius,
        linear,
        y + Config.radius,
      );
    }

    requestAnimationFrame(loop);
  };
  loop();
}
