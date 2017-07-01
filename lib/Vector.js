const FLOAT_PRECISION = 10;
const CANNOT_NORMALIZE_ZERO = "Cannot normalize the zero vector";
const CANNOT_COMPUTE_ANGLE_ZERO = "Cannot compute angle with the zero vector";

const toFixed = (value, len = FLOAT_PRECISION) => {
  return parseFloat(value.toFixed(len));
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

  diff(v) {
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

  innerProduct(v) {
    return this.values
      .map((val, i) => v.at(i) * this.at(i))
      .reduce((sum, val) => sum + val, 0);
  }

  angle(v, degree = false) {
    try {
      const inner = this.normalize().innerProduct(v.normalize());
      const angle = Math.acos(toFixed(inner));
      return degree
        ? angle * 180 / Math.PI
        : angle;
    } catch (e) {
      if (e.message == CANNOT_NORMALIZE_ZERO)
        throw new Error(CANNOT_COMPUTE_ANGLE_ZERO);
      throw e;
    }
  }

  isZero(tolerance = 1e-10) {
    return this.magnitude() < tolerance
  }

  // v.w = 0
  isOrthogonal(v, tolerance = 1e-10) {
    return Math.abs(this.innerProduct(v)) < tolerance;
  }

  isParallel(v) {
    return this.isZero()
      || v.isZero()
      || this.angle(v) == 0
      || this.angle(v) == Math.PI;
  }

  projectionOn(v) {
    const u = v.normalize();
    return u.times(this.innerProduct(u));
  }
}

module.exports = Vector;
