// console.log(arguments);

// console.log(require("module").wrapper);

//module.exports
//this returns a class
const C = require("./test-module-1");

const calc1 = new C();
console.log(calc1.add(2, 5));
//exports
//this returns the export object that can be used like this
// const calc2 = require("./test-module-2");
// console.log(calc2.add(2, 5));
// console.log(calc2.multiply(2, 5));
const { add, multiply, divide } = require("./test-module-2");
console.log(add(2, 5));
console.log(multiply(2, 5));

//caching
//the module is loaded only one time and it is cached somewhere by node, and it will execute the code each time from the cache
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
