export class Vector4 {
  static zero() {
    return new Vector4(0, 0, 0, 0);
  }

  static one() {
    return new Vector4(1, 1, 1, 1);
  }

  static infinity() {
    return new Vector4(Infinity, Infinity, Infinity, Infinity);
  }

  static clone(vector4: Vector4) {
    return new Vector4(vector4.x, vector4.y, vector4.z, vector4.w);
  }

  static add(va: Vector4, vb: Vector4) {
    return new Vector4(va.x + vb.x, va.y + vb.y, va.z + vb.z, va.w + vb.w);
  }

  static subtract(va: Vector4, vb: Vector4) {
    return new Vector4(va.x - vb.x, va.y - vb.y, va.z - vb.z, va.w - vb.w);
  }

  static multiply(va: Vector4, vb: Vector4) {
    return new Vector4(va.x * vb.x, va.y * vb.y, va.z * vb.z, va.w * vb.w);
  }

  static divide(va: Vector4, vb: Vector4) {
    return new Vector4(va.x / vb.x, va.y / vb.y, va.z / vb.z, va.w / vb.w);
  }

  static distanceSquared(va: Vector4, vb: Vector4) {
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

  static distance(va: Vector4, vb: Vector4) {
    return Math.sqrt(this.distanceSquared(va, vb));
  }

  static dot(va: Vector4, vb: Vector4) {
    return va.x * vb.x + va.y * vb.y + va.z * vb.z + va.w * vb.w;
  }

  static lerp(va: Vector4, vb: Vector4, step: number) {
    return new Vector4(
      va.x + step * (vb.x - va.x),
      va.y + step * (vb.y - va.y),
      va.z + step * (vb.z - va.z),
      va.w + step * (vb.w - va.w),
    );
  }

  constructor(
    public x: number,
    public y: number,
    public z: number,
    public w: number,
  ) { }

  get r() { return this.x; }
  set r(value: number) { this.x = value; }
  get g() { return this.y; }
  set g(value: number) { this.y = value; }
  get b() { return this.z; }
  set b(value: number) { this.z = value; }
  get a() { return this.w; }
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
