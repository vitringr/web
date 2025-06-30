const config = {
  width: 600,
  height: 600,

  spriteWidth: 30,
  spriteHeight: 30,

  colors: {
    background: "#111111",
    font: "#cccccc",
  },
} as const;

const characters = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as const;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context!";

  return context;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);
}

function setupSprites() {
  const sprites: HTMLImageElement[] = [];

  const width = config.spriteWidth;
  const height = config.spriteHeight;
  const halfWidth = width * 0.5;
  const halfHeight = height * 0.5;

  const yOffset = height * 0.1;

  const oCanvas = document.createElement("canvas");
  oCanvas.width = width;
  oCanvas.height = height;

  const oContext = oCanvas.getContext("2d");
  if (!oContext) throw "Cannot get 2d context!";
  oContext.font = `${width}px monospace`;
  oContext.fillStyle = config.colors.font;
  oContext.textAlign = "center";
  oContext.textBaseline = "middle";
  oContext.textRendering = "optimizeSpeed";

  for (let i = 0; i < characters.length; i++) {
    oContext.clearRect(0, 0, width, height);
    oContext.fillText(characters[i], halfWidth, halfHeight + yOffset);

    const img = new Image();
    img.src = oCanvas.toDataURL();

    sprites.push(img);
  }

  return sprites;
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const sprites = setupSprites();

  const xGap = config.width / 7;
  const yGap = config.height / 7;
  for (let x = 0; x < 7; x++) {
    for (let y = 0; y < 7; y++) {
      const index = y + x * 7;
      const xPosition = xGap * 0.5 + xGap * x;
      const yPosition = xGap * 0.5 + yGap * y;
      context.drawImage(sprites[index], xPosition, yPosition);
    }
  }

  // const animation = () => {
  //   requestAnimationFrame(animation);
  // };
  // animation();
}
