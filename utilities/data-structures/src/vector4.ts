/** Mutable 4D Vector class. */
export class Vector4 {
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public w: number,
  ) { }

  get r() { return this.x; }
  get g() { return this.y; }
  get b() { return this.z; }
  get a() { return this.w; }
  set r(value: number) { this.x = value; }
  set g(value: number) { this.y = value; }
  set b(value: number) { this.z = value; }
  set a(value: number) { this.w = value; }

  clone() {
    return new Vector4(this.x, this.y, this.z, this.w);
  }

  copy(vector4: Vector4) {
    this.x = vector4.x;
    this.y = vector4.y;
    this.z = vector4.z;
    this.w = vector4.w;
    return this;
  }

  set(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  add(vector4: Vector4) {
    this.x += vector4.x;
    this.y += vector4.y;
    this.z += vector4.z;
    this.w += vector4.w;
    return this;
  }

  increase(x: number, y: number, z: number, w: number) {
    this.x += x;
    this.y += y;
    this.z += z;
    this.w += w;
    return this;
  }

  subtract(vector4: Vector4) {
    this.x -= vector4.x;
    this.y -= vector4.y;
    this.z -= vector4.z;
    this.w -= vector4.w;
    return this;
  }

  decrease(x: number, y: number, z: number, w: number) {
    this.x -= x;
    this.y -= y;
    this.z -= z;
    this.w -= w;
    return this;
  }

  multiply(vector4: Vector4) {
    this.x *= vector4.x;
    this.y *= vector4.y;
    this.z *= vector4.z;
    this.w *= vector4.w;
    return this;
  }

  scale(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
    return this;
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    this.w = Math.floor(this.w);
    return this;
  }

  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    this.w = Math.ceil(this.w);
    return this;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    this.w = Math.round(this.w);
    return this;
  }

  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);
    this.w = Math.abs(this.w);
    return this;
  }

  magnitudeSquared() {
    return (
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }

  magnitude() {
    return Math.sqrt(this.magnitudeSquared());
  }

  normalize() {
    const magnitude = this.magnitude();
    if (magnitude > 0) {
      this.x /= magnitude;
      this.y /= magnitude;
      this.z /= magnitude;
      this.w /= magnitude;
    }
    return this;
  }

  toString() {
    return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  }
}

export namespace Vector4 {
  export namespace Create {
    export function zero() {
      return new Vector4(0, 0, 0, 0);
    }

    export function one() {
      return new Vector4(1, 1, 1, 1);
    }

    export function infinity() {
      return new Vector4(Infinity, Infinity, Infinity, Infinity);
    }

    export function random() {
      return new Vector4(
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random(),
      );
    }
  }

  export function clone(vector4: Vector4) {
    return new Vector4(vector4.x, vector4.y, vector4.z, vector4.w);
  }

  export function add(va: Vector4, vb: Vector4) {
    return new Vector4(va.x + vb.x, va.y + vb.y, va.z + vb.z, va.w + vb.w);
  }

  export function subtract(va: Vector4, vb: Vector4) {
    return new Vector4(va.x - vb.x, va.y - vb.y, va.z - vb.z, va.w - vb.w);
  }

  export function multiply(va: Vector4, vb: Vector4) {
    return new Vector4(va.x * vb.x, va.y * vb.y, va.z * vb.z, va.w * vb.w);
  }

  export function divide(va: Vector4, vb: Vector4) {
    return new Vector4(va.x / vb.x, va.y / vb.y, va.z / vb.z, va.w / vb.w);
  }

  export function distanceSquared(va: Vector4, vb: Vector4) {
    const xDistance = va.x - vb.x;
    const yDistance = va.y - vb.y;
    const zDistance = va.z - vb.z;
    const wDistance = va.w - vb.w;
    return (
      xDistance * xDistance +
      yDistance * yDistance +
      zDistance * zDistance +
      wDistance * wDistance
    );
  }

  export function distance(va: Vector4, vb: Vector4) {
    return Math.sqrt(distanceSquared(va, vb));
  }

  export function dot(va: Vector4, vb: Vector4) {
    return va.x * vb.x + va.y * vb.y + va.z * vb.z + va.w * vb.w;
  }

  export function lerp(va: Vector4, vb: Vector4, step: number) {
    return new Vector4(
      va.x + step * (vb.x - va.x),
      va.y + step * (vb.y - va.y),
      va.z + step * (vb.z - va.z),
      va.w + step * (vb.w - va.w),
    );
  }
}
