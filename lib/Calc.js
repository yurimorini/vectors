const Vector = require('./Vector');

class Calc {

  static maxLength(...vectors) {
    return Math.max(vectors.map(v => v.length));
  }

  static sum(...vectors) {
    const
      values  = [],
      len     = Calc.maxLength(vectors),
      reducer = (i) => (prev, v) => prev + v.at(i);

      for (let i=0; i<len; i++) {
        values[i] = vectors.reduce(reducer(i), 0);
      }

    return new Vector(...values);
  }

  static diff(...vectors) {
    const
      values  = [],
      len     = Calc.maxLength(vectors),
      reducer = (i) => (prev, v) => prev - v.at(i);

      for (let i=0; i<len; i++) {
        const start = vectors[0].at(i);
        values[i] = vectors.slice(1).reduce(reducer(i), start);
      }

    return new Vector(...values);
  }

  static scalar(scalar, vector) {
    const values = vector.values.map(v => v * scalar);
    return new Vector(...values);
  }
};

module.exports = Calc;
