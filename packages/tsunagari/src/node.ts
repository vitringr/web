import { Structures } from "@utilities/structures";
import { Random } from "@utilities/random";
import Config from "./config";

export class Node {
  readonly connections = new Set<Node>();

  private position: Structures.Vector2;

  constructor(x: number, y: number) {
    this.position = new Structures.Vector2(x, y);
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  getPosition() {
    return this.position;
  }

  addVelocity(velocity: Structures.Vector2) {
    this.position.add(velocity);
  }

  connect(node: Node) {
    this.connections.add(node);
  }
}

export namespace Node {
  export function create(
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

        current.connect(randomNode);
      }
    }
  }

  export function addRandomVelocities(nodes: Node[]) {
    const randomVelocity = Structures.Vector2.zero();

    for (let i = 0; i < nodes.length; i++) {
      const current = nodes[i];

      randomVelocity.x = Random.range(-1, 1);
      randomVelocity.y = Random.range(-1, 1);

      current.addVelocity(randomVelocity);
    }
  }
}
