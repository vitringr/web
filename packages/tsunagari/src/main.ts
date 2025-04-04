import Config from "./config";
import { Collision } from "@utilities/collision";
import { Renderer } from "./render";
import { Quadtree } from "./quadtree";
import { Node } from "./node";
import { Force } from "./force";
import { Input } from "./input";
import { Logger } from "./logger";

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function inputControl(input: Input, nodes: Node[], probe: Node) {
  const position = input.position;

  probe.position.set(position);

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
  const quadtree = Quadtree.create();
  const input = new Input(canvas);
  const probe = new Node(50, 50);
  const nodes: Node[] = [];

  Config.nodes.spawn.active   && nodes.push(...Node.spawnMany());
  Config.nodes.connect.active && Node.connectRandomly(nodes);

  const loop = () => {
    inputControl(input, nodes, probe);

    // QUADTREE

    quadtree.clear();
    Quadtree.insertNodes(quadtree, nodes);
    Quadtree.setWeights(quadtree);

    // PROBE

    Config.probe.force.center    && Force.centerPull(probe);
    Config.probe.force.attract   && Force.attractConnections(probe);
    Config.probe.force.repulsion && Force.repulsion(probe, quadtree);
    probe.move();

    Config.probe.render.display  && renderer.probe(probe);
    Config.probe.render.velocity && renderer.velocity(probe);

    // FORCE

    nodes.forEach((node) => {
      Config.force.center.active     && Force.centerPull(node);
      Config.force.attraction.active && Force.attractConnections(node);
      Config.force.repulsion.active  && Force.repulsion(node, quadtree);
      Config.force.drag.active       && Force.drag(node);
      node.move();
    });

    // RENDER

    Config.render.background.active && renderer.background();
    Config.render.link.display      && renderer.allLinks(nodes);
    Config.render.node.display      && renderer.allNodes(nodes);
    Config.render.velocity.display  && renderer.allVelocities(nodes);
    Config.render.quadtree.display  && renderer.allQuadtrees(quadtree);

    // MISC

    Config.logger.quadtrees && Logger.quadtrees(quadtree);

    // PROBE

    requestAnimationFrame(loop);
  };

  loop();
}
