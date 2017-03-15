/**
 * Created by bassem on 3/13/17.
 */

const fs = require('fs');
function readJSONThrows(filename, callback) {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      return callback(err);
    }
//no errors, propagate just the data
    callback(null, JSON.parse(data));
  });
}

try {
  readJSONThrows('tsconfig.json', (err, data) => {
    'use strict';
    if (err) return console.error(err);
    console.log(data);
  });
} catch (err) {
  console.log('This will not catch the JSON parsing exception');
}

process.on('uncaughtException', (err) => {
  console.error('This will catch at last the ' +
    'JSON parsing exception: ' + err.message);
// Terminates the application with 1 (error) as exit code:
// without the following line, the application would continue
  process.exit(1);
});