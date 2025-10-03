import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/data-structures";
import { Mathematics } from "@utilities/mathematics";

const defaultConfig = {
  size: 600,

  scale: 120,
  waveGap: 30,

  unitCircleStart: 0.25,

  lineWidth: 2,
  specialLineWidth: 3,
  pointRadius: 4,

  timeIncrement: 0.005,
  waveSpeed: 20,

  text: {
    fontSize: 0.05,
    x: 0.58,
    y: 0.65,
    yGap: 0.12,
  },

  colors: {
    background: "#202020",
    main: "#CCCCCC",
    sin: "#FF3300",
    cos: "#FF9000",
  },
} as const;

type Config = typeof defaultConfig;

let config: Config;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.size;
  canvas.height = config.size;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.lineWidth = config.lineWidth;

  return context;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const context = setupContext(canvas);

  const head: Vector2 = Vector2.Create.zero();
  let theta: number = 0;

  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.size, config.size);

  const animation = () => {
    theta -= config.timeIncrement;

    head.set(Math.cos(theta) * config.scale, Math.sin(theta) * config.scale);

    context.translate(config.size * config.unitCircleStart, config.size * config.unitCircleStart);

    // clear unit circle
    context.fillStyle = config.colors.background;
    context.fillRect(
      -config.scale - config.pointRadius * 2,
      -config.scale - config.pointRadius * 2,
      (config.scale + config.pointRadius * 2) * 2,
      (config.scale + config.pointRadius * 2) * 2,
    );

    // cosine
    context.lineWidth = 3;
    context.strokeStyle = config.colors.cos;
    Canvas2D.line(context, 0, 0, head.x, 0);

    // sine
    context.strokeStyle = config.colors.sin;
    Canvas2D.line(context, head.x, 0, head.x, head.y);

    // unit circle
    context.lineWidth = 2;
    context.fillStyle = context.strokeStyle = config.colors.main;
    Canvas2D.circleFill(context, 0, 0, config.pointRadius);
    Canvas2D.circle(context, 0, 0, config.scale);

    // hypotenuse
    Canvas2D.line(context, 0, 0, head.x, head.y);
    Canvas2D.circleFill(context, head.x, head.y, config.pointRadius);

    // sine wave
    context.fillStyle = config.colors.sin;
    Canvas2D.circleFill(context, config.scale + config.waveGap - theta * config.waveSpeed, head.y, 1);

    // cosine wave
    context.fillStyle = config.colors.cos;
    Canvas2D.circleFill(context, head.x, config.scale + config.waveGap - theta * config.waveSpeed, 1);

    context.resetTransform();

    // clear text
    context.fillStyle = config.colors.background;
    context.fillRect(config.size * 0.5, config.size * 0.5, config.size, config.size);

    context.font = config.text.fontSize * config.size + "px monospace";
    context.fillStyle = config.colors.main;
    context.fillText(
      "theta:\t" + -Mathematics.radiansToDegrees(theta % Mathematics.TAU).toFixed() + "°",
      config.text.x * config.size,
      config.text.y * config.size,
    );
    context.fillStyle = config.colors.sin;
    context.fillText(
      "sin θ:\t" + -(head.y / config.scale).toFixed(2),
      config.text.x * config.size,
      (config.text.y + config.text.yGap) * config.size,
    );
    context.fillStyle = config.colors.cos;
    context.fillText(
      "cos θ:\t" + (head.x / config.scale).toFixed(2),
      config.text.x * config.size,
      (config.text.y + config.text.yGap * 2) * config.size,
    );

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
