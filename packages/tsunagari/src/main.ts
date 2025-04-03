import Config from "./config";
import { Quadtree } from "./quadtree";
import { Render } from "./render";
import { Node } from "./node";

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
      // const current = nodes[i];
      // Force.main(current, Quadtree.quadtree);
      // Force.linkAttraction(current);
      // Force.centerPull(current);
    }

    Render.drawBackground(context);
    Render.drawAllLinks(context, nodes);
    Render.drawAllNodes(context, nodes);
    Render.drawAllQuadtreeBounds(context, quadtree);

    requestAnimationFrame(loop);
  };

  loop();
}
