const Vector = require('./Vector');
const range = (len) => [...Array(len).keys()];

class Calc {

  static maxLength(...vectors) {
    return Math.max(vectors.map(v => v.length));
  }

  static sum(...vectors) {
    const
      len     = Calc.maxLength(vectors),
      reducer = (i) => (prev, v) => prev + v.at(i),
      values  = range(len).map((i) => {
        return vectors.reduce(reducer(i), 0);
      });
    return new Vector(...values);
  }

  static diff(...vectors) {
    const
      len     = Calc.maxLength(vectors),
      subset  = vectors.splice(1),
      start   = (i) => vectors[0].at(i),
      reducer = (i) => (prev, v) => prev - v.at(i),
      values = range(len).map((i) => {
        return subset.reduce(reducer(i), start(i));
      });
    return new Vector(...values);
  }

  static scalar(scalar, vector) {
    const values = vector.values.map(v => v * scalar);
    return new Vector(...values);
  }
};

module.exports = Calc;
