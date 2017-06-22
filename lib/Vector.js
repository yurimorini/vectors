
class Vector {
  constructor(...coordinates) {
    if (coordinates.length == 0) {
      throw new ValueError("Values must be non empty");
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

  at(i) {
    return this.values[i] || 0;
  }
}

module.exports = Vector;
