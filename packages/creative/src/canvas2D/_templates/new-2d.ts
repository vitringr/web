type Config = {
  width: 600;
  height: 600;

  colors: {
    background: "#111111";
  };
};

const defaultConfig: Config = {
  width: 600,
  height: 600,

  colors: {
    background: "#111111",
  },
} as const;

let config: Config;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const context = setupContext(canvas);

  const animation = () => {
    renderBackground(context);

    requestAnimationFrame(animation);
  };

  animation();
}
