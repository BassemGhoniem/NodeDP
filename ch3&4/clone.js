/**
 * Created by bassem on 4/8/17.
 */

'use strict';

const fs = require('fs');
const path = require('path');

asyncFlow(function* clone(callback) {
  const fileName = path.basename(__filename);
  const myself = yield fs.readFile(fileName, 'utf8', callback);
  yield fs.writeFile(`clone_of_${fileName}`, myself, callback);
  console.log('Clone created');
});

function asyncFlow(generatorFunction) {
  const generator = generatorFunction(callback);
  generator.next();
  function callback(err, ...args) {
    if (err) {
      return generator.throw(err);
    }
    const results = args;
    return generator.next(results.length > 1 ? results : results[0]);
  }
}

