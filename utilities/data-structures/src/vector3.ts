/** Mutable 3D Vector class. */
export class Vector3 {
  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) { }

  get r() { return this.x; }
  get g() { return this.y; }
  get b() { return this.z; }
  set r(value: number) { this.x = value; }
  set g(value: number) { this.y = value; }
  set b(value: number) { this.z = value; }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  copy(vector3: Vector3) {
    this.x = vector3.x;
    this.y = vector3.y;
    this.z = vector3.z;
    return this;
  }

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  add(vector3: Vector3) {
    this.x += vector3.x;
    this.y += vector3.y;
    this.z += vector3.z;
    return this;
  }

  increase(x: number, y: number, z: number) {
    this.x += x;
    this.y += y;
    this.z += z;
    return this;
  }

  subtract(vector3: Vector3) {
    this.x -= vector3.x;
    this.y -= vector3.y;
    this.z -= vector3.z;
    return this;
  }

  decrease(x: number, y: number, z: number) {
    this.x -= x;
    this.y -= y;
    this.z -= z;
    return this;
  }

  multiply(vector3: Vector3) {
    this.x *= vector3.x;
    this.y *= vector3.y;
    this.z *= vector3.z;
    return this;
  }

  scale(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    return this;
  }

  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    return this;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }

  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);
    return this;
  }

  magnitudeSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
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
    }
    return this;
  }

  toString() {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}

export namespace Vector3 {
  export namespace Create {
    export function zero() {
      return new Vector3(0, 0, 0);
    }

    export function one() {
      return new Vector3(1, 1, 1);
    }

    export function infinity() {
      return new Vector3(Infinity, Infinity, Infinity);
    }

    export function random() {
      return new Vector3(Math.random(), Math.random(), Math.random());
    }
  }

  export function clone(vector3: Vector3) {
    return new Vector3(vector3.x, vector3.y, vector3.z);
  }

  export function add(va: Vector3, vb: Vector3) {
    return new Vector3(va.x + vb.x, va.y + vb.y, va.z + vb.z);
  }

  export function subtract(va: Vector3, vb: Vector3) {
    return new Vector3(va.x - vb.x, va.y - vb.y, va.z - vb.z);
  }

  export function multiply(va: Vector3, vb: Vector3) {
    return new Vector3(va.x * vb.x, va.y * vb.y, va.z * vb.z);
  }

  export function divide(va: Vector3, vb: Vector3) {
    return new Vector3(va.x / vb.x, va.y / vb.y, va.z / vb.z);
  }

  export function distanceSquared(va: Vector3, vb: Vector3) {
    const xDistance = va.x - vb.x;
    const yDistance = va.y - vb.y;
    const zDistance = va.z - vb.z;
    return (
      xDistance * xDistance + yDistance * yDistance + zDistance * zDistance
    );
  }

  export function distance(va: Vector3, vb: Vector3) {
    return Math.sqrt(distanceSquared(va, vb));
  }

  export function dot(va: Vector3, vb: Vector3) {
    return va.x * vb.x + va.y * vb.y + va.z * vb.z;
  }

  export function lerp(va: Vector3, vb: Vector3, step: number) {
    return new Vector3(
      va.x + step * (vb.x - va.x),
      va.y + step * (vb.y - va.y),
      va.z + step * (vb.z - va.z),
    );
  }
}
