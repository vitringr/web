import { Structures } from "@utilities/structures";
import Config from "./config";
import { Quadtree } from "./quadtree";
import { Node } from "./node";

export namespace Force {
  export function linkAttraction(
    node: Node,
    springConstant: number = 0,
    idealLength: number = 0,
  ) {
    for (const linkedNode of node.links) {
      const direction = linkedNode.getPosition().subtract(node.getPosition());
      const distance = direction.length();

      // Hooke's Law: F = k * (distance - idealLength)
      const forceMagnitude = springConstant * (distance - idealLength);

      node.move(direction.normalize().scale(forceMagnitude));

      console.log("direction: " + direction)
    }
  }

  export function centerPull(node: Node) {
    const canvasCenter = new Structures.Vector2(
      Config.width / 2,
      Config.height / 2,
    );

    const direction = canvasCenter.subtract(node.getPosition());
    const distance = direction.length();

    // Scale force based on distance (so it's stronger at edges)
    const maxDistance = Math.sqrt(Config.width ** 2 + Config.height ** 2) / 2;
    const normalizedDistance = distance / maxDistance;

    // Gentle force that increases with distance
    const force = 1 * normalizedDistance;

    node.move(direction.normalize().scale(force));
  }

  export function main(
    node: Node,
    quadtree: Structures.Quadtree<Node, Quadtree.Weight>,
    repulsionScale: number = 100, // New scaling factor
  ) {
    const qtData = quadtree.data;
    if (!qtData || qtData.mass === 0) return;

    const qtCenterOfMass = new Structures.Vector2(qtData.x, qtData.y);
    const nodePos = node.getPosition();
    let distance = Structures.Vector2.distance(nodePos, qtCenterOfMass);

    // Skip if too close to avoid extreme forces
    if (distance < 1) distance = 1;

    const theta = quadtree.bounds.width / distance;
    const isLongRange = theta < 1;

    if (isLongRange) {
      // Calculate REPULSION direction (opposite of current calculation)
      const direction = new Structures.Vector2(
        nodePos.x - qtCenterOfMass.x,
        nodePos.y - qtCenterOfMass.y,
      ).normalize();

      // Enhanced force calculation with better scaling
      const force = (qtData.mass) / (distance * distance) * repulsionScale;

      node.move(direction.scale(force));
    } else if (quadtree.divided) {
      // Recurse into subtrees
      quadtree.northeast && main(node, quadtree.northeast, repulsionScale);
      quadtree.southeast && main(node, quadtree.southeast, repulsionScale);
      quadtree.southwest && main(node, quadtree.southwest, repulsionScale);
      quadtree.northwest && main(node, quadtree.northwest, repulsionScale);
    }
  }
}
