var test = require('tape');
var Vector = require('../lib/Vector');

test('Vector throws exception if no argument is provided', (t) => {
  const construct = () => {
    return new Vector();
  };
  t.throws(construct, /RangeError/);
  t.end();
});

test('Vector accept any length arguments', (t) => {
  const construct = () => {
    const v1 = new Vector(10);
    const v2 = new Vector(10, 20);
    const v3 = new Vector(10, 20, 30);
  };
  t.doesNotThrow(construct, /RangeError/);
  t.end();
});

test('The number of arguments define the vector length', (t) => {
  const v1 = new Vector(10);
  const v2 = new Vector(10, 20);
  const v3 = new Vector(10, 20, 30);
  t.equals(v1.length, 1);
  t.equals(v2.length, 2);
  t.equals(v3.length, 3);
  t.end();
});

test("at() return the coordinates at provided index", (t) => {
  const v = new Vector(10, 20, 30);
  t.equals(v.at(0), 10);
  t.equals(v.at(1), 20);
  t.equals(v.at(2), 30);
  t.end();
});

test("at() returns 0 if out of bound", (t) => {
  const v = new Vector(10);
  t.equals(v.at(1), 0);
  t.end();
});

test("Vector is pretty printed as string", (t) => {
  const v = new Vector(10, 20);
  t.equals("Vector(10, 20)", v.toString());
  t.end();
});

test("equals compare vectors coordinates equality", (t) => {
  const v1 = new Vector(10, 20, 30);
  const v2 = new Vector(10, 20, 30);
  const v3 = new Vector(30, 10);
  t.ok(v1.equal(v2));
  t.ok(v2.equal(v1));
  t.notOk(v1.equal(v3));
  t.notOk(v2.equal(v3));
  t.end();
});

test("at() can return a fixed float", (t) => {
  const v1 = new Vector(10.33333, 20.44444, 30.123456789);
  t.equal(v1.at(0, 3), 10.333);
  t.equal(v1.at(1, 3), 20.444);
  t.equal(v1.at(2, 3), 30.123);
  t.end();
});

test("toFixed() return a copy of the vector at fixed float length", (t) => {
  const v1 = new Vector(10.97111, 20.44444444, 30.123456789);
  const fx = v1.toFixed(2);
  t.equal(fx.at(0, 2), 10.97);
  t.equal(fx.at(1, 2), 20.44);
  t.equal(fx.at(2, 2), 30.12);
  t.end();
});
