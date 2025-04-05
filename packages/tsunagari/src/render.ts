import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";

const nodeHalfSize = Config.render.node.size * 0.5;

export class Renderer {
  constructor(private context: CanvasRenderingContext2D) {}

  background() {
    this.context.fillStyle = Config.render.background.color;
    this.context.fillRect(0, 0, Config.width, Config.height);
  }

  private line(from: Structures.Vector2, to: Structures.Vector2) {
    this.context.beginPath();
    this.context.lineTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
  }

  connections(nodes: Node[]) {
    this.context.strokeStyle = Config.render.connection.color;
    this.context.lineWidth = Config.render.connection.width;

    const from = Structures.Vector2.zero();
    const to = Structures.Vector2.zero();

    for (const node of nodes) {
      from.copy(node.position).increase(nodeHalfSize, nodeHalfSize);

      for (const connection of node.connectionsOut) {
        to.copy(connection.position).increase(nodeHalfSize, nodeHalfSize);
        this.line(from, to);
      }
    }
  }

  targetConnections(target: Node) {
    this.context.strokeStyle = Config.render.target.connection;
    this.context.lineWidth = Config.render.connection.width;

    const from = target.position.clone().increase(nodeHalfSize, nodeHalfSize);
    const to = Structures.Vector2.zero();

    for (const connection of target.connectionsOut) {
      to.copy(connection.position).increase(nodeHalfSize, nodeHalfSize);
      this.line(from, to);
    }

    for (const connection of target.connectionsIn) {
      to.copy(connection.position).increase(nodeHalfSize, nodeHalfSize);
      this.line(from, to);
    }
  }

  velocities(nodes: Node[]) {
    this.context.strokeStyle = Config.render.velocity.color;
    this.context.lineWidth = Config.render.velocity.width;

    const origin = Structures.Vector2.zero();
    const arrow = Structures.Vector2.zero();
    const target = Structures.Vector2.zero();

    for (const node of nodes) {
      if (!node.inQuadtree) continue;

      origin.copy(node.position).increase(nodeHalfSize, nodeHalfSize);
      arrow.copy(node.velocity).scale(Config.render.velocity.scalar);
      target.copy(origin).add(arrow);
      this.line(origin, target);
    }
  }

  nodes(nodes: Node[]) {
    this.context.fillStyle = Config.render.node.color;

    let count: number = 0;

    for (const node of nodes) {
      if (!node.inQuadtree) continue;

      const position = node.position;
      this.context.fillRect(
        position.x,
        position.y,
        Config.render.node.size,
        Config.render.node.size,
      );

      count++;
    }

    Config.log.displayedNodes && console.log(count);
  }

  targetNode(target: Node) {
    this.context.fillStyle = Config.render.target.node;

    this.context.fillRect(
      target.position.x,
      target.position.y,
      Config.render.node.size,
      Config.render.node.size,
    );
  }

  targetConnectedNodes(target: Node) {
    this.context.fillStyle = Config.render.target.connected;

    for (const connection of target.connectionsOut) {
      this.context.fillRect(
        connection.x,
        connection.y,
        Config.render.node.size,
        Config.render.node.size,
      );
    }

    for (const connection of target.connectionsIn) {
      this.context.fillRect(
        connection.x,
        connection.y,
        Config.render.node.size,
        Config.render.node.size,
      );
    }
  }

  quadtrees(quadtree: Structures.Quadtree<any, any>) {
    this.context.strokeStyle = Config.render.quadtree.color;
    this.context.lineWidth = Config.render.quadtree.width;
    quadtree.rootRecursion((quadtree) => {
      const r = quadtree.rectangle;
      this.context.strokeRect(r.x, r.y, r.w, r.h);
    });
  }
}
