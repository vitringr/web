import Config from "./config";
import { Renderer } from "./render";
import { Quadtree } from "./quadtree";
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

function inputControl(input: Input, nodes: Node[], probe: Node) {
  const position = input.position;

  // probe.position.set(position);

  if (input.isClicked) {
    input.isClicked = false;
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
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const renderer = new Renderer(context);

  const input = new Input(canvas);

  const probe = new Node(50, 50);

  const nodes: Node[] = [];
  // nodes.push(...Node.spawnMany(Config.nodes.count));
  // Node.connectRandomly(nodes);

  const quadtree = Quadtree.create();

  const loop = () => {
    inputControl(input, nodes, probe);

    quadtree.clear();
    Quadtree.insertNodes(quadtree, nodes);
    Quadtree.setWeights(quadtree);

    // for (let i = 0; i < nodes.length; i++) {
    //   const node = nodes[i];
    //   Config.force.center.active && Force.centerPull(node);
    //   Config.force.attraction.active && Force.attractConnections(node);
    //   Config.force.repulsion.active && Force.repulsion(node, quadtree);
    // }

    Force.centerPull(probe);
    probe.move();

    // Force.attractConnections(probe);
    // Force.repulsion(probe, quadtree);

    renderer.background();

    renderer.velocity(probe);

    Config.render.probe.display && renderer.probe(probe);
    Config.render.link.display && renderer.allLinks(nodes);
    Config.render.node.display && renderer.allNodes(nodes);
    Config.render.quadtree.display && renderer.allQuadtrees(quadtree);

    requestAnimationFrame(loop);
  };

  loop();
}
