/**
 * Created by bassem on 4/8/17.
 */

'use strict';

const fs = require('fs');
const path = require('path');

function readFileThunk(filename, opt) {
  return function read(callback) {
    fs.readFile(filename, opt, callback);
  };
}

function writeFileThunk(filename, opt) {
  return function write(callback) {
    fs.writeFile(filename, opt, callback);
  };
}
asyncFlowWithThunks(function* clone() {
  const fileName = path.basename(__filename);
  const myself = yield readFileThunk(__filename, 'utf8');
  yield writeFileThunk(`clone_of_${fileName}`, myself);
  console.log('Clone created');
});

function asyncFlowWithThunks(generatorFunction) {
  const generator = generatorFunction();
  const thnk = generator.next().value;
  thnk && thnk(callback);

  function callback(err, ...args) {
    if (err) {
      return generator.throw(err);
    }
    const results = args;
    const thunk = generator.next(results.length > 1 ? results : results[0]).value;
    return thunk && thunk(callback);
  }
}
