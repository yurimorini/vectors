var test = require('tape');
var Calc = require('../lib/Calc');
var Vector = require('../lib/Vector');

test('Sum n vectors', (t) => {
  const v1 = new Vector(8.218, -9.341);
  const v2 = new Vector(-1.129, 2.111);
  const sum = Calc.sum(v1, v2);

  t.equal(sum.at(0, 3), 7.089);
  t.equal(sum.at(1, 3), -7.230);
  t.end();
});

test('Diff n vectors', (t) => {
  const v1 = new Vector(7.119, 8.215);
  const v2 = new Vector(-8.223, 0.878);
  const diff = Calc.diff(v1, v2);

  t.equal(diff.at(0, 3), 15.342);
  t.equal(diff.at(1, 3), 7.337);
  t.end();
});

test('Scalar multiply a vector', (t) => {
  const v1 = new Vector(1.671, -1.012, -0.318);
  const factor = 7.41;
  const mul = Calc.scalar(factor, v1);

  t.equal(mul.at(0, 3), 12.382);
  t.equal(mul.at(1, 3), -7.499);
  t.equal(mul.at(2, 3), -2.356);
  t.end();
});
