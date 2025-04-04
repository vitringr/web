import Config from "./config";
import { Quadtree } from "./quadtree";
import { Render } from "./render";
import { Node } from "./node";
import { Force } from "./force";
import { Input } from "./input";

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const input = new Input();
  input.setup(canvas);

  const probe = new Node(100, 100);

  const nodes: Node[] = [probe];

  Node.connectRandomly(nodes);

  const quadtree = Quadtree.create();

  const loop = () => {
    quadtree.clear();
    Quadtree.insertNodes(quadtree, nodes);
    Quadtree.setWeights(quadtree);

    if (input.isClicked) {
      input.isClicked = false;
      const position = input.position;
      if (
        position.x < 0 ||
        position.x > Config.width ||
        position.y < 0 ||
        position.y > Config.height
      ) {
        console.log("Out of bounds");
      } else {
        console.log(`Spawn at: ${input.position}`);
        nodes.push(Node.spawnAt(input.position));
      }
    }

    for (let i = 1; i < nodes.length; i++) {
      const node = nodes[i];
      Config.force.center.active && Force.centerPull(node);
      Config.force.attraction.active && Force.attractConnections(node);
      Config.force.repulsion.active && Force.repulsion(node, quadtree);
    }

    Render.drawBackground(context);

    Config.render.probe.display && Render.drawProbe(context, probe);
    Config.render.link.display && Render.drawAllLinks(context, nodes);
    Config.render.node.display && Render.drawAllNodes(context, nodes);
    Config.render.quadtree.display &&
      Render.drawAllQuadtreeBounds(context, quadtree);

    requestAnimationFrame(loop);
  };

  loop();
}
