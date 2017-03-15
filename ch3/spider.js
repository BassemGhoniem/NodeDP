/**
 * Created by bassem on 3/15/17.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const request = require('request');
const mkdirp = require('mkdirp');

const utilities = require('./utilities');

function spider(url, callback) {
  const filename = utilities.urlToFilename(url);
  fs.exists(filename, (exists) => {        // [1]
    if (exists) {
      return callback(null, filename, false);
    }
    console.log(`Downloading ${url}`);
    request(url, (err, response, body) => {      // [2]
      if (err) {
        return callback(err);
      }
      mkdirp(path.dirname(filename), (err) => {    // [3]
        if (err) {
          return callback(err);
        }
        fs.writeFile(filename, body, (err) => { // [4]
          if (err) {
            return callback(err);
          }
          return callback(null, filename, true);
        });
      });
    });
  });
}

spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    console.log(err);
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`);
  } else {
    console.log(`"${filename}" was already downloaded`);
  }
});
