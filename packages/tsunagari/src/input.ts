import { Structures } from "@utilities/structures";

export class Input {
  position = Structures.Vector2.one().scale(Infinity);
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
      this.position.set(
        event.clientX - bounds.left,
        event.clientY - bounds.top,
      );
    });

    window.addEventListener("blur", () => {
      this.isClicked = false;
    });
  }
}
