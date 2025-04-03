import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";

export namespace Force {
  export function attractConnections(node: Node) {
    const connections = node.connections;
    if (connections.size <= 0) return;

    connections.forEach((link) => {
      const velocity = Structures.Vector2.subtract(
        node.getPosition(),
        link.getPosition(),
      ).scale(Config.force.attraction);

      link.addVelocity(velocity);
      node.addVelocity(velocity.scale(-1));
    });
  }
}
