/** Mutable 4D Vector class. */
export class Vector4 {
  /** Returns a (0, 0, 0, 0) vector. */
  static zero() {
    return new Vector4(0, 0, 0, 0);
  }

  /** Returns a (1, 1, 1, 1) vector. */
  static one() {
    return new Vector4(1, 1, 1, 1);
  }

  /** Returns a (Infinity, Infinity, Infinity, Infinity) vector. */
  static infinity() {
    return new Vector4(Infinity, Infinity, Infinity, Infinity);
  }

  /**
   * Returns a new duplicate of the given vector.
   * @param vector4 The vector to clone
   */
  static clone(vector4: Vector4) {
    return new Vector4(vector4.x, vector4.y, vector4.z, vector4.w);
  }

  /**
   * Adds two vectors component-wise and returns the result as a new vector.
   * @param va First vector
   * @param vb Second vector
   */
  static add(va: Vector4, vb: Vector4) {
    return new Vector4(va.x + vb.x, va.y + vb.y, va.z + vb.z, va.w + vb.w);
  }

  /**
   * Subtracts the second vector from the first component-wise and returns the result as a new vector.
   * @param va First vector
   * @param vb Second vector to subtract
   */
  static subtract(va: Vector4, vb: Vector4) {
    return new Vector4(va.x - vb.x, va.y - vb.y, va.z - vb.z, va.w - vb.w);
  }

  /**
   * Multiplies two vectors component-wise and returns the result as a new vector.
   * @param va First vector
   * @param vb Second vector
   */
  static multiply(va: Vector4, vb: Vector4) {
    return new Vector4(va.x * vb.x, va.y * vb.y, va.z * vb.z, va.w * vb.w);
  }

  /**
   * Divides the first vector by the second component-wise and returns the result as a new vector.
   * @param va First vector (dividend)
   * @param vb Second vector (divisor)
   */
  static divide(va: Vector4, vb: Vector4) {
    return new Vector4(va.x / vb.x, va.y / vb.y, va.z / vb.z, va.w / vb.w);
  }

  /**
   * Calculates the squared distance between two vectors (faster than distance).
   * @param va First vector
   * @param vb Second vector
   */
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

  /**
   * Calculates the Euclidean distance between two vectors.
   * @param va First vector
   * @param vb Second vector
   */
  static distance(va: Vector4, vb: Vector4) {
    return Math.sqrt(this.distanceSquared(va, vb));
  }

  /**
   * Calculates the dot product of two vectors.
   * @param va First vector
   * @param vb Second vector
   */
  static dot(va: Vector4, vb: Vector4) {
    return va.x * vb.x + va.y * vb.y + va.z * vb.z + va.w * vb.w;
  }

  /**
   * Performs linear interpolation between two vectors.
   * @param va Starting vector
   * @param vb Target vector
   * @param step Interpolation factor (0 = va, 1 = vb)
   */
  static lerp(va: Vector4, vb: Vector4, step: number) {
    return new Vector4(
      va.x + step * (vb.x - va.x),
      va.y + step * (vb.y - va.y),
      va.z + step * (vb.z - va.z),
      va.w + step * (vb.w - va.w),
    );
  }

  /**
   * Creates a new Vector4 instance.
   * @param x X component or red in RGBA
   * @param y Y component or green in RGBA
   * @param z Z component or blue in RGBA
   * @param w W component or alpha in RGBA
   */
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public w: number,
  ) {}

  /** Alias for x. */
  get r() {
    return this.x;
  }
  /** Alias for x. */
  set r(value: number) {
    this.x = value;
  }
  /** Alias for y. */
  get g() {
    return this.y;
  }
  /** Alias for y. */
  set g(value: number) {
    this.y = value;
  }
  /** Alias for z. */
  get b() {
    return this.z;
  }
  /** Alias for z. */
  set b(value: number) {
    this.z = value;
  }
  /** Alias for w. */
  get a() {
    return this.w;
  }
  /** Alias for w. */
  set a(value: number) {
    this.w = value;
  }

  /** Creates a new vector with the same components as this one. */
  clone() {
    return new Vector4(this.x, this.y, this.z, this.w);
  }

  /**
   * Copies the components from another vector to this one.
   * @param vector4 Source vector to copy from
   * @returns This vector for chaining
   */
  copy(vector4: Vector4) {
    this.x = vector4.x;
    this.y = vector4.y;
    this.z = vector4.z;
    this.w = vector4.w;
    return this;
  }

  /**
   * Sets the components of this vector.
   * @param x New X component
   * @param y New Y component
   * @param z New Z component
   * @param w New W component
   * @returns This vector for chaining
   */
  set(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  /**
   * Adds another vector to this one component-wise.
   * @param vector4 Vector to add
   * @returns This vector for chaining
   */
  add(vector4: Vector4) {
    this.x += vector4.x;
    this.y += vector4.y;
    this.z += vector4.z;
    this.w += vector4.w;
    return this;
  }

  /**
   * Increases this vector's components by given values.
   * @param x Value to add to X component
   * @param y Value to add to Y component
   * @param z Value to add to Z component
   * @param w Value to add to W component
   * @returns This vector for chaining
   */
  increase(x: number, y: number, z: number, w: number) {
    this.x += x;
    this.y += y;
    this.z += z;
    this.w += w;
    return this;
  }

  /**
   * Subtracts another vector from this one component-wise.
   * @param vector4 Vector to subtract
   * @returns This vector for chaining
   */
  subtract(vector4: Vector4) {
    this.x -= vector4.x;
    this.y -= vector4.y;
    this.z -= vector4.z;
    this.w -= vector4.w;
    return this;
  }

  /**
   * Decreases this vector's components by given values.
   * @param x Value to subtract from X component
   * @param y Value to subtract from Y component
   * @param z Value to subtract from Z component
   * @param w Value to subtract from W component
   * @returns This vector for chaining
   */
  decrease(x: number, y: number, z: number, w: number) {
    this.x -= x;
    this.y -= y;
    this.z -= z;
    this.w -= w;
    return this;
  }

  /**
   * Multiplies this vector by another component-wise.
   * @param vector4 Vector to multiply by
   * @returns This vector for chaining
   */
  multiply(vector4: Vector4) {
    this.x *= vector4.x;
    this.y *= vector4.y;
    this.z *= vector4.z;
    this.w *= vector4.w;
    return this;
  }

  /**
   * Scales this vector by a scalar value.
   * @param scalar Value to multiply all components by
   * @returns This vector for chaining
   */
  scale(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
    return this;
  }

  /**
   * Floors all components of this vector (rounds down to nearest integer).
   * @returns This vector for chaining
   */
  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    this.w = Math.floor(this.w);
    return this;
  }

  /**
   * Ceils all components of this vector (rounds up to nearest integer).
   * @returns This vector for chaining
   */
  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    this.w = Math.ceil(this.w);
    return this;
  }

  /**
   * Rounds all components of this vector to nearest integer.
   * @returns This vector for chaining
   */
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    this.w = Math.round(this.w);
    return this;
  }

  /**
   * Takes absolute value of all components.
   * @returns This vector for chaining
   */
  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);
    this.w = Math.abs(this.w);
    return this;
  }

  /** Returns the squared magnitude (length) of this vector (faster than magnitude). */
  magnitudeSquared() {
    return (
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }

  /** Returns the magnitude (length) of this vector. */
  magnitude() {
    return Math.sqrt(this.magnitudeSquared());
  }

  /**
   * Normalizes this vector (makes its length 1 while maintaining direction).
   * @returns This vector for chaining
   */
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

  /** Returns a string representation of this vector in the form "(x, y, z, w)". */
  toString() {
    return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  }
}
