import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";

export namespace Render {
  const nodeHalfSize = Config.render.nodeSize * 0.5;

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
    context.strokeStyle = Config.render.linkColor;
    context.lineWidth = Config.render.linkWidth;

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
      Config.render.nodeSize,
      Config.render.nodeSize,
    );
  }

  function drawAllNodes(context: CanvasRenderingContext2D, nodes: Node[]) {
    context.fillStyle = Config.render.nodeColor;
    for (let i = 0; i < nodes.length; i++) {
      drawNode(context, nodes[i]);
    }
  }

  export function frame(context: CanvasRenderingContext2D, nodes: Node[]) {
    drawBackground(context);
    drawAllLinks(context, nodes);
    drawAllNodes(context, nodes);
  }
}
