'use strict';

const fs = require('fs');
const cache = {};

function inconsistentRead(filename, callback) {
  if(cache[filename])
    callback(cache[filename]);
  else
    fs.readFile(filename, 'utf8', (err, data) => {
      cache[filename] = data;
      callback(data);
    });
}

function createFileReader(filename) {
  const listeners = [];
  inconsistentRead(filename, value => listeners.forEach(lis => lis(value)));
  return {
    onDataReady: listener => listeners.push(listener)
  };
}

// only First call will print because there's chance to the listeners
// to be registered because of the async call of the readFile
const read1 = createFileReader('sync_cps.js');
read1.onDataReady(data => {
  console.log(`First call data: ${data}`);
  const read2 = createFileReader('sync_cps.js');
  read2.onDataReady(data => console.log(`Second call data: ${data}`));
});
