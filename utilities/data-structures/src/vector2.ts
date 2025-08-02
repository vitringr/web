/** Mutable 2D Vector class. */
export class Vector2 {
  constructor(
    public x: number,
    public y: number,
  ) { }

  get r() { return this.x; }
  get g() { return this.y; }
  set r(value: number) { this.x = value; }
  set g(value: number) { this.y = value; }

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

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
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

export namespace Vector2 {
  export namespace Create {
    export function zero() {
      return new Vector2(0, 0);
    }

    export function one() {
      return new Vector2(1, 1);
    }

    export function infinity() {
      return new Vector2(Infinity, Infinity);
    }

    export function random() {
      return new Vector2(Math.random(), Math.random());
    }

    const SIN_45 = 0.7071067811865476;

    export function north(): Vector2 {
      return new Vector2(0, 1);
    }

    export function northEast(): Vector2 {
      return new Vector2(SIN_45, SIN_45);
    }

    export function east(): Vector2 {
      return new Vector2(1, 0);
    }

    export function southEast(): Vector2 {
      return new Vector2(SIN_45, -SIN_45);
    }

    export function south(): Vector2 {
      return new Vector2(0, -1);
    }

    export function southWest(): Vector2 {
      return new Vector2(-SIN_45, -SIN_45);
    }

    export function west(): Vector2 {
      return new Vector2(-1, 0);
    }

    export function northWest(): Vector2 {
      return new Vector2(-SIN_45, SIN_45);
    }
  }

  export function clone(vector2: Vector2) {
    return new Vector2(vector2.x, vector2.y);
  }

  export function add(va: Vector2, vb: Vector2) {
    return new Vector2(va.x + vb.x, va.y + vb.y);
  }

  export function subtract(va: Vector2, vb: Vector2) {
    return new Vector2(va.x - vb.x, va.y - vb.y);
  }

  export function multiply(va: Vector2, vb: Vector2) {
    return new Vector2(va.x * vb.x, va.y * vb.y);
  }

  export function divide(va: Vector2, vb: Vector2) {
    return new Vector2(va.x / vb.x, va.y / vb.y);
  }

  export function distanceSquared(va: Vector2, vb: Vector2) {
    const xDistance = va.x - vb.x;
    const yDistance = va.y - vb.y;
    return xDistance * xDistance + yDistance * yDistance;
  }

  export function distance(va: Vector2, vb: Vector2) {
    return Math.sqrt(distanceSquared(va, vb));
  }

  export function chebyshevDistance(va: Vector2, vb: Vector2) {
    const xDifference = va.x - vb.x;
    const yDifference = va.y - vb.y;
    return Math.max(Math.abs(xDifference), Math.abs(yDifference));
  }

  export function dot(va: Vector2, vb: Vector2) {
    return va.x * vb.x + va.y * vb.y;
  }

  export function lerp(va: Vector2, vb: Vector2, step: number) {
    return new Vector2(
      va.x + step * (vb.x - va.x),
      va.y + step * (vb.y - va.y),
    );
  }
}
