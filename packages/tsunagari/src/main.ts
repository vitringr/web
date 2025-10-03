import { Renderer } from "./render";
import { Config } from "./config";
import { Field } from "./quadtree";
import { Force } from "./force";
import { Input } from "./input";
import { Node } from "./node";
import { Quadtree } from "@utilities/data-structures";

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function logQuadtrees(rootQuadtree: Quadtree<any, any>) {
  let count: number = 0;
  rootQuadtree.rootRecursion(() => {
    count++;
  });
  console.log("QUADTREES: " + count);
}

export function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);
  const renderer = new Renderer(context);
  const quadtree = Field.create();
  const input = new Input(canvas);
  const nodes: Node[] = [];

  Config.nodes.spawn.active && nodes.push(...Node.spawnRandom());
  Config.nodes.connect.active && Node.connectRandom(nodes);

  const loop = () => {
    quadtree.reset();
    Field.insertNodes(quadtree, nodes);
    Field.setWeights(quadtree);

    for (const node of nodes) {
      Config.force.center.active && Force.centerPull(node);
      Config.force.attraction.active && Force.attractConnections(node);
      Config.force.repulsion.active && Force.repulsion(node, quadtree);
      Config.force.drag.active && Force.drag(node);
      node.move();
    }

    input.main(quadtree, nodes);

    Config.render.background.active && renderer.background();
    Config.render.connection.display && renderer.connections(nodes);
    Config.render.node.display && renderer.nodes(nodes);
    Config.render.velocity.display && renderer.velocities(nodes);
    Config.render.quadtree.display && renderer.quadtrees(quadtree);

    if (input.targetedNodeID !== null) {
      const target = nodes[input.targetedNodeID];
      renderer.targetConnections(target);
      renderer.targetConnectedNodes(target);
      renderer.targetNode(target);
    }

    Config.log.quadtrees && logQuadtrees(quadtree);

    requestAnimationFrame(loop);
  };

  loop();
}
