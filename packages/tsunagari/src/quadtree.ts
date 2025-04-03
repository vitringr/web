import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";

export namespace Quadtree {
  export type Weight = {
    x: number;
    y: number;
    mass: number;
  };

  export function create() {
    return new Structures.Quadtree<Node, Weight>(
      { x: 0, y: 0, w: Config.width, h: Config.height },
      Config.quadtree.capacity,
    );
  }

  export function insertNodes(
    quadtree: Structures.Quadtree<Node, any>,
    nodes: Node[],
  ) {
    nodes.forEach((node) => quadtree.insert(node));
  }

  export function setWeights(quadtree: Structures.Quadtree<Node, Weight>) {
    quadtree.leafRecursion((qt) => {
      const sum: Weight = { x: 0, y: 0, mass: 0 };

      qt.container.forEach((item) => {
        sum.x += item.x;
        sum.y += item.y;
        sum.mass += 1;
      });

      if (qt.divided) {
        qt.children.forEach((child) => {
          if (child?.data) {
            sum.x += child.data.x * child.data.mass;
            sum.y += child.data.y * child.data.mass;
            sum.mass += child.data.mass;
          }
        });
      }

      sum.x = sum.mass > 0 ? sum.x / sum.mass : 0;
      sum.y = sum.mass > 0 ? sum.y / sum.mass : 0;

      qt.data = sum;
    });
  }
}
