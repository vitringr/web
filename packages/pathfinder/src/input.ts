export class Input {
  static x: number = 0;
  static y: number = 0;
  static isClicked: boolean = false;

  private static _initialized: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    if (Input._initialized) return;
    Input._initialized = true;

    const bounds = canvas.getBoundingClientRect();

    canvas.addEventListener("pointermove", (event: PointerEvent) => {
      Input.x = event.x - bounds.left;
      Input.y = event.y - bounds.top;
    });

    window.addEventListener("pointerdown", () => {
      Input.isClicked = true;
    });

    window.addEventListener("pointerup", () => {
      Input.isClicked = false;
    });

    window.addEventListener("blur", () => {
      Input.isClicked = false;
    });
  }
}
