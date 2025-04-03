export class Input {
  x: number = Infinity;
  y: number = Infinity;

  isClicked: boolean = false;

  private isInitialized: boolean = false;

  setup(target: HTMLElement) {
    if (this.isInitialized) throw "Input already initialized";
    this.isInitialized = true;

    const bounds = target.getBoundingClientRect();

    target.addEventListener("pointerdown", () => {
      this.isClicked = true;
    });

    target.addEventListener("pointerup", () => {
      this.isClicked = false;
    });

    target.addEventListener("pointermove", (event: PointerEvent) => {
      this.x = event.clientX - bounds.left;
      this.y = event.clientY - bounds.top;
    });

    window.addEventListener("blur", () => {
      this.isClicked = false;
    });
  }
}
