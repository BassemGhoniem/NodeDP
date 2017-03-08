'use strict';

const fs = require('fs');
const cache = {};

function consistentReadSync(filename, callback) {
  if(!cache[filename])
    cache[filename] = fs.readFileSync(filename, 'utf8');
  callback(cache[filename]);
}

function createFileReader(filename) {
  const listeners = [];
  consistentReadSync(filename, value => listeners.forEach(lis => lis(value)));
  return {
    onDataReady: listener => listeners.push(listener)
  };
}

// Noting will be printed because the exec is sync before listeners registered
const read1 = createFileReader('sync_cps.js');
read1.onDataReady(data => {
  console.log(`First call data: ${data}`);
  const read2 = createFileReader('sync_cps.js');
  read2.onDataReady(data => console.log(`Second call data: ${data}`));
});
