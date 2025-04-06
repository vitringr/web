import { Structures } from "@utilities/structures";
import { Random } from "@utilities/random";
import Config from "./config";

const MAX_VELOCITY_MAGNITUDE_SQUARED = Config.force.maxVelocity ** 2;

export class Node implements Structures.Shapes.IPoint {
  readonly id: number;

  readonly position = Structures.Vector2.zero();
  readonly velocity = Structures.Vector2.zero();
  readonly connectionsOut = new Set<Node>();
  readonly connectionsIn = new Set<Node>();

  inQuadtree: boolean = false;

  constructor(id: number, position: Structures.Vector2) {
    this.id = id;
    this.position.copy(position);
  }

  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }

  private limitVelocity() {
    if (this.velocity.magnitudeSquared() > MAX_VELOCITY_MAGNITUDE_SQUARED) {
      this.velocity.normalize().scale(Config.force.maxVelocity);
    }
  }

  move() {
    this.limitVelocity();
    this.position.add(this.velocity);
  }

  connect(node: Node) {
    this.connectionsOut.add(node);
    node.connectionsIn.add(this);
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

      nodes.push(new Node(i, randomPosition));
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
        node.connect(randomNode);
      }
    }
  }
}
