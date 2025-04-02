import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";

Structures.Vector2;

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

  function drawNode(context: CanvasRenderingContext2D, node: Node) {
    context.fillRect(
      node.x,
      node.y,
      Config.render.nodeSize,
      Config.render.nodeSize,
    );
  }

  export function main(context: CanvasRenderingContext2D, nodes: Node[]) {
    drawBackground(context);

    context.strokeStyle = Config.render.linkColor;
    context.lineWidth = Config.render.linkWidth;

    context.fillStyle = Config.render.nodeColor;

    const fromNodeCenter = Structures.Vector2.zero();
    const toNodeCenter = Structures.Vector2.zero();

    let linksCount = 0;

    for (let i = 0; i < nodes.length; i++) {
      const current = nodes[i];

      fromNodeCenter.x = current.x + nodeHalfSize;
      fromNodeCenter.y = current.y + nodeHalfSize;

      current.getLinks.forEach((link: Node) => {
        toNodeCenter.x = link.x + nodeHalfSize;
        toNodeCenter.y = link.y + nodeHalfSize;
        drawLink(context, fromNodeCenter, toNodeCenter);
        linksCount++;
      });
    }

    console.log(`CONNECTIONS: ${linksCount}`);

    for (let i = 0; i < nodes.length; i++) {
      const current = nodes[i];
      drawNode(context, current);
    }
  }
}
