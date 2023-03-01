// console.log(arguments);
const C = require('./test-module-1')


//module.exports
const calculator1 = new C();
console.log(calculator1.add(1,3))

//exports
// const calculator2 = require('./test-module-2')
const {add,multiply,divide }= require('./test-module-2')
console.log(add(3,1))

//caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();