/**
 * Created by bassem on 3/13/17.
 */

'use strict';
const fs = require('fs');


function readJSON(filename, callback) {
  fs.readFile(filename, 'utf8', (err, data) => {
    let parsed;
    if(err)
//propagate the error and exit the current function
      return callback(err);
    try {
//parse the file contents
      parsed = JSON.parse(data);
    } catch(err) {
//catch parsing errors
      return callback(err);
    }
//no errors, propagate just the data
    callback(null, parsed);
  });
}

readJSON('tsconfig.json', (err, data) => {
  if (err) {
    return console.error(err);
  }
  console.log(data);
});
