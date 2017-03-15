'use strict';

function add(a, b, callBack) {
  setTimeout(() => callBack(a + b), 1);
}

console.log('before');
add(1, 2, result => console.log(`Result: ${result}`));
console.log('after');
