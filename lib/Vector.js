
// Default precision to float approximation
const FLOAT_PRECISION = 10;

// Error messages
const CANNOT_NORMALIZE_ZERO = "Cannot normalize the zero vector";
const CANNOT_COMPUTE_ANGLE_ZERO = "Cannot compute angle with the zero vector";
const NO_UNIQUE_PARALLEL_COMPONENT = "No unique parallel component with a zero vector";
const NO_UNIQUE_ORTHOGONAL_COMPONENT = "No unique orthogonal component with a zero vector";
const CROSS_PRODUCT_TOO_MANY_DIMENSIONS = "Cross product is valid only in three dimensions";

/**
 * Transform a float number to a float
 * with the given precision
 */
const toFixed = (value, len = FLOAT_PRECISION) => {
  return parseFloat(value.toFixed(len));
}

/**
 * Retrhow an Error checking the Error
 * message, in another exception
 */
const rethrowIf = (e, check, msg) => {
  if (e.message == check)
    throw new Error(msg);
}

/**
 * Basic vector class
 */
class Vector {

  /**
   * Create a vector with any number of components
  */
  constructor(...coordinates) {
    if (coordinates.length == 0) {
      throw new RangeError("Values must be non empty");
    }
    this.values = coordinates.map((val) => val);
    this.length = this.values.length;
  }

  /**
   * Check equality between two vectors
  */
  equal(vector, tolerance = 1e-10) {
    return this.values.filter((val, i) => {
      return (this.at(i) - vector.at(i)) > tolerance;
    }).length == 0;
  }

  /**
   * Pretty print a vector object
  */
  toString() {
    return `Vector(${this.values.join(', ')})`;
  }

  /**
   * Return a vector coordinate, optionally
   * with a precision tolerance level
  */
  at(i, len) {
    let value = this.values[i] || 0;
    if (len && value)
      value = toFixed(value, len);
    return value;
  }

  /**
   * Return a new Vector to a given precision level
  */
  toFixed(len = 3) {
    const truncate = (v) => toFixed(v, len);
    const values = this.values.map(truncate);
    return new Vector(...values);
  }

  /**
   * Sum the vector to another vector
  */
  sum(v) {
    const values = this.values.map((val, i) => val + v.at(i));
    return new Vector(...values);
  }

  /**
   * subtract the vector to another vector
  */
  minus(v) {
    const values = this.values.map((val, i) => val - v.at(i));
    return new Vector(...values);
  }

  /**
   * Multiply every component of the vector
   * to a scalar value
   */
  times(value) {
    const values = this.values.map((val) => val * value);
    return new Vector(...values);
  }

  /**
   * Find the magnitude of the vector
   * using pithagoras theoorem
  */
  magnitude() {
    return Math.sqrt(this.values.reduce(
      (sum, c) => sum + Math.pow(c, 2), 0
    ));
  }

  /**
   * Find the unit vector normalizing
   * its components to 1. A zero vector cannot
   * be normalized
  */
  normalize() {
    const magnitude = this.magnitude();
    if (magnitude == 0) {
      throw new Error(CANNOT_NORMALIZE_ZERO);
    }
    return this.times(1.0/magnitude);
  }

  /**
   * Find the dot product of the vector with
   * another vector (return always a scala value)
  */
  dotProduct(v) {
    return this.values
      .map((val, i) => v.at(i) * this.at(i))
      .reduce((sum, val) => sum + val, 0);
  }

  /**
   * Find the angle between the two vector
   * Throw an exception if one vector ia zero vector
   *
   * Derived from: ||u.w|| = ||u|| * ||v|| * cos(a)
  */
  angle(v, degree = false) {
    try {
      const dot = this.normalize().dotProduct(v.normalize());
      const angle = Math.acos(toFixed(dot));
      return degree
        ? angle * 180 / Math.PI
        : angle;

    } catch (e) {
      rethrowIf(e,
        CANNOT_NORMALIZE_ZERO,
        CANNOT_COMPUTE_ANGLE_ZERO);
      throw e;
    }
  }

  /**
   * Check if vector as zero magnitude
   */
  isZero(tolerance = 1e-10) {
    return this.magnitude() < tolerance
  }

  /**
   * Check if the vector is perpendicular to this
   * vector (dot product is zero)
   * Zero vector is always perpendicular
  */
  isOrthogonal(v, tolerance = 1e-10) {
    return Math.abs(this.dotProduct(v)) < tolerance;
  }

  /**
   * Check if the provided vector is parallel
   * Zero vector is always parallel
   */
  isParallel(v) {
    return this.isZero()
      || v.isZero()
      || this.angle(v) == 0
      || this.angle(v) == Math.PI;
  }

  /**
   * Find the vector projection on the basis provided
   * Derived from: v_parallel = (v.b_normalized) * b_normalized
  */
  parallelComponentTo(basis) {
    try {
      const u = basis.normalize();
      const weight = this.dotProduct(u);
      return u.times(weight);

    } catch (e) {
      rethrowIf(e,
        CANNOT_NORMALIZE_ZERO,
        NO_UNIQUE_PARALLEL_COMPONENT);
      throw e;
    }
  }

  /**
   * Find the orthogonal component of the Vector
   * projected on the basis (derived from the Parallelogram rule)
  */
  perpendicularComponentTo(v) {
    try {
      const projection = this.parallelComponentTo(v)
      return this.minus(projection);

    } catch (e) {
      rethrowIf(e,
        NO_UNIQUE_PARALLEL_COMPONENT,
        NO_UNIQUE_ORTHOGONAL_COMPONENT);
      throw e;
    }
  }

  /**
   * COmpurte the cross product by the two vector
   * Non sense in a more than 3 dimensions
  */
  crossProduct(v) {
    if (v.length > 3 || this.length > 3)
      throw new Error(CROSS_PRODUCT_TOO_MANY_DIMENSIONS);

    return new Vector(...[
      ((this.at(1) * v.at(2)) - (v.at(1) * this.at(2))),
      ((this.at(0) * v.at(2)) - (v.at(0) * this.at(2))) * -1,
      ((this.at(0) * v.at(1)) - (v.at(0) * this.at(1)))
    ]);
  }

  /**
   * Compute the parallelogram area derived from the two vector
   * aka the magnitude of the cross product
  */
  parallelogramArea(v) {
    return this.crossProduct(v).magnitude();
  }

  /**
   * Compute the triangle area derived from the two vector
   * aka half of the parallelogram area
  */
  triangleArea(v) {
    return this.parallelogramArea(v) / 2.0;
  }
}

module.exports = Vector;
