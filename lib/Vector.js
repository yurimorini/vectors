
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

  toFixed(len) {
    const truncate = (v) => toFixed(v, len);
    const values = this.values.map(truncate);
    return new Vector(...values);
  }
}

module.exports = Vector;
