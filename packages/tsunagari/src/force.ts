import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";
import { Quadtree } from "./quadtree";

export namespace Force {
  const epsilon: number = 1e-10;
  const center = new Structures.Vector2(Config.width, Config.height).scale(0.5);

  export function centerPull(node: Node) {
    const velocity = Structures.Vector2.subtract(center, node.position).scale(
      Config.force.center.scalar,
    );

    node.velocity.add(velocity);
  }

  export function drag(node: Node) {
    node.velocity.scale(Config.force.drag.scalar);
  }

  export function attractConnections(node: Node) {
    const connections = node.connectionsOut;
    if (connections.size <= 0) return;

    for (const link of connections) {
      const distance = Math.max(
        Structures.Vector2.distance(link.position, node.position),
        epsilon,
      );

      const difference = Structures.Vector2.subtract(
        link.position,
        node.position,
      );

      const hooke = distance - Config.force.attraction.idealDistance;
      const velocity = difference.scale(hooke * Config.force.attraction.scalar);

      node.velocity.add(velocity);
      link.velocity.add(velocity.scale(-1));
    }
  }

  function distanceBasedVelocity(
    from: Structures.Vector2,
    to: Structures.Vector2,
  ): Structures.Vector2 {
    const difference = Structures.Vector2.subtract(from, to);

    const safeMagnitude = Math.max(difference.magnitude(), epsilon);
    const inverseMagnitude = 1 / safeMagnitude;

    const normalized = difference.scale(inverseMagnitude);
    const velocity = normalized.scale(inverseMagnitude);

    return velocity;
  }

  export function repulsion(
    node: Node,
    quadtree: Structures.Quadtree<Node, Quadtree.Weight>,
  ) {
    const weight = quadtree.data;
    if (!weight || weight.mass <= 0) return;

    const centerOfMass = new Structures.Vector2(weight.x, weight.y);

    const distanceSquared = Math.max(
      Structures.Vector2.distanceSquared(node.position, centerOfMass),
      epsilon,
    );

    const theta = quadtree.rectangle.w ** 2 / distanceSquared;
    const isFar = theta < 1;

    if (isFar) {
      const velocity = distanceBasedVelocity(node.position, centerOfMass)
        .scale(weight.mass)
        .scale(Config.force.repulsion.scalar);

      node.velocity.add(velocity);

      return;
    }

    if (quadtree.divided) {
      for (const child of quadtree.children) {
        repulsion(node, child);
      }
      return;
    }

    for (const item of quadtree.container) {
      const velocity = distanceBasedVelocity(
        node.position,
        item.position,
      ).scale(Config.force.repulsion.scalar);

      node.velocity.add(velocity);
    }
  }
}
