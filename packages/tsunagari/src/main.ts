import Config from "./config";
import { Quadtree } from "./quadtree";
import { Render } from "./render";
import { Node } from "./node";
import { Force } from "./force";

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const nodes = Node.generate(Config.nodes.count);
  Node.connectRandomly(nodes);

  const quadtree = Quadtree.create();

  const loop = () => {
    quadtree.clear();
    Quadtree.insertNodes(quadtree, nodes);
    Quadtree.setWeights(quadtree);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      Force.attractConnections(node);
    }

    Render.drawBackground(context);

    if (Config.render.link.display) {
      Render.drawAllLinks(context, nodes);
    }
    if (Config.render.node.display) {
      Render.drawAllNodes(context, nodes);
    }
    if (Config.render.quadtree.display) {
      Render.drawAllQuadtreeBounds(context, quadtree);
    }

    requestAnimationFrame(loop);
  };

  loop();
}
