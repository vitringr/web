import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";
import { Quadtree } from "./quadtree";

export namespace Render {
  const nodeHalfSize = Config.render.node.size * 0.5;

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

    const fromNodeCenter = Structures.Vector2.zero();
    const toNodeCenter = Structures.Vector2.zero();

    for (let i = 0; i < nodes.length; i++) {
      const current = nodes[i];

      fromNodeCenter.x = current.x + nodeHalfSize;
      fromNodeCenter.y = current.y + nodeHalfSize;

      current.links.forEach((link: Node) => {
        toNodeCenter.x = link.x + nodeHalfSize;
        toNodeCenter.y = link.y + nodeHalfSize;
        drawLink(context, fromNodeCenter, toNodeCenter);
      });
    }
  }

  function drawNode(context: CanvasRenderingContext2D, node: Node) {
    context.fillRect(
      node.x,
      node.y,
      Config.render.node.size,
      Config.render.node.size,
    );
  }

  function drawAllNodes(context: CanvasRenderingContext2D, nodes: Node[]) {
    context.fillStyle = Config.render.node.color;
    for (let i = 0; i < nodes.length; i++) {
      drawNode(context, nodes[i]);
    }
  }

  function drawQuadtree(
    context: CanvasRenderingContext2D,
    quadtree: Structures.Quadtree<any, any>,
  ) {
    const bounds = quadtree.bounds;

    context.beginPath();
    context.lineTo(bounds.x, bounds.y);
    context.lineTo(bounds.x + bounds.width, bounds.y);
    context.lineTo(bounds.x + bounds.width, bounds.y + bounds.height);
    context.lineTo(bounds.x, bounds.y + bounds.height);
    context.lineTo(bounds.x, bounds.y);
    context.closePath();
    context.stroke();
  }

  function drawFirstLevelQuadtreeWeight(
    context: CanvasRenderingContext2D,
    quadtree: Structures.Quadtree<any, any>,
  ) {
    context.fillStyle = "#FF000060";

    const ne = quadtree.northeast?.data as Quadtree.Weight;
    if (ne) context.fillRect(ne.x, ne.y, ne.mass * 0.5, ne.mass * 0.5);

    const se = quadtree.southeast?.data as Quadtree.Weight;
    if (se) context.fillRect(se.x, se.y, se.mass * 0.5, se.mass * 0.5);

    const sw = quadtree.southwest?.data as Quadtree.Weight;
    if (sw) context.fillRect(sw.x, sw.y, sw.mass * 0.5, sw.mass * 0.5);

    const nw = quadtree.northwest?.data as Quadtree.Weight;
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
    quadtree.deepCallback((quadtree) => {
      drawQuadtree(context, quadtree);
    });

    drawFirstLevelQuadtreeWeight(context, quadtree);

    drawAllLinks(context, nodes);

    drawAllNodes(context, nodes);
  }
}
