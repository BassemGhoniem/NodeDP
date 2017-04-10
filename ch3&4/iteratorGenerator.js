/**
 * Created by bassem on 4/9/17.
 */

'use strict';

function* iteratorGenerator(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i];
  }
}
const iterator = iteratorGenerator(['apple', 'orange', 'watermelon']);
let currentItem = iterator.next();

while (!currentItem.done) {
  console.log(currentItem.value);
  currentItem = iterator.next();
}

function* twoWayGenerator() {
  const what = yield null;
  console.log(`Hello ${what}`);
}

const twoWay = twoWayGenerator();
twoWay.next();
// twoWay.next('world');
twoWay.throw(new Error('Throw exception'));
