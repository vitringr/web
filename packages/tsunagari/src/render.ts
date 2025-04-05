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

  allLinks(nodes: Node[]) {
    this.context.strokeStyle = Config.render.link.color;
    this.context.lineWidth = Config.render.link.width;

    const from = Structures.Vector2.zero();
    const to = Structures.Vector2.zero();

    for (const node of nodes) {
      from.copy(node.position).increase(nodeHalfSize, nodeHalfSize);

      for (const link of node.connections) {
        to.copy(link.position).increase(nodeHalfSize, nodeHalfSize);
        this.line(from, to);
      }
    }
  }

  targetLinks(node: Node) {
    this.context.strokeStyle = Config.render.link.targetColor;
    this.context.lineWidth = Config.render.link.width;

    const from = node.position.clone().increase(nodeHalfSize, nodeHalfSize);
    const to = Structures.Vector2.zero();

    for (const link of node.connections) {
      to.copy(link.position).increase(nodeHalfSize, nodeHalfSize);
      this.line(from, to);
    }
  }

  allVelocities(nodes: Node[]) {
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

  allNodes(nodes: Node[]) {
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

  targetNode(node: Node) {
    this.context.fillStyle = Config.render.node.targetColor;
    this.context.fillRect(
      node.position.x,
      node.position.y,
      Config.render.node.size,
      Config.render.node.size,
    );
  }

  private quadtree(quadtree: Structures.Quadtree<any, any>) {
    const r = quadtree.rectangle;
    this.context.strokeRect(r.x, r.y, r.w, r.h);
  }

  allQuadtrees(quadtree: Structures.Quadtree<any, any>) {
    this.context.strokeStyle = Config.render.quadtree.color;
    this.context.lineWidth = Config.render.quadtree.width;
    quadtree.rootRecursion((quadtree) => {
      this.quadtree(quadtree);
    });
  }
}
