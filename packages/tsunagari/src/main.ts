import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";
import { Render } from "./render";

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const nodes = Node.create(
    Config.nodes.count,
    { from: 0, to: Config.width },
    { from: 0, to: Config.height },
  );

  Node.connectRandomly(nodes);

  const quadtree = new Structures.Quadtree<Node>(
    { x: 0, y: 0, width: Config.width, height: Config.height },
    Config.quadtree.capacity,
  );

  const loop = () => {
    Node.addRandomVelocities(nodes);

    quadtree.clear();
    for (let i = 0; i < nodes.length; i++) {
      quadtree.insert(nodes[i]);
    }

    Render.frame(context, nodes, quadtree);

    requestAnimationFrame(loop);
  };

  loop();
}
