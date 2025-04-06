import { Structures } from "@utilities/structures";
import Config from "./config";
import { Collision } from "@utilities/collision";
import { Node } from "./node";

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

  main(quadtree: Structures.Quadtree<Node, any>, nodes: Node[]) {
    const inCanvas = Collision.point_rectangle(
      this.position.x,
      this.position.y,
      0,
      0,
      Config.width,
      Config.height,
    );
    if (!inCanvas) return;

    if (this.isClicked) {
      this.targetedNodeID !== null &&
        nodes[this.targetedNodeID].position.copy(this.position);

      return;
    }

    this.targetedNodeID = null;

    const targetArea: Structures.Shapes.Rectangle = {
      x: this.position.x - Config.render.node.radius,
      y: this.position.y - Config.render.node.radius,
      w: Config.render.node.radius * 2,
      h: Config.render.node.radius * 2,
    };

    const nodesInArea = quadtree.query(targetArea);
    for (const target of nodesInArea) {
      if (
        Collision.point_circle(
          this.position.x,
          this.position.y,
          target.x,
          target.y,
          Config.render.node.radius,
        )
      ) {
        this.targetedNodeID = target.id;

        this.isClicked && target.position.copy(this.position);
      }
    }
  }
}
