interface IPoint {
  x: number;
  y: number;
}

interface IRectangle {
  x: number;
  y: number;
  w: number;
  h: number;
}

const SUBDIVISIONS = 4;

export class Quadtree<Item extends IPoint, Data> {
  readonly rectangle: IRectangle;
  readonly capacity: number;

  container: Item[] = [];
  data?: Data;

  divided: boolean = false;
  children: Quadtree<Item, Data>[] = [];
  parent?: Quadtree<Item, Data>;
  depth: number = 0;

  constructor(rectangle: IRectangle, capacity: number = 4) {
    this.rectangle = rectangle;
    this.capacity = capacity;
  }

  get northeast() {
    return this.children[0];
  }
  get southeast() {
    return this.children[1];
  }
  get southwest() {
    return this.children[2];
  }
  get northwest() {
    return this.children[3];
  }

  insert(item: Item): boolean {
    if (!this.isPointInRectangle(item, this.rectangle)) {
      return false;
    }

    if (!this.divided) {
      if (this.container.length < this.capacity) {
        this.container.push(item);
        return true;
      }

      this.subdivide();
    }

    return (
      this.children[0].insert(item) ||
      this.children[1].insert(item) ||
      this.children[2].insert(item) ||
      this.children[3].insert(item)
    );
  }

  query(range: IRectangle, found: Item[] = []): Item[] {
    if (!this.intersects(range)) {
      return found;
    }

    for (let i = 0; i < this.container.length; i++) {
      const item = this.container[i];
      if (this.isPointInRectangle(item, range)) {
        found.push(item);
      }
    }

    if (this.divided) {
      for (let i = 0; i < SUBDIVISIONS; i++) {
        this.children[i]!.query(range, found);
      }
    }

    return found;
  }

  rootRecursion(callback: (quadtree: Quadtree<Item, Data>) => void) {
    callback(this);

    if (this.divided) {
      for (let i = 0; i < SUBDIVISIONS; i++) {
        this.children[i]?.rootRecursion(callback);
      }
    }
  }

  leafRecursion(callback: (quadtree: Quadtree<Item, Data>) => void) {
    if (this.divided) {
      for (let i = 0; i < SUBDIVISIONS; i++) {
        this.children[i]?.leafRecursion(callback);
      }
    }

    callback(this);
  }

  reset(): void {
    this.container = [];
    this.data = undefined;
    this.divided = false;
    this.children = [];
    this.parent = undefined;
    this.depth = 0;
  }

  private subdivide(): void {
    this.divided = true;

    const x = this.rectangle.x;
    const y = this.rectangle.y;
    const w = this.rectangle.w * 0.5;
    const h = this.rectangle.h * 0.5;

    this.children[0] = new Quadtree(
      { x: x + w, y: y, w: w, h: h },
      this.capacity,
    );
    this.children[1] = new Quadtree(
      { x: x + w, y: y + h, w: w, h: h },
      this.capacity,
    );
    this.children[2] = new Quadtree(
      { x: x, y: y + h, w: w, h: h },
      this.capacity,
    );
    this.children[3] = new Quadtree({ x: x, y: y, w: w, h: h }, this.capacity);

    for (let i = 0; i < SUBDIVISIONS; i++) {
      this.children[i].parent = this;
      this.children[i].depth = this.depth + 1;
    }

    for (let i = 0; i < this.container.length; i++) {
      const item = this.container[i];

      for (let i = 0; i < SUBDIVISIONS; i++) {
        if (this.children[i].insert(item)) break;
      }
    }

    this.container = [];
  }

  private intersects(range: IRectangle): boolean {
    return (
      this.rectangle.x + this.rectangle.w >= range.x &&
      this.rectangle.x <= range.x + range.w &&
      this.rectangle.y + this.rectangle.h >= range.y &&
      this.rectangle.y <= range.y + range.h
    );
  }

  private isPointInRectangle(point: IPoint, rectangle: IRectangle): boolean {
    return (
      point.x >= rectangle.x &&
      point.x < rectangle.x + rectangle.w &&
      point.y >= rectangle.y &&
      point.y < rectangle.y + rectangle.h
    );
  }
}
