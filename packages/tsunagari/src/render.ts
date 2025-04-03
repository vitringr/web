import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";

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
    quadtree: Structures.Quadtree<any>,
  ) {
    context.strokeStyle = Config.render.quadtree.color;
    context.lineWidth = Config.render.quadtree.width;

    const bounds = quadtree.getBounds;

    context.beginPath();
    context.lineTo(bounds.x, bounds.y);
    context.lineTo(bounds.x + bounds.width, bounds.y);
    context.lineTo(bounds.x + bounds.width, bounds.y + bounds.height);
    context.lineTo(bounds.x, bounds.y + bounds.height);
    context.lineTo(bounds.x, bounds.y);
    context.closePath();
    context.stroke();
  }

  export function frame(
    context: CanvasRenderingContext2D,
    nodes: Node[],
    quadtree: Structures.Quadtree<any>,
  ) {
    drawBackground(context);
    quadtree.deepCallback((quadtree) => {
      drawQuadtree(context, quadtree);
    });
    drawAllLinks(context, nodes);
    drawAllNodes(context, nodes);
  }
}
