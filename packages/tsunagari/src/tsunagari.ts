// import { Structures } from "@utilities/structures";
import Config from "./config";
import { Node } from "./node";
import { Render } from "./render";

export function main(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  // const quadtree = new Structures.Quadtree<Node>(
  //   { x: 0, y: 0, width: Config.width, height: Config.height },
  //   Config.quadtree.capacity,
  // );

  const nodes: Node[] = Node.createNodes(
    Config.nodes.count,
    { from: 0, to: Config.width },
    { from: 0, to: Config.height },
  );

  Node.connectRandomly(nodes);

  Render.main(context, nodes);
}
