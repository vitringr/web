export class Vector3 {
  static zero() {
    return new Vector3(0, 0, 0);
  }

  static one() {
    return new Vector3(1, 1, 1);
  }

  static clone(vector3: Vector3) {
    return new Vector3(vector3.x, vector3.y, vector3.z);
  }

  static add(v1: Vector3, v2: Vector3) {
    return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  static subtract(v1: Vector3, v2: Vector3) {
    return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  static multiply(v1: Vector3, v2: Vector3) {
    return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
  }

  static divide(v1: Vector3, v2: Vector3) {
    return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
  }

  static distanceSquared(v1: Vector3, v2: Vector3) {
    const xDistance = v1.x - v2.x;
    const yDistance = v1.y - v2.y;
    const zDistance = v1.z - v2.z;
    return (
      xDistance * xDistance + yDistance * yDistance + zDistance * zDistance
    );
  }

  static distance(v1: Vector3, v2: Vector3) {
    return Math.sqrt(this.distanceSquared(v1, v2));
  }

  static dot(v1: Vector3, v2: Vector3) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }

  constructor(
    public x: number,
    public y: number,
    public z: number,
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

  get b() {
    return this.z;
  }

  set b(value: number) {
    this.z = value;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
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

  subtract(vector3: Vector3) {
    this.x -= vector3.x;
    this.y -= vector3.y;
    this.z -= vector3.z;
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
    const length = this.magnitude();
    if (length > 0) {
      this.x /= length;
      this.y /= length;
      this.z /= length;
    }
    return this;
  }
}
