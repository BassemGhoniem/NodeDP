'use strict';

const fs = require('fs');
const cache = {};

function consistentReadAsync(filename, callback) {
  if(cache[filename])
    process.nextTick(() => callback(cache[filename]));
  else
    fs.readFile(filename, 'utf8', (err, data) => {
      callback(cache[filename] = data);
    });
}

function createFileReader(filename) {
  const listeners = [];
  consistentReadAsync(filename, value => listeners.forEach(lis => lis(value)));
  return {
    onDataReady: listener => listeners.push(listener)
  };
}

// both readers will print the data because they have time to register listeners
// because all the function calls are async.
const read1 = createFileReader('sync_cps.js');
read1.onDataReady(data => {
  console.log(`First call data: ${data}`);
  const read2 = createFileReader('sync_cps.js');
  read2.onDataReady(data => console.log(`Second call data: ${data}`));
});
