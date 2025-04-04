import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";
import { Quadtree } from "./quadtree";

// TODO: Decide between normalization vs performance.

export namespace Force {
  const center = new Structures.Vector2(Config.width, Config.height).scale(0.5);

  export function drag(node: Node) {
    node.velocity.scale(Config.force.drag.scalar);
  }

  export function attractConnections(node: Node) {
    const connections = node.connections;
    if (connections.size <= 0) return;

    connections.forEach((link) => {
      // NOTE: Can optimize sqrt().
      const distance = Structures.Vector2.distance(
        link.position,
        node.position,
      );

      const difference = Structures.Vector2.subtract(
        link.position,
        node.position,
      );

      const velocity = difference
        .normalize()
        .scale(
          Config.force.attraction.scalar *
            (distance - Config.force.attraction.idealDistance),
        );

      node.addVelocity(velocity);
      link.addVelocity(velocity.scale(-1));
    });
  }

  export function centerPull(node: Node) {
    const velocity = Structures.Vector2.subtract(center, node.position).scale(
      Config.force.center.scalar,
    );

    node.addVelocity(velocity);
  }

  export function repulsion(
    node: Node,
    quadtree: Structures.Quadtree<Node, Quadtree.Weight>,
  ) {
    const quadtreeData = quadtree.data;
    if (!quadtreeData || quadtreeData.mass <= 0) return;

    const centerOfMass = new Structures.Vector2(quadtreeData.x, quadtreeData.y);

    // TODO: probably remove sqrt().
    let distance = Structures.Vector2.distance(node.position, centerOfMass);

    const theta = quadtree.rectangle.w / distance;

    const isDistant = theta < 1;

    if (isDistant) {
      const difference = Structures.Vector2.subtract(
        node.position,
        centerOfMass,
      );

      const velocity = difference
        .normalize()
        .scale(1 / distance)
        .scale(Config.force.repulsion.scalar);

      node.addVelocity(velocity);
    } else {
      if (!quadtree.divided) return;

      quadtree.children.forEach((child) => {
        repulsion(node, child);
      });
    }
  }
}
