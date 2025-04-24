/** Mutable 2D Vector class. */
export class Vector2 {
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

export namespace Vector2 {
  /**
   *
   * Contains methods that create common vector instances.
   * @namespace Create
   */
  export namespace Create {
    /** Returns a (0, 0) vector. */
    export function zero() {
      return new Vector2(0, 0);
    }

    /** Returns a (1, 1) vector. */
    export function one() {
      return new Vector2(1, 1);
    }

    /** Returns a (Infinity, Infinity) vector. */
    export function infinity() {
      return new Vector2(Infinity, Infinity);
    }

    /** Returns a vector with random (0 to 1 range) components */
    export function random() {
      return new Vector2(Math.random(), Math.random());
    }

    const SIN_45 = 0.7071067811865476;

    /**
     *
     * Returns a normalized vector pointing north.
     * @returns {Vector2} (0, -1)
     */
    export function north(): Vector2 {
      return new Vector2(0, -1);
    }

    /**
     *
     * Returns a normalized vector pointing northEast.
     * @returns {Vector2} (0.707..., -0.707...)
     */
    export function northEast(): Vector2 {
      return new Vector2(SIN_45, -SIN_45);
    }

    /**
     *
     * Returns a normalized vector pointing east.
     * @returns {Vector2} (1, 0)
     */
    export function east(): Vector2 {
      return new Vector2(1, 0);
    }

    /**
     *
     * Returns a normalized vector pointing southEast.
     * @returns {Vector2} (0.707..., 0.707...)
     */
    export function southEast(): Vector2 {
      return new Vector2(SIN_45, SIN_45);
    }

    /**
     *
     * Returns a normalized vector pointing south.
     * @returns {Vector2} (0, 1)
     */
    export function south(): Vector2 {
      return new Vector2(0, 1);
    }

    /**
     *
     * Returns a normalized vector pointing southWest.
     * @returns {Vector2} (-0.707..., 0.707...)
     */
    export function southWest(): Vector2 {
      return new Vector2(-SIN_45, SIN_45);
    }

    /**
     *
     * Returns a normalized vector pointing west.
     * @returns {Vector2} (-1, 0)
     */
    export function west(): Vector2 {
      return new Vector2(-1, 0);
    }

    /**
     *
     * Returns a normalized vector pointing northWest.
     * @returns {Vector2} (-0.707..., -0.707...)
     */
    export function northWest(): Vector2 {
      return new Vector2(-SIN_45, -SIN_45);
    }
  }

  /**
   * Returns a new duplicate of the given vector.
   * @param vector2 The vector to clone
   */
  export function clone(vector2: Vector2) {
    return new Vector2(vector2.x, vector2.y);
  }

  /**
   * Adds two vectors component-wise and returns the result as a new vector.
   * @param va First vector
   * @param vb Second vector
   */
  export function add(va: Vector2, vb: Vector2) {
    return new Vector2(va.x + vb.x, va.y + vb.y);
  }

  /**
   * Subtracts the second vector from the first component-wise and returns the result as a new vector.
   * @param va First vector
   * @param vb Second vector to subtract
   */
  export function subtract(va: Vector2, vb: Vector2) {
    return new Vector2(va.x - vb.x, va.y - vb.y);
  }

  /**
   * Multiplies two vectors component-wise and returns the result as a new vector.
   * @param va First vector
   * @param vb Second vector
   */
  export function multiply(va: Vector2, vb: Vector2) {
    return new Vector2(va.x * vb.x, va.y * vb.y);
  }

  /**
   * Divides the first vector by the second component-wise and returns the result as a new vector.
   *
   * WARNING: Does not check for division by zero.
   *
   * @param va First vector (dividend)
   * @param vb Second vector (divisor)
   */
  export function divide(va: Vector2, vb: Vector2) {
    return new Vector2(va.x / vb.x, va.y / vb.y);
  }

  /**
   * Calculates the squared distance between two vectors (faster than distance).
   * @param va First vector
   * @param vb Second vector
   */
  export function distanceSquared(va: Vector2, vb: Vector2) {
    const xDistance = va.x - vb.x;
    const yDistance = va.y - vb.y;
    return xDistance * xDistance + yDistance * yDistance;
  }

  /**
   * Calculates the Euclidean distance between two vectors.
   * @param va First vector
   * @param vb Second vector
   */
  export function distance(va: Vector2, vb: Vector2) {
    return Math.sqrt(distanceSquared(va, vb));
  }

  /**
   * Calculates the dot product of two vectors.
   * @param va First vector
   * @param vb Second vector
   */
  export function dot(va: Vector2, vb: Vector2) {
    return va.x * vb.x + va.y * vb.y;
  }

  /**
   * Performs linear interpolation between two vectors.
   * @param va Starting vector
   * @param vb Target vector
   * @param step Interpolation factor (0 = va, 1 = vb)
   */
  export function lerp(va: Vector2, vb: Vector2, step: number) {
    return new Vector2(
      va.x + step * (vb.x - va.x),
      va.y + step * (vb.y - va.y),
    );
  }
}
