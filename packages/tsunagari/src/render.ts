import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";
import { Quadtree } from "./quadtree";

export namespace Render {
  export function drawBackground(context: CanvasRenderingContext2D) {
    context.fillStyle = Config.render.backgroundColor;
    context.fillRect(0, 0, Config.width, Config.height);
  }

  function drawLink(
    context: CanvasRenderingContext2D,
    from: Structures.Vector2,
    to: Structures.Vector2,
  ) {
    context.beginPath();
    context.lineTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.closePath();
    context.stroke();
  }

  export function drawAllLinks(
    context: CanvasRenderingContext2D,
    nodes: Node[],
  ) {
    context.strokeStyle = Config.render.link.color;
    context.lineWidth = Config.render.link.width;

    const aCenter = Structures.Vector2.zero();
    const bCenter = Structures.Vector2.zero();

    const nodeHalfSize = Config.render.node.size * 0.5;

    for (let i = 0; i < nodes.length; i++) {
      const current = nodes[i];

      aCenter.x = current.x + nodeHalfSize;
      aCenter.y = current.y + nodeHalfSize;

      current.connections.forEach((link: Node) => {
        bCenter.x = link.x + nodeHalfSize;
        bCenter.y = link.y + nodeHalfSize;
        drawLink(context, aCenter, bCenter);
      });
    }
  }

  export function drawAllNodes(
    context: CanvasRenderingContext2D,
    nodes: Node[],
  ) {
    context.fillStyle = Config.render.node.color;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      context.fillRect(
        node.x,
        node.y,
        Config.render.node.size,
        Config.render.node.size,
      );
    }
  }

  export function drawFirstLevelQuadtreeWeight(
    context: CanvasRenderingContext2D,
    quadtree: Structures.Quadtree<any, Quadtree.Weight>,
  ) {
    context.fillStyle = "#FF000060";

    for (let i = 0; i < quadtree.children.length; i++) {
      const data = quadtree.children[i].data;
      if (!data) continue;

      context.fillRect(data.x, data.y, data.mass * 0.5, data.mass * 0.5);
    }
  }

  function drawQuadtreeBounds(
    context: CanvasRenderingContext2D,
    quadtree: Structures.Quadtree<any, any>,
  ) {
    const r = quadtree.rectangle;
    context.strokeRect(r.x, r.y, r.w, r.h);
  }

  export function drawAllQuadtreeBounds(
    context: CanvasRenderingContext2D,
    quadtree: Structures.Quadtree<any, Quadtree.Weight>,
  ) {
    context.strokeStyle = Config.render.quadtree.color;
    context.lineWidth = Config.render.quadtree.width;
    quadtree.rootRecursion((quadtree) => {
      drawQuadtreeBounds(context, quadtree);
    });
  }
}
