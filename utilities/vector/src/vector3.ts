export class Vector3 {
  static zero() {
    return new Vector3(0, 0, 0);
  }

  static one() {
    return new Vector3(1, 1, 1);
  }

  static infinity() {
    return new Vector3(Infinity, Infinity, Infinity);
  }

  static clone(vector3: Vector3) {
    return new Vector3(vector3.x, vector3.y, vector3.z);
  }

  static add(va: Vector3, vb: Vector3) {
    return new Vector3(va.x + vb.x, va.y + vb.y, va.z + vb.z);
  }

  static subtract(va: Vector3, vb: Vector3) {
    return new Vector3(va.x - vb.x, va.y - vb.y, va.z - vb.z);
  }

  static multiply(va: Vector3, vb: Vector3) {
    return new Vector3(va.x * vb.x, va.y * vb.y, va.z * vb.z);
  }

  static divide(va: Vector3, vb: Vector3) {
    return new Vector3(va.x / vb.x, va.y / vb.y, va.z / vb.z);
  }

  static distanceSquared(va: Vector3, vb: Vector3) {
    const xDistance = va.x - vb.x;
    const yDistance = va.y - vb.y;
    const zDistance = va.z - vb.z;
    return (
      xDistance * xDistance + yDistance * yDistance + zDistance * zDistance
    );
  }

  static distance(va: Vector3, vb: Vector3) {
    return Math.sqrt(this.distanceSquared(va, vb));
  }

  static dot(va: Vector3, vb: Vector3) {
    return va.x * vb.x + va.y * vb.y + va.z * vb.z;
  }

  static lerp(va: Vector3, vb: Vector3, step: number) {
    return new Vector3(
      va.x + step * (vb.x - va.x),
      va.y + step * (vb.y - va.y),
      va.z + step * (vb.z - va.z),
    );
  }

  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) { }

  get r() { return this.x; }
  set r(value: number) { this.x = value; }
  get g() { return this.y; }
  set g(value: number) { this.y = value; }
  get b() { return this.z; }
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
