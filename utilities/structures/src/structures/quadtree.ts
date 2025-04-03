interface IPoint {
  x: number;
  y: number;
}

interface IRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Quadtree<Item extends IPoint, Data> {
  readonly bounds: IRectangle;
  readonly capacity: number;

  container: Item[] = [];
  data?: Data;

  divided: boolean = false;

  northeast?: Quadtree<Item, Data>;
  southeast?: Quadtree<Item, Data>;
  southwest?: Quadtree<Item, Data>;
  northwest?: Quadtree<Item, Data>;

  parent?: Quadtree<Item, Data>;

  constructor(bounds: IRectangle, capacity: number = 4) {
    this.bounds = bounds;
    this.capacity = capacity;
  }

  insert(item: Item): boolean {
    if (!this.isPointInRectangle(item, this.bounds)) {
      return false;
    }

    if (!this.divided) {
      if (this.container.length < this.capacity) {
        this.container.push(item);
        return true;
      }

      this.subdivide();
    }

    if (!this.divided) throw "Quadtree not subdivided";

    return (
      this.northeast!.insert(item) ||
      this.southeast!.insert(item) ||
      this.southwest!.insert(item) ||
      this.northwest!.insert(item)
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
      this.northeast!.query(range, found);
      this.southeast!.query(range, found);
      this.southwest!.query(range, found);
      this.northwest!.query(range, found);
    }

    return found;
  }

  deepCallback(callback: (quadtree: Quadtree<Item, Data>) => void) {
    callback(this);

    if (this.divided) {
      this.northeast?.deepCallback(callback);
      this.southeast?.deepCallback(callback);
      this.southwest?.deepCallback(callback);
      this.northwest?.deepCallback(callback);
    }
  }

  leafDeepCallback(callback: (quadtree: Quadtree<Item, Data>) => void) {
    if (this.divided) {
      this.northeast?.leafDeepCallback(callback);
      this.southeast?.leafDeepCallback(callback);
      this.southwest?.leafDeepCallback(callback);
      this.northwest?.leafDeepCallback(callback);
    }

    callback(this);
  }

  private subdivide(): void {
    const x = this.bounds.x;
    const y = this.bounds.y;
    const w = this.bounds.width / 2;
    const h = this.bounds.height / 2;

    this.northeast = new Quadtree(
      { x: x + w, y: y, width: w, height: h },
      this.capacity,
    );

    this.southeast = new Quadtree(
      { x: x + w, y: y + h, width: w, height: h },
      this.capacity,
    );

    this.southwest = new Quadtree(
      { x: x, y: y + h, width: w, height: h },
      this.capacity,
    );

    this.northwest = new Quadtree(
      { x: x, y: y, width: w, height: h },
      this.capacity,
    );

    this.northeast.parent = this;
    this.southeast.parent = this;
    this.southwest.parent = this;
    this.northwest.parent = this;

    this.divided = true;

    for (let i = 0; i < this.container.length; i++) {
      const item = this.container[i];

      this.northeast.insert(item) ||
        this.southeast.insert(item) ||
        this.southwest.insert(item) ||
        this.northwest.insert(item);
    }

    this.container = [];
  }

  private intersects(range: IRectangle): boolean {
    return (
      this.bounds.x + this.bounds.width >= range.x &&
      this.bounds.x <= range.x + range.width &&
      this.bounds.y + this.bounds.height >= range.y &&
      this.bounds.y <= range.y + range.height
    );
  }

  private isPointInRectangle(point: IPoint, rectangle: IRectangle): boolean {
    return (
      point.x >= rectangle.x &&
      point.x <= rectangle.x + rectangle.width &&
      point.y >= rectangle.y &&
      point.y <= rectangle.y + rectangle.height
    );
  }

  clear(): void {
    this.container = [];
    this.data = undefined;
    this.divided = false;
    this.northeast = undefined;
    this.northwest = undefined;
    this.southeast = undefined;
    this.southwest = undefined;
    this.parent = undefined;
  }
}
