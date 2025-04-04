import { Structures } from "@utilities/structures";
import { Random } from "@utilities/random";
import Config from "./config";

export class Node implements Structures.Shapes.IPoint {
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
  export function spawnAt(position: Structures.Vector2): Node {
    return new Node(position.x, position.y);
  }

  export function spawnRandom(): Node {
    return new Node(
      Random.range(0, Config.width),
      Random.range(0, Config.height),
    );
  }

  export function spawnMany(count: number): Node[] {
    const nodes: Node[] = [];
    for (let i = 0; i < count; i++) {
      nodes.push(spawnRandom());
    }
    return nodes;
  }

  export function connectRandomly(nodes: Node[]) {
    for (let i = 1; i < nodes.length; i++) {
      if (Random.chance(1 - Config.nodes.randomConnections.chance)) continue;

      const node = nodes[i];

      const connectionsCount = Random.rangeInt(
        Config.nodes.randomConnections.count.min,
        Config.nodes.randomConnections.count.max,
      );

      for (let c = 0; c < connectionsCount; c++) {
        const randomNode = nodes[Random.rangeInt(0, nodes.length - 1)];
        if (randomNode === node) continue;

        node.connect(randomNode);
      }
    }
  }

  export function addRandomVelocities(nodes: Node[]) {
    const randomVelocity = Structures.Vector2.zero();

    for (let i = 1; i < nodes.length; i++) {
      const node = nodes[i];

      randomVelocity.x = Random.range(-1, 1);
      randomVelocity.y = Random.range(-1, 1);

      node.addVelocity(randomVelocity);
    }
  }
}
