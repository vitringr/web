import { Config } from "./config";
import { Field } from "./quadtree";
import { Node } from "./node";
import { Quadtree, Vector2 } from "@utilities/data-structures";

const EPSILON: number = 1e-10;
const CENTER = new Vector2(Config.width, Config.height).scale(0.5);

export namespace Force {
  export function centerPull(node: Node) {
    const velocity = Vector2.subtract(CENTER, node.position).scale(
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
        Vector2.distance(link.position, node.position),
        EPSILON,
      );

      const difference = Vector2.subtract(
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
    from: Vector2,
    to: Vector2,
  ): Vector2 {
    const difference = Vector2.subtract(from, to);

    const safeMagnitude = Math.max(difference.magnitude(), EPSILON);
    const inverseMagnitude = 1 / safeMagnitude;

    const normalized = difference.scale(inverseMagnitude);
    const velocity = normalized.scale(inverseMagnitude);

    return velocity;
  }

  export function repulsion(
    node: Node,
    quadtree: Quadtree<Node, Field.Weight>,
  ) {
    const weight = quadtree.data;
    if (!weight || weight.mass <= 0) return;

    const centerOfMass = new Vector2(weight.x, weight.y);

    const distanceSquared = Math.max(
      Vector2.distanceSquared(node.position, centerOfMass),
      EPSILON,
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
