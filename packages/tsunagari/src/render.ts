import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";
import { Quadtree } from "./quadtree";

export namespace Render {
  function drawBackground(context: CanvasRenderingContext2D) {
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

  function drawAllLinks(context: CanvasRenderingContext2D, nodes: Node[]) {
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

  function drawAllNodes(context: CanvasRenderingContext2D, nodes: Node[]) {
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

  function drawQuadtreeBounds(
    context: CanvasRenderingContext2D,
    quadtree: Structures.Quadtree<any, any>,
  ) {
    const bounds = quadtree.rectangle;
    context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  }

  function drawFirstLevelQuadtreeWeight(
    context: CanvasRenderingContext2D,
    quadtree: Structures.Quadtree<any, Quadtree.Weight>,
  ) {
    context.fillStyle = "#FF000060";

    const ne = quadtree.northeast?.data;
    if (ne) context.fillRect(ne.x, ne.y, ne.mass * 0.5, ne.mass * 0.5);

    const se = quadtree.southeast?.data;
    if (se) context.fillRect(se.x, se.y, se.mass * 0.5, se.mass * 0.5);

    const sw = quadtree.southwest?.data;
    if (sw) context.fillRect(sw.x, sw.y, sw.mass * 0.5, sw.mass * 0.5);

    const nw = quadtree.northwest?.data;
    if (nw) context.fillRect(nw.x, nw.y, nw.mass * 0.5, nw.mass * 0.5);
  }

  export function frame(
    context: CanvasRenderingContext2D,
    nodes: Node[],
    quadtree: Structures.Quadtree<any, any>,
  ) {
    drawBackground(context);

    context.strokeStyle = Config.render.quadtree.color;
    context.lineWidth = Config.render.quadtree.width;
    quadtree.rootRecursion((quadtree) => {
      drawQuadtreeBounds(context, quadtree);
    });

    drawFirstLevelQuadtreeWeight(context, quadtree);

    drawAllLinks(context, nodes);

    drawAllNodes(context, nodes);
  }
}
