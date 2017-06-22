const Vector = require('./lib/Vector.js');
const Calc = require('./lib/Calc.js');
const log =  require('./lib/Log.js').log;

const v1 = new Vector(100, 200);
const v2 = new Vector(100, 200);
const v3 = new Vector(200, 100);


log(v1);

log(Calc.diff(v1, v3));

log(Calc.scalar(2, v1));
