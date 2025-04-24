/** Mutable 3D Vector class. */
export class Vector3 {
  /**
   * Creates a new Vector3 instance.
   * @param x X component
   * @param y Y component
   * @param z Z component
   */
  constructor(
    public x: number,
    public y: number,
    public z: number,
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

  /** Creates a new vector with the same components as this one. */
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  /**
   * Copies the components from another vector to this one.
   * @param vector3 Source vector to copy from
   * @returns This vector for chaining
   */
  copy(vector3: Vector3) {
    this.x = vector3.x;
    this.y = vector3.y;
    this.z = vector3.z;
    return this;
  }

  /**
   * Sets the components of this vector.
   * @param x New X component
   * @param y New Y component
   * @param z New Z component
   * @returns This vector for chaining
   */
  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  /**
   * Adds another vector to this one component-wise.
   * @param vector3 Vector to add
   * @returns This vector for chaining
   */
  add(vector3: Vector3) {
    this.x += vector3.x;
    this.y += vector3.y;
    this.z += vector3.z;
    return this;
  }

  /**
   * Increases this vector's components by given values.
   * @param x Value to add to X component
   * @param y Value to add to Y component
   * @param z Value to add to Z component
   * @returns This vector for chaining
   */
  increase(x: number, y: number, z: number) {
    this.x += x;
    this.y += y;
    this.z += z;
    return this;
  }

  /**
   * Subtracts another vector from this one component-wise.
   * @param vector3 Vector to subtract
   * @returns This vector for chaining
   */
  subtract(vector3: Vector3) {
    this.x -= vector3.x;
    this.y -= vector3.y;
    this.z -= vector3.z;
    return this;
  }

  /**
   * Decreases this vector's components by given values.
   * @param x Value to subtract from X component
   * @param y Value to subtract from Y component
   * @param z Value to subtract from Z component
   * @returns This vector for chaining
   */
  decrease(x: number, y: number, z: number) {
    this.x -= x;
    this.y -= y;
    this.z -= z;
    return this;
  }

  /**
   * Multiplies this vector by another component-wise.
   * @param vector3 Vector to multiply by
   * @returns This vector for chaining
   */
  multiply(vector3: Vector3) {
    this.x *= vector3.x;
    this.y *= vector3.y;
    this.z *= vector3.z;
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
    return this;
  }

  /** Returns the squared magnitude (length) of this vector (faster than magnitude). */
  magnitudeSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
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
    }
    return this;
  }

  /** Returns a string representation of this vector in the form "(x, y, z)". */
  toString() {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}

export namespace Vector3 {
  /**
   *
   * Contains methods that create common vector instances.
   * @namespace Create
   */
  export namespace Create {
    /** Returns a (0, 0, 0) vector. */
    export function zero() {
      return new Vector3(0, 0, 0);
    }

    /** Returns a (1, 1, 1) vector. */
    export function one() {
      return new Vector3(1, 1, 1);
    }

    /** Returns a (Infinity, Infinity, Infinity) vector. */
    export function infinity() {
      return new Vector3(Infinity, Infinity, Infinity);
    }

    /** Returns a vector with random (0 to 1 range) components */
    export function random() {
      return new Vector3(Math.random(), Math.random(), Math.random());
    }
  }

  /**
   * Returns a new duplicate of the given vector.
   * @param vector3 The vector to clone
   */
  export function clone(vector3: Vector3) {
    return new Vector3(vector3.x, vector3.y, vector3.z);
  }

  /**
   * Adds two vectors component-wise and returns the result as a new vector.
   * @param va First vector
   * @param vb Second vector
   */
  export function add(va: Vector3, vb: Vector3) {
    return new Vector3(va.x + vb.x, va.y + vb.y, va.z + vb.z);
  }

  /**
   * Subtracts the second vector from the first component-wise and returns the result as a new vector.
   * @param va First vector
   * @param vb Second vector to subtract
   */
  export function subtract(va: Vector3, vb: Vector3) {
    return new Vector3(va.x - vb.x, va.y - vb.y, va.z - vb.z);
  }

  /**
   * Multiplies two vectors component-wise and returns the result as a new vector.
   * @param va First vector
   * @param vb Second vector
   */
  export function multiply(va: Vector3, vb: Vector3) {
    return new Vector3(va.x * vb.x, va.y * vb.y, va.z * vb.z);
  }

  /**
   * Divides the first vector by the second component-wise and returns the result as a new vector.
   *
   * WARNING: Does not check for division by zero.
   *
   * @param va First vector (dividend)
   * @param vb Second vector (divisor)
   */
  export function divide(va: Vector3, vb: Vector3) {
    return new Vector3(va.x / vb.x, va.y / vb.y, va.z / vb.z);
  }

  /**
   * Calculates the squared distance between two vectors (faster than distance).
   * @param va First vector
   * @param vb Second vector
   */
  export function distanceSquared(va: Vector3, vb: Vector3) {
    const xDistance = va.x - vb.x;
    const yDistance = va.y - vb.y;
    const zDistance = va.z - vb.z;
    return (
      xDistance * xDistance + yDistance * yDistance + zDistance * zDistance
    );
  }

  /**
   * Calculates the Euclidean distance between two vectors.
   * @param va First vector
   * @param vb Second vector
   */
  export function distance(va: Vector3, vb: Vector3) {
    return Math.sqrt(distanceSquared(va, vb));
  }

  /**
   * Calculates the dot product of two vectors.
   * @param va First vector
   * @param vb Second vector
   */
  export function dot(va: Vector3, vb: Vector3) {
    return va.x * vb.x + va.y * vb.y + va.z * vb.z;
  }

  /**
   * Performs linear interpolation between two vectors.
   * @param va Starting vector
   * @param vb Target vector
   * @param step Interpolation factor (0 = va, 1 = vb)
   */
  export function lerp(va: Vector3, vb: Vector3, step: number) {
    return new Vector3(
      va.x + step * (vb.x - va.x),
      va.y + step * (vb.y - va.y),
      va.z + step * (vb.z - va.z),
    );
  }
}
