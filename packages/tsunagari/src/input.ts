import { Structures } from "@utilities/structures";

export class Input {
  position = Structures.Vector2.infinity();
  isClicked: boolean = false;

  targetedNodeID: number | null = null;

  constructor(target: HTMLElement) {
    const bounds = target.getBoundingClientRect();

    target.addEventListener("pointerdown", () => {
      this.isClicked = true;
    });

    target.addEventListener("pointerup", () => {
      this.isClicked = false;
    });

    target.addEventListener("pointermove", (event: PointerEvent) => {
      this.position.x = event.clientX - bounds.left;
      this.position.y = event.clientY - bounds.top;
    });

    window.addEventListener("blur", () => {
      this.isClicked = false;
    });
  }
}
