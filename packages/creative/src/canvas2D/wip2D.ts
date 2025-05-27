import { Collision } from "@utilities/collision";
import { Mathematics } from "@utilities/mathematics";

const config = {
  width: 600,
  height: 600,

  colors: {
    background: "#111111",
  },
} as const;

enum Input {
  NONE,
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

let input: Input = Input.NONE;

function setupInput() {
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    switch (key) {
      case "w":
        input = Input.UP;
        break;
      case "a":
        input = Input.LEFT;
        break;
      case "s":
        input = Input.DOWN;
        break;
      case "d":
        input = Input.RIGHT;
        break;
      default:
        input = Input.NONE;
    }
  });

  window.addEventListener("keyup", () => {
    input = Input.NONE;
  });

  window.addEventListener("blur", () => {
    input = Input.NONE;
  });
}

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  canvas.style.border = "1px solid red";

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.font = "20px Arial";

  return context;
}

// ----------
// -- Game --
// ----------

function drawPlayer(context: CanvasRenderingContext2D) {
  context.fillStyle = player.color;
  context.beginPath();
  context.arc(player.x, player.y, player.radius, 0, Mathematics.TAU);
  context.fill();
}

function drawBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);
}

function movePlayer() {
  switch (input) {
    case Input.NONE:
      break;
    case Input.UP:
      player.y -= player.speed;
      break;
    case Input.DOWN:
      player.y += player.speed;
      break;
    case Input.LEFT:
      player.x -= player.speed;
      break;
    case Input.RIGHT:
      player.x += player.speed;
      break;
  }
}

function limitPlayerToBounds() {
  if (player.y - player.radius <= 0) player.y = player.radius;
  else if (player.y + player.radius >= config.height)
    player.y = config.height - player.radius;

  if (player.x - player.radius <= 0) player.x = player.radius;
  else if (player.x + player.radius >= config.width)
    player.x = config.width - player.radius;
}

const player = {
  x: 300,
  y: 300,

  color: "#00AAAA",

  radius: 20,

  speed: 1,
};

const target = {
  x: 200,
  y: 100,

  radius: 40,

  color: "#AA0000",
};

function drawTarget(context: CanvasRenderingContext2D) {
  context.fillStyle = target.color;
  context.beginPath();
  context.arc(target.x, target.y, target.radius, 0, Mathematics.TAU);
  context.fill();
}



export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  setupInput();

  const animation = () => {
    player.speed += 0.001
    console.log("player.speed:", player.speed);


    drawBackground(context);
    drawTarget(context);
    drawPlayer(context);

    movePlayer();
    limitPlayerToBounds();

    // -----------
    // -- Logic --
    // -----------

    const doesTouch = Collision.circle_circle(
      player.x,
      player.y,
      player.radius,
      target.x,
      target.y,
      target.radius,
    );

    // if (doesTouch) {
    //
    //   if (asd) {
    //     asd.style.border = "10px solid red";
    //   }
    // }

    requestAnimationFrame(animation);
  };

  animation();
}
