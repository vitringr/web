const SIN_45 = 0.7071067811865476;

/** Mutable 2D Vector class. */
export class Vector2 {
  /** Returns a (0, 0) vector. */
  static zero() {
    return new Vector2(0, 0);
  }

  /** Returns a (1, 1) vector. */
  static one() {
    return new Vector2(1, 1);
  }

  /** Returns a normalized vector pointing north. */
  static north() {
    return new Vector2(0, -1);
  }

  /** Returns a normalized vector pointing northEast. */
  static northEast() {
    return new Vector2(SIN_45, -SIN_45);
  }

  /** Returns a normalized vector pointing east. */
  static east() {
    return new Vector2(1, 0);
  }

  /** Returns a normalized vector pointing southEast. */
  static southEast() {
    return new Vector2(SIN_45, SIN_45);
  }

  /** Returns a normalized vector pointing south. */
  static south() {
    return new Vector2(0, 1);
  }

  /** Returns a normalized vector pointing southWest. */
  static southWest() {
    return new Vector2(-SIN_45, SIN_45);
  }

  /** Returns a normalized vector pointing west. */
  static west() {
    return new Vector2(-1, 0);
  }

  /** Returns a normalized vector pointing northWest. */
  static northWest() {
    return new Vector2(-SIN_45, -SIN_45);
  }

  /** Returns a (Infinity, Infinity) vector. */
  static infinity() {
    return new Vector2(Infinity, Infinity);
  }

  /**
   * Returns a new duplicate of the given vector.
   * @param vector2 The vector to clone
   */
  static clone(vector2: Vector2) {
    return new Vector2(vector2.x, vector2.y);
  }

  /**
   * Adds two vectors component-wise and returns the result as a new vector.
   * @param va First vector
   * @param vb Second vector
   */
  static add(va: Vector2, vb: Vector2) {
    return new Vector2(va.x + vb.x, va.y + vb.y);
  }

  /**
   * Subtracts the second vector from the first component-wise and returns the result as a new vector.
   * @param va First vector
   * @param vb Second vector to subtract
   */
  static subtract(va: Vector2, vb: Vector2) {
    return new Vector2(va.x - vb.x, va.y - vb.y);
  }

  /**
   * Multiplies two vectors component-wise and returns the result as a new vector.
   * @param va First vector
   * @param vb Second vector
   */
  static multiply(va: Vector2, vb: Vector2) {
    return new Vector2(va.x * vb.x, va.y * vb.y);
  }

  /**
   * Divides the first vector by the second component-wise and returns the result as a new vector.
   * @param va First vector (dividend)
   * @param vb Second vector (divisor)
   */
  static divide(va: Vector2, vb: Vector2) {
    return new Vector2(va.x / vb.x, va.y / vb.y);
  }

  /**
   * Calculates the squared distance between two vectors (faster than distance).
   * @param va First vector
   * @param vb Second vector
   */
  static distanceSquared(va: Vector2, vb: Vector2) {
    const xDistance = va.x - vb.x;
    const yDistance = va.y - vb.y;
    return xDistance * xDistance + yDistance * yDistance;
  }

  /**
   * Calculates the Euclidean distance between two vectors.
   * @param va First vector
   * @param vb Second vector
   */
  static distance(va: Vector2, vb: Vector2) {
    return Math.sqrt(Vector2.distanceSquared(va, vb));
  }

  /**
   * Calculates the dot product of two vectors.
   * @param va First vector
   * @param vb Second vector
   */
  static dot(va: Vector2, vb: Vector2) {
    return va.x * vb.x + va.y * vb.y;
  }

  /**
   * Performs linear interpolation between two vectors.
   * @param va Starting vector
   * @param vb Target vector
   * @param step Interpolation factor (0 = va, 1 = vb)
   */
  static lerp(va: Vector2, vb: Vector2, step: number) {
    return new Vector2(
      va.x + step * (vb.x - va.x),
      va.y + step * (vb.y - va.y),
    );
  }

  /**
   * Creates a new Vector2 instance.
   * @param x X component
   * @param y Y component
   */
  constructor(
    public x: number,
    public y: number,
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

  /** Creates a new vector with the same components as this one. */
  clone() {
    return new Vector2(this.x, this.y);
  }

  /**
   * Copies the components from another vector to this one.
   * @param vector2 Source vector to copy from
   * @returns This vector for chaining
   */
  copy(vector2: Vector2) {
    this.x = vector2.x;
    this.y = vector2.y;
    return this;
  }

  /**
   * Sets the components of this vector.
   * @param x New X component
   * @param y New Y component
   * @returns This vector for chaining
   */
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Adds another vector to this one component-wise.
   * @param vector2 Vector to add
   * @returns This vector for chaining
   */
  add(vector2: Vector2) {
    this.x += vector2.x;
    this.y += vector2.y;
    return this;
  }

  /**
   * Increases this vector's components by given values.
   * @param x Value to add to X component
   * @param y Value to add to Y component
   * @returns This vector for chaining
   */
  increase(x: number, y: number) {
    this.x += x;
    this.y += y;
    return this;
  }

  /**
   * Subtracts another vector from this one component-wise.
   * @param vector2 Vector to subtract
   * @returns This vector for chaining
   */
  subtract(vector2: Vector2) {
    this.x -= vector2.x;
    this.y -= vector2.y;
    return this;
  }

  /**
   * Decreases this vector's components by given values.
   * @param x Value to subtract from X component
   * @param y Value to subtract from Y component
   * @returns This vector for chaining
   */
  decrease(x: number, y: number) {
    this.x -= x;
    this.y -= y;
    return this;
  }

  /**
   * Multiplies this vector by another component-wise.
   * @param vector2 Vector to multiply by
   * @returns This vector for chaining
   */
  multiply(vector2: Vector2) {
    this.x *= vector2.x;
    this.y *= vector2.y;
    return this;
  }

  /**
   * Scales this vector by a scalar value.
   * @param scalar Value to multiply both components by
   * @returns This vector for chaining
   */
  scale(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Floors both components of this vector (rounds down to nearest integer).
   * @returns This vector for chaining
   */
  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  /**
   * Ceils both components of this vector (rounds up to nearest integer).
   * @returns This vector for chaining
   */
  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  /**
   * Rounds both components of this vector to nearest integer.
   * @returns This vector for chaining
   */
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  /**
   * Takes absolute value of both components.
   * @returns This vector for chaining
   */
  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }

  /** Returns the squared magnitude (length) of this vector (faster than magnitude). */
  magnitudeSquared() {
    return this.x * this.x + this.y * this.y;
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
    }
    return this;
  }

  /** Returns a string representation of this vector in the form "(x, y)". */
  toString() {
    return `(${this.x}, ${this.y})`;
  }
}
