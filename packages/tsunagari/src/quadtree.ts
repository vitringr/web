import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";

export namespace Quadtree {
  export type Weight = {
    x: number;
    y: number;
    mass: number;
  };

  export const quadtree = new Structures.Quadtree<Node, Weight>(
    { x: 0, y: 0, width: Config.width, height: Config.height },
    Config.quadtree.capacity,
  );

  function setWeights() {
    quadtree.leafRecursion((qt) => {
      const sum: Weight = { x: 0, y: 0, mass: 0 };

      qt.container.forEach((item) => {
        sum.x += item.x;
        sum.y += item.y;
        sum.mass += 1;
      });

      // Add weight sums from children (if any)
      if (qt.divided) {
        [qt.northeast, qt.southeast, qt.southwest, qt.northwest].forEach(
          (child) => {
            if (child?.data) {
              sum.x += child.data.x * child.data.mass;
              sum.y += child.data.y * child.data.mass;
              sum.mass += child.data.mass;
            }
          },
        );
      }

      // Average
      sum.x = sum.mass > 0 ? sum.x / sum.mass : 0;
      sum.y = sum.mass > 0 ? sum.y / sum.mass : 0;

      qt.data = sum;
    });
  }

  export function processQuadtree(nodes: Node[]) {
    quadtree.clear();

    nodes.forEach((node) => quadtree.insert(node));

    setWeights();
  }
}
