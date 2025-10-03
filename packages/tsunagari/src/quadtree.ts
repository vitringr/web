import { Quadtree } from "@utilities/data-structures";
import { Config } from "./config";
import { Node } from "./node";

export namespace Field {
  export type Weight = {
    x: number;
    y: number;
    mass: number;
  };

  export function create() {
    return new Quadtree<Node, Weight>(
      { x: 0, y: 0, w: Config.width, h: Config.height },
      Config.quadtree.capacity,
    );
  }

  export function insertNodes(
    quadtree: Quadtree<Node, any>,
    nodes: Node[],
  ) {
    for (const node of nodes) {
      const isInserted = quadtree.insert(node);
      node.inQuadtree = isInserted;
    }
  }

  export function setWeights(quadtree: Quadtree<Node, Weight>) {
    quadtree.leafRecursion((qt) => {
      const sum: Weight = { x: 0, y: 0, mass: 0 };

      for (const node of qt.container) {
        sum.x += node.x;
        sum.y += node.y;
        sum.mass += 1;
      }

      if (qt.divided) {
        for (const child of qt.children) {
          if (!child.data) continue;
          sum.x += child.data.x * child.data.mass;
          sum.y += child.data.y * child.data.mass;
          sum.mass += child.data.mass;
        }
      }

      sum.x = sum.mass > 0 ? sum.x / sum.mass : 0;
      sum.y = sum.mass > 0 ? sum.y / sum.mass : 0;

      qt.data = sum;
    });
  }
}
