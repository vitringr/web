import Config from "./config";
import { Random } from "@utilities/random";

export class Node {
  x: number;
  y: number;

  private links = new Set<Node>();

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get getLinks() {
    return this.links;
  }

  addLink(link: Node) {
    this.links.add(link);
  }
}

export namespace Node {
  export function createNodes(
    count: number,
    x: { from: number; to: number },
    y: { from: number; to: number },
  ): Node[] {
    const nodes: Node[] = [];

    for (let i = 0; i < count; i++) {
      const node = new Node(
        Random.range(x.from, x.to),
        Random.range(y.from, y.to),
      );

      nodes.push(node);
    }

    return nodes;
  }

  export function connectRandomly(nodes: Node[]) {
    for (let i = 0; i < nodes.length; i++) {
      if (Random.percent(Config.nodes.randomConnections.chance)) continue;
      const current = nodes[i];

      const connectionsCount = Random.rangeInt(
        Config.nodes.randomConnections.count.min,
        Config.nodes.randomConnections.count.max,
      );

      for (let c = 0; c < connectionsCount; c++) {
        const randomNode = nodes[Random.rangeInt(0, nodes.length - 1)];
        if (randomNode === current) continue;

        current.addLink(randomNode);
      }
    }
  }
}
