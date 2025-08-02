import { Mathematics } from "@utilities/mathematics";

import { Config } from "./config";
import { Node } from "./node";

export class Renderer {
  constructor(private context: CanvasRenderingContext2D) {}

  background() {
    this.context.fillStyle = Config.render.background.color;
    this.context.fillRect(0, 0, Config.width, Config.height);
  }

  private line(from: Vector2, to: Vector2) {
    this.context.beginPath();
    this.context.lineTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
  }

  private circle(at: Vector2, radius: number) {
    this.context.beginPath();
    this.context.arc(at.x, at.y, radius, 0, Mathematics.TAU);
    this.context.fill();
  }

  connections(nodes: Node[]) {
    this.context.strokeStyle = Config.render.connection.color;
    this.context.lineWidth = Config.render.connection.width;

    for (const node of nodes) {
      for (const connection of node.connectionsOut) {
        this.line(node.position, connection.position);
      }
    }
  }

  targetConnections(target: Node) {
    this.context.strokeStyle = Config.render.target.connection;
    this.context.lineWidth = Config.render.connection.width;

    for (const connection of target.connectionsOut) {
      this.line(target.position, connection.position);
    }

    for (const connection of target.connectionsIn) {
      this.line(target.position, connection.position);
    }
  }

  velocities(nodes: Node[]) {
    this.context.strokeStyle = Config.render.velocity.color;
    this.context.lineWidth = Config.render.velocity.width;

    const arrow = Vector2.Create.zero();
    const target = Vector2.Create.zero();

    for (const node of nodes) {
      if (!node.inQuadtree) continue;

      arrow.copy(node.velocity).scale(Config.render.velocity.scalar);
      target.copy(node.position).add(arrow);
      this.line(node.position, target);
    }
  }

  nodes(nodes: Node[]) {
    this.context.fillStyle = Config.render.node.color;

    let count: number = 0;

    for (const node of nodes) {
      if (!node.inQuadtree) continue;

      this.circle(node.position, Config.render.node.radius);
      count++;
    }

    Config.log.displayedNodes && console.log(count);
  }

  targetNode(target: Node) {
    this.context.fillStyle = Config.render.target.node;
    this.circle(target.position, Config.render.node.radius);
  }

  targetConnectedNodes(target: Node) {
    this.context.fillStyle = Config.render.target.connected;

    for (const connection of target.connectionsOut) {
      this.circle(connection.position, Config.render.node.radius);
    }

    for (const connection of target.connectionsIn) {
      this.circle(connection.position, Config.render.node.radius);
    }
  }

  quadtrees(quadtree: Quadtree<any, any>) {
    this.context.strokeStyle = Config.render.quadtree.color;
    this.context.lineWidth = Config.render.quadtree.width;
    quadtree.rootRecursion((quadtree) => {
      const r = quadtree.rectangle;
      this.context.strokeRect(r.x, r.y, r.w, r.h);
    });
  }
}
