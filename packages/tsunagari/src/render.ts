import { Mathematics } from "@utilities/mathematics";
import { Structures } from "@utilities/structures";
import Config from "./config";
import { Quadtree } from "./quadtree";
import { Node } from "./node";

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

    const aCenter = Structures.Vector2.zero();
    const bCenter = Structures.Vector2.zero();

    const nodeHalfSize = Config.render.node.size * 0.5;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      aCenter.x = node.x + nodeHalfSize;
      aCenter.y = node.y + nodeHalfSize;

      for (const link of node.connections) {
        bCenter.x = link.x + nodeHalfSize;
        bCenter.y = link.y + nodeHalfSize;
        this.line(aCenter, bCenter);
      }
    }
  }

  private circle(x: number, y: number, r: number) {
    this.context.beginPath();
    this.context.arc(x, y, r, 0, Mathematics.TAU);
    this.context.fill();
  }

  velocity(node: Node) {
    this.context.strokeStyle = Config.render.velocity.color;
    this.context.lineWidth = Config.render.velocity.width;

    const arrow = node.velocity.clone().scale(Config.render.velocity.scalar);
    const target = node.position.clone().add(arrow);

    this.line(node.position, target);
  }

  allVelocities(nodes: Node[]) {
    this.context.strokeStyle = Config.render.velocity.color;
    this.context.lineWidth = Config.render.velocity.width;

    const arrow = Structures.Vector2.zero();
    const target = Structures.Vector2.zero();

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node.inQuadtree) continue;

      arrow.scale(0).add(node.velocity).scale(Config.render.velocity.scalar);
      target.scale(0).add(node.position).add(arrow);
      this.line(node.position, target);
    }
  }

  probe(probe: Node) {
    this.context.fillStyle = Config.probe.render.color;
    this.circle(probe.x, probe.y, Config.probe.render.size);
  }

  allNodes(nodes: Node[]) {
    this.context.fillStyle = Config.render.node.color;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node.inQuadtree) continue;

      const position = node.position;
      this.context.fillRect(
        position.x,
        position.y,
        Config.render.node.size,
        Config.render.node.size,
      );
    }
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

  qtWeight(quadtree: Structures.Quadtree<any, Quadtree.Weight>) {
    const data = quadtree.data;

    if (data && data.mass > 0) {
      this.context.fillStyle = "#FF0000";
      this.circle(data.x, data.y, data.mass);
    }
  }
}
