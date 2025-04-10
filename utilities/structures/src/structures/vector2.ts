export class Vector2 {
  static zero() {
    return new Vector2(0, 0);
  }

  static one() {
    return new Vector2(1, 1);
  }

  static infinity() {
    return new Vector2(Infinity, Infinity);
  }

  static clone(vector2: Vector2) {
    return new Vector2(vector2.x, vector2.y);
  }

  static add(va: Vector2, vb: Vector2) {
    return new Vector2(va.x + vb.x, va.y + vb.y);
  }

  static subtract(va: Vector2, vb: Vector2) {
    return new Vector2(va.x - vb.x, va.y - vb.y);
  }

  static multiply(va: Vector2, vb: Vector2) {
    return new Vector2(va.x * vb.x, va.y * vb.y);
  }

  static divide(va: Vector2, vb: Vector2) {
    return new Vector2(va.x / vb.x, va.y / vb.y);
  }

  static distanceSquared(va: Vector2, vb: Vector2) {
    const xDistance = va.x - vb.x;
    const yDistance = va.y - vb.y;
    return xDistance * xDistance + yDistance * yDistance;
  }

  static distance(va: Vector2, vb: Vector2) {
    return Math.sqrt(Vector2.distanceSquared(va, vb));
  }

  static dot(va: Vector2, vb: Vector2) {
    return va.x * vb.x + va.y * vb.y;
  }

  static lerp(va: Vector2, vb: Vector2, step: number) {
    return new Vector2(
      va.x + step * (vb.x - va.x),
      va.y + step * (vb.y - va.y),
    );
  }

  constructor(
    public x: number,
    public y: number,
  ) {}

  get r() {
    return this.x;
  }

  set r(value: number) {
    this.x = value;
  }

  get g() {
    return this.y;
  }

  set g(value: number) {
    this.y = value;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  copy(vector2: Vector2) {
    this.x = vector2.x;
    this.y = vector2.y;
    return this;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  add(vector2: Vector2) {
    this.x += vector2.x;
    this.y += vector2.y;
    return this;
  }

  increase(x: number, y: number) {
    this.x += x;
    this.y += y;
    return this;
  }

  subtract(vector2: Vector2) {
    this.x -= vector2.x;
    this.y -= vector2.y;
    return this;
  }

  decrease(x: number, y: number) {
    this.x -= x;
    this.y -= y;
    return this;
  }

  multiply(vector2: Vector2) {
    this.x *= vector2.x;
    this.y *= vector2.y;
    return this;
  }

  scale(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  magnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }

  magnitude() {
    return Math.sqrt(this.magnitudeSquared());
  }

  normalize() {
    const magnitude = this.magnitude();
    if (magnitude > 0) {
      this.x /= magnitude;
      this.y /= magnitude;
    }
    return this;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}
