import { Structures } from "@utilities/structures";
import { Random } from "@utilities/random";
import Config from "./config";

export class Node implements Structures.Shapes.IPoint {
  readonly velocity: Structures.Vector2 = Structures.Vector2.zero();
  readonly connections = new Set<Node>();

  inQuadtree: boolean = false;

  constructor(readonly position: Structures.Vector2) {}

  get x() { return this.position.x; }
  get y() { return this.position.y; }

  move() {
    this.position.add(this.velocity);
  }
}

export namespace Node {
  export function spawnRandom(): Node {
    return new Node(
      new Structures.Vector2(
        Random.range(0, Config.width),
        Random.range(0, Config.height),
      ),
    );
  }

  export function spawnMany(): Node[] {
    const nodes: Node[] = [];
    for (let i = 0; i < Config.nodes.spawn.count; i++) {
      nodes.push(spawnRandom());
    }
    return nodes;
  }

  export function connectRandomly(nodes: Node[]) {
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

  export function addRandomVelocities(nodes: Node[]) {
    const randomVelocity = Structures.Vector2.zero();

    for (const node of nodes) {
      randomVelocity.x = Random.range(-1, 1);
      randomVelocity.y = Random.range(-1, 1);
      node.velocity.add(randomVelocity);
    }
  }
}
