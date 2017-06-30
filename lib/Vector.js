const toFixed = (value, len) => {
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

  equal(vector) {
    return this.values.join(",") == vector.values.join(",");
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

  scalar(value) {
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
    if (magnitude == 0)
      throw new Error("Cannot normalize the zero vector")
    return this.scalar(1.0/magnitude);
  }

  inner(v) {
    return this.values
      .map((val, i) => v.at(i) * this.at(i))
      .reduce((sum, val) => sum + val, 0);
  }

  angleRad(v) {
    return Math.acos(this.normalize().inner(v.normalize()));
  }

  angleDeg(v) {
    return this.angleRad(v) * 180 / Math.PI;
  }
}

module.exports = Vector;
