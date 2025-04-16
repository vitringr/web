import { Mathematics } from "@utilities/mathematics";
import { Canvas2D } from "@utilities/canvas2d";
import { Easing } from "@utilities/easing";
import { Config } from "./config";

type NamedEasingFunction = {
  name: string;
  f: (step: number) => number;
};

const namedEasingFunctions: NamedEasingFunction[] = [
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

const height = Config.gap + namedEasingFunctions.length * Config.gap;

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

function rails(context: CanvasRenderingContext2D) {
  const orbLeft = Config.left + Config.radius;
  const orbRight = Config.right - Config.radius;

  for (let i = 0; i < namedEasingFunctions.length; i++) {
    const y = getHeight(i);
    Canvas2D.circle(context, Config.left, y, Config.radius);
    Canvas2D.circle(context, Config.right, y, Config.radius);
    Canvas2D.line(context, orbLeft, y, orbRight, y);
  }
}

function names(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.colors.main;

  for (let i = 0; i < namedEasingFunctions.length; i++) {
    context.fillText(
      namedEasingFunctions[i].name,
      Config.text.x,
      getHeight(i) - Config.text.gap,
    );
  }
}

function background(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.colors.background;
  context.fillRect(0, 0, Config.width, height);
}

function railBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.colors.background;

  const bufferRadius = Config.radius + 1;
  const doubleRadius = bufferRadius * 2;

  for (let i = 0; i < namedEasingFunctions.length; i++) {
    context.fillRect(
      0,
      getHeight(i) - bufferRadius,
      Config.width,
      doubleRadius,
    );
  }
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  background(context);
  names(context);

  let time = 0;

  const loop = () => {
    time += Config.increment;
    time %= 1;

    railBackground(context);
    rails(context);

    context.fillStyle = Config.colors.main;

    for (let i = 0; i < namedEasingFunctions.length; i++) {
      const y = getHeight(i);

      const easing = Mathematics.lerp(
        Config.left,
        Config.right,
        namedEasingFunctions[i].f(time),
      );

      Canvas2D.fillCircle(context, easing, y, Config.radius);

      const linear = Mathematics.lerp(Config.left, Config.right, time);

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
