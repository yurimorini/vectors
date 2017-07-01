const FLOAT_PRECISION = 10;
const CANNOT_NORMALIZE_ZERO = "Cannot normalize the zero vector";
const CANNOT_COMPUTE_ANGLE_ZERO = "Cannot compute angle with the zero vector";
const NO_UNIQUE_PARALLEL_COMPONENT = "No unique parallel component with a zero vector";
const NO_UNIQUE_ORTHOGONAL_COMPONENT = "No unique orthogonal component with a zero vector";
const CROSS_PRODUCT_TOO_MANY_DIMENSIONS = "Cross product is valid only in three dimensions";


const toFixed = (value, len = FLOAT_PRECISION) => {
  return parseFloat(value.toFixed(len));
}

const rethrowIf = (e, check, msg) => {
  if (e.message == check)
    throw new Error(msg);
}


class Vector {
  constructor(...coordinates) {
    if (coordinates.length == 0) {
      throw new RangeError("Values must be non empty");
    }
    this.values = coordinates.map((val) => val);
    this.length = this.values.length;
  }

  equal(vector, tolerance = 1e-10) {
    return this.values.filter((val, i) => {
      return (this.at(i) - vector.at(i)) > tolerance;
    }).length == 0;
  }

  toString() {
    return `Vector(${this.values.join(', ')})`;
  }

  at(i, len) {
    let value = this.values[i] || 0;
    if (len && value)
      value = toFixed(value, len);
    return value;
  }

  toFixed(len = 3) {
    const truncate = (v) => toFixed(v, len);
    const values = this.values.map(truncate);
    return new Vector(...values);
  }

  sum(v) {
    const values = this.values.map((val, i) => val + v.at(i));
    return new Vector(...values);
  }

  minus(v) {
    const values = this.values.map((val, i) => val - v.at(i));
    return new Vector(...values);
  }

  times(value) {
    const values = this.values.map((val) => val * value);
    return new Vector(...values);
  }

  magnitude() {
    return Math.sqrt(this.values.reduce(
      (sum, c) => sum + Math.pow(c, 2), 0
    ));
  }

  normalize() {
    const magnitude = this.magnitude();
    if (magnitude == 0) {
      throw new Error(CANNOT_NORMALIZE_ZERO);
    }
    return this.times(1.0/magnitude);
  }

  dotProduct(v) {
    return this.values
      .map((val, i) => v.at(i) * this.at(i))
      .reduce((sum, val) => sum + val, 0);
  }

  angle(v, degree = false) {
    try {
      const inner = this.normalize().dotProduct(v.normalize());
      const angle = Math.acos(toFixed(inner));
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

  isZero(tolerance = 1e-10) {
    return this.magnitude() < tolerance
  }

  isOrthogonal(v, tolerance = 1e-10) {
    return Math.abs(this.dotProduct(v)) < tolerance;
  }

  isParallel(v) {
    return this.isZero()
      || v.isZero()
      || this.angle(v) == 0
      || this.angle(v) == Math.PI;
  }

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

  crossProduct(v) {
    if (v.length > 3 || this.length > 3)
      throw new Error(CROSS_PRODUCT_TOO_MANY_DIMENSIONS);

    return new Vector(...[
      ((this.at(1) * v.at(2)) - (v.at(1) * this.at(2))),
      ((this.at(0) * v.at(2)) - (v.at(0) * this.at(2))) * -1,
      ((this.at(0) * v.at(1)) - (v.at(0) * this.at(1)))
    ]);
  }

  parallelogramArea(v) {
    return this.crossProduct(v).magnitude();
  }

  triangleArea(v) {
    return this.parallelogramArea(v) / 2.0;
  }
}

module.exports = Vector;
