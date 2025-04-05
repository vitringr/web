import { Structures } from "@utilities/structures";
import { Collision } from "@utilities/collision";
import { Quadtree } from "./quadtree";
import { Renderer } from "./render";
import { Force } from "./force";
import { Input } from "./input";
import { Node } from "./node";
import Config from "./config";

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function logQuadtrees(rootQuadtree: Structures.Quadtree<any, any>) {
  let count: number = 0;
  rootQuadtree.rootRecursion(() => {
    count++;
  });
  console.log("QUADTREES: " + count);
}

function inputControl(input: Input, nodes: Node[]) {
  const position = input.position;

  const inCanvas = Collision.point_rectangle(
    position.x,
    position.y,
    0,
    0,
    Config.width,
    Config.height,
  );

  if (input.isClicked) {
    input.isClicked = false;
    inCanvas && nodes.push(new Node(input.position));
  }

  if(!inCanvas) return;


}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);
  const renderer = new Renderer(context);
  const quadtree = Quadtree.create();
  const input = new Input(canvas);
  const nodes: Node[] = [];

  Config.nodes.spawn.active   && nodes.push(...Node.spawnRandom());
  Config.nodes.connect.active && Node.connectRandom(nodes);

  const loop = () => {
    inputControl(input, nodes);

    quadtree.reset();
    Quadtree.insertNodes(quadtree, nodes);
    Quadtree.setWeights(quadtree);

    for (const node of nodes) {
      Config.force.center.active     && Force.centerPull(node);
      Config.force.attraction.active && Force.attractConnections(node);
      Config.force.repulsion.active  && Force.repulsion(node, quadtree);
      Config.force.drag.active       && Force.drag(node);
      node.move();
    }

    Config.render.background.active && renderer.background();
    Config.render.link.display      && renderer.allLinks(nodes);
    Config.render.node.display      && renderer.allNodes(nodes);
    Config.render.velocity.display  && renderer.allVelocities(nodes);
    Config.render.quadtree.display  && renderer.allQuadtrees(quadtree);

    Config.log.quadtrees && logQuadtrees(quadtree);

    requestAnimationFrame(loop);
  };

  loop();
}
