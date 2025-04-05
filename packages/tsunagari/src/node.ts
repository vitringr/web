import { Structures } from "@utilities/structures";
import { Random } from "@utilities/random";
import Config from "./config";

export class Node implements Structures.Shapes.IPoint {
  readonly position = Structures.Vector2.zero();
  readonly velocity = Structures.Vector2.zero();
  readonly connections = new Set<Node>();

  inQuadtree: boolean = false;

  constructor(position: Structures.Vector2) {
    this.position.copy(position);
  }

  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }

  move() {
    this.position.add(this.velocity);
  }
}

export namespace Node {
  export function spawnRandom(): Node[] {
    const nodes: Node[] = [];

    const randomPosition = Structures.Vector2.zero();

    for (let i = 0; i < Config.nodes.spawn.count; i++) {
      randomPosition.set(
        Random.range(0, Config.width),
        Random.range(0, Config.height),
      );

      nodes.push(new Node(randomPosition));
    }
    return nodes;
  }

  export function connectRandom(nodes: Node[]) {
    for (const node of nodes) {
      if (Random.chance(1 - Config.nodes.connect.chance)) continue;

      const connectionsCount = Random.rangeInt(
        Config.nodes.connect.count.min,
        Config.nodes.connect.count.max,
      );

      for (let c = 0; c < connectionsCount; c++) {
        const randomNode = nodes[Random.rangeInt(0, nodes.length - 1)];
        if (randomNode === node) continue;
        node.connections.add(randomNode);
      }
    }
  }
}
