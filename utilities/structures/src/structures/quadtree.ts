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

export class Quadtree<T extends IPoint> {
  private readonly bounds: IRectangle;
  private readonly capacity: number;
  private container: T[] = [];
  private divided: boolean = false;

  private northeast?: Quadtree<T>;
  private southeast?: Quadtree<T>;
  private southwest?: Quadtree<T>;
  private northwest?: Quadtree<T>;

  constructor(bounds: IRectangle, capacity: number = 4) {
    this.bounds = bounds;
    this.capacity = capacity;
  }

  insert(item: T): boolean {
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

  query(range: IRectangle, found: T[] = []): T[] {
    if (!this.intersects(range)) {
      return found;
    }

    for (const item of this.container) {
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

    this.divided = true;

    for (const p of this.container) {
      this.northeast.insert(p) ||
        this.southeast.insert(p) ||
        this.southwest.insert(p) ||
        this.northwest.insert(p);
    }

    this.container = [];
  }

  private intersects(range: IRectangle): boolean {
    return !(
      range.x > this.bounds.x + this.bounds.width ||
      range.x + range.width < this.bounds.x ||
      range.y > this.bounds.y + this.bounds.height ||
      range.y + range.height < this.bounds.y
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
    this.divided = false;
    this.northeast = undefined;
    this.northwest = undefined;
    this.southeast = undefined;
    this.southwest = undefined;
  }
}
